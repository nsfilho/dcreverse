import path from 'path';
import util from 'util';
import {
    getAllServices,
    Service,
    getAllNetworks,
    Network,
    ServiceMount,
    ServiceNetwork,
    ServiceConfig
} from './docker';
import { mkdirSync, existsSync } from 'fs';
import {
    template_start,
    template_service_line,
    template_image_line,
    template_args_line,
    template_env_line,
    template_service_volume,
    template_service_network,
    template_service_config,
    template_volumes_def,
    template_networks_def,
    template_service_labels,
    template_service_deploy_labels
} from './template';

export interface Stack {
    namespace: string;
    services: Service[];
}

export const generateDirs = (stacks: Stack[], outputDir: string): boolean => {
    try {
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir);
        }
        stacks.forEach(s => {
            const dirPath = path.join(outputDir, s.namespace);
            if (!existsSync(dirPath)) mkdirSync(dirPath);
        });
    } catch (err) {
        console.error('Error creating directories:', err);
        return false;
    }
    return true;
};

export const generateVolumes = (volumes: ServiceMount[]): string[] => {
    const result: string[] = [`volumes:`];
    volumes.forEach(vol => result.push(...template_volumes_def(vol)));
    return result;
};

export const generateNetworks = (networks: ServiceNetwork[]): string[] => {
    const result: string[] = [`networks:`];
    networks.forEach(net => result.push(...template_networks_def(net)));
    return result;
};

export const generateConfigs = (configs: ServiceConfig[]): string[] => {
    if (configs.length === 0) return [];
    const result: string[] = [];
    return result;
};

export const generateComposes = (stacks: Stack[], outputDir: string, verbose: boolean = false) => {
    stacks.forEach(stack => {
        // Path Definitions
        const basePath = path.join(outputDir, stack.namespace);
        const composePath = path.join(basePath, 'docker-compose.yml');

        // Buffer definitions
        const dcyml: string[] = [];
        const volumes: ServiceMount[] = [];
        const networks: ServiceNetwork[] = [];
        const configs: ServiceConfig[] = [];

        // Starting buffers
        dcyml.push(template_start(stack));

        const addVolume = (volume: ServiceMount) => {
            if (volumes.findIndex(v => v.Source === volume.Source) === -1) volumes.push(volume);
            dcyml.push(template_service_volume(volume));
        };

        const addNetwork = (net: ServiceNetwork) => {
            if (networks.findIndex(n => n.Target === net.Target) === -1) networks.push(net);
            if (net.Link === undefined) throw Error(`Network ${net.Target} not found`);
            dcyml.push(...template_service_network(net));
        };

        const addConfig = (config: ServiceConfig) => {
            if (configs.findIndex(c => c.ConfigID === config.ConfigID) === -1) configs.push(config);
            dcyml.push(...template_service_config(config));
        };

        stack.services.forEach(service => {
            const task = service.Spec.TaskTemplate;
            const spec = task.ContainerSpec;
            dcyml.push(template_service_line(service));
            dcyml.push(template_image_line(service));
            spec.Args !== undefined && spec.Args.length > 0 && dcyml.push(template_args_line(spec.Args));
            dcyml.push(...template_env_line(spec.Env));

            if (spec.Mounts !== undefined) {
                dcyml.push(`    volumes:`);
                spec.Mounts.forEach(volume => addVolume(volume));
            }

            if (task.Networks.length > 0) {
                dcyml.push(`    networks:`);
                task.Networks.forEach(net => addNetwork(net));
            }

            if (spec.Configs !== undefined && spec.Configs.length > 0) {
                dcyml.push(`    configs:`);
                spec.Configs.forEach(config => addConfig(config));
            }

            if (spec.Labels !== undefined) {
                const result = Object.entries(spec.Labels)
                    .filter(([k, v]) => k !== 'com.docker.stack.namespace')
                    .map(([k, v]) => template_service_labels(k, v));
                if (result.length > 0) dcyml.push(`    labels:`, ...result);
            }

            if (service.Spec.Labels !== undefined) {
                const result = Object.entries(service.Spec.Labels)
                    .filter(([k, v]) => !['com.docker.stack.namespace', 'com.docker.stack.image'].includes(k))
                    .map(([k, v]) => template_service_deploy_labels(k, v));
                if (result.length > 0) dcyml.push(`    deploy:`, `      labels:`, ...result);
            }

            if (verbose)
                dcyml.push(
                    ...util
                        .formatWithOptions(
                            {
                                colors: true,
                                showHidden: true,
                                showProxy: true,
                                getters: true,
                                depth: 15
                            },
                            '%o %o',
                            service,
                            service.Spec.TaskTemplate.Networks
                        )
                        .split('\n')
                        .map(s => '# ' + s)
                );
            dcyml.push('\n\n');
        });

        const dcymlFinal =
            dcyml.join('\n') +
            '\n' +
            generateVolumes(volumes).join('\n') +
            '\n' +
            generateNetworks(networks).join('\n') +
            '\n' +
            generateConfigs(configs).join('\n');
        console.log(dcymlFinal + '\n\n');
    });
};

export const dumping = async (
    dockerUrl: string,
    outputDir: string,
    namespaceFilter?: string,
    verbose: boolean = false
) => {
    const allNetworks = await getAllNetworks(dockerUrl);
    const allServices = await getAllServices(dockerUrl);

    // Build Stacks
    const stacks: Stack[] = allServices
        .reduce<Stack[]>((acc, service) => {
            const namespace = service.Spec.Labels['com.docker.stack.namespace'];
            if (namespace !== undefined) {
                const addStack = (content: Stack) => {
                    acc.push(content);
                    return content;
                };
                const stack: Stack =
                    acc.find(s => s.namespace === namespace) ||
                    addStack({
                        namespace,
                        services: []
                    });
                service.Spec.TaskTemplate.Networks.forEach(net => {
                    net.Link = allNetworks.find(n => net.Target === n.Id);
                });
                stack.services.push(service);
            }
            return acc;
        }, [])
        .filter(s => namespaceFilter === undefined || s.namespace === namespaceFilter);

    if (generateDirs(stacks, outputDir)) generateComposes(stacks, outputDir, verbose);
};
