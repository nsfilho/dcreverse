import path from 'path';
import util from 'util';
import {
    getAllServices,
    getAllNetworks,
    Service,
    ServiceMount,
    ServiceNetwork,
    ServiceConfig
} from './docker';
import {
    templateStart,
    templateServiceLine,
    templateImageLine,
    templateArgsLine,
    templateEnvLine,
    templateServiceVolume,
    templateServiceNetwork,
    templateServiceConfig,
    templateVolumesDef,
    templateNetworksDef,
    templateServiceLabels,
    templateServiceDeployLabels
} from './template';

export interface Stack {
    namespace: string;
    services: Service[];
}

export const generateVolumes = (volumes: ServiceMount[]): string[] => {
    const result: string[] = [`volumes:`];
    volumes.forEach(vol => result.push(...templateVolumesDef(vol)));
    return result;
};

export const generateNetworks = (networks: ServiceNetwork[]): string[] => {
    const result: string[] = [`networks:`];
    networks.forEach(net => result.push(...templateNetworksDef(net)));
    return result;
};

export const generateConfigs = (configs: ServiceConfig[]): string[] => {
    if (configs.length === 0) return [];
    const result: string[] = [];
    return result;
};

export const generateComposes = (stacks: Stack[], verbose = false): void => {
    stacks.forEach(stack => {
        // Buffer definitions
        const dcyml: string[] = [];
        const volumes: ServiceMount[] = [];
        const networks: ServiceNetwork[] = [];
        const configs: ServiceConfig[] = [];

        // Starting buffers
        dcyml.push(templateStart(stack));

        const addVolume = (volume: ServiceMount): void => {
            if (volumes.findIndex(v => v.Source === volume.Source) === -1)
                volumes.push(volume);
            dcyml.push(templateServiceVolume(volume));
        };

        const addNetwork = (net: ServiceNetwork): void => {
            if (networks.findIndex(n => n.Target === net.Target) === -1)
                networks.push(net);
            if (net.Link === undefined)
                throw Error(`Network ${net.Target} not found`);
            dcyml.push(...templateServiceNetwork(net));
        };

        const addConfig = (config: ServiceConfig): void => {
            if (configs.findIndex(c => c.ConfigID === config.ConfigID) === -1)
                configs.push(config);
            dcyml.push(...templateServiceConfig(config));
        };

        stack.services.forEach(service => {
            const task = service.Spec.TaskTemplate;
            const spec = task.ContainerSpec;
            dcyml.push(templateServiceLine(service));
            dcyml.push(templateImageLine(service));
            if (spec.Args !== undefined && spec.Args.length > 0)
                dcyml.push(templateArgsLine(spec.Args));
            dcyml.push(...templateEnvLine(spec.Env));

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
                    .filter(([k]) => k !== 'com.docker.stack.namespace')
                    .map(([k, v]) => templateServiceLabels(k, v));
                if (result.length > 0) dcyml.push(`    labels:`, ...result);
            }

            if (service.Spec.Labels !== undefined) {
                const result = Object.entries(service.Spec.Labels)
                    .filter(
                        ([k]) =>
                            ![
                                'com.docker.stack.namespace',
                                'com.docker.stack.image'
                            ].includes(k)
                    )
                    .map(([k, v]) => templateServiceDeployLabels(k, v));
                if (result.length > 0)
                    dcyml.push(`    deploy:`, `      labels:`, ...result);
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
                        .map(s => `# ${s}`)
                );
            dcyml.push('\n');
        });

        const dcymlFinal = `${dcyml.join('\n')}\n${generateVolumes(
            volumes
        ).join('\n')}\n${generateNetworks(networks).join(
            '\n'
        )}\n${generateConfigs(configs).join('\n')}`;
        // eslint-disable-next-line
        console.log(dcymlFinal);
    });
};

export const dumping = async (
    dockerUrl: string,
    namespaceFilter: string,
    verbose = false
): Promise<void> => {
    const allNetworks = await getAllNetworks(dockerUrl);
    const allServices = await getAllServices(dockerUrl);

    // Build Stacks
    const stacks: Stack[] = allServices
        .reduce<Stack[]>((acc, service) => {
            const namespace = service.Spec.Labels['com.docker.stack.namespace'];
            if (namespace !== undefined) {
                const addStack = (content: Stack): Stack => {
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
                    // eslint-disable-next-line no-param-reassign
                    net.Link = allNetworks.find(n => net.Target === n.Id);
                });
                stack.services.push(service);
            }
            return acc;
        }, [])
        .filter(s => s.namespace === namespaceFilter);
    if (verbose) stacks.forEach(s => console.log(`VERBOSE: StackName: ${s}`));
    generateComposes(stacks, verbose);
};
