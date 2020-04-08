"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const fs_1 = require("fs");
const docker_1 = require("./docker");
const template_1 = require("./template");
/**
 * Generate dir structure to put docker-compose files
 *
 * @returns {boolean} Successful or not
 */
exports.generateDirs = (stacks, outputDir) => {
    try {
        if (!fs_1.existsSync(outputDir)) {
            fs_1.mkdirSync(outputDir);
        }
        stacks.forEach(s => {
            const dirPath = path_1.default.join(outputDir, s.namespace);
            if (!fs_1.existsSync(dirPath))
                fs_1.mkdirSync(dirPath);
        });
    }
    catch (err) {
        console.error('Error creating directories:', err);
        return false;
    }
    return true;
};
exports.generateVolumes = (volumes) => {
    const result = [`volumes:`];
    volumes.forEach(vol => result.push(...template_1.templateVolumesDef(vol)));
    return result;
};
exports.generateNetworks = (networks) => {
    const result = [`networks:`];
    networks.forEach(net => result.push(...template_1.templateNetworksDef(net)));
    return result;
};
exports.generateConfigs = (configs) => {
    if (configs.length === 0)
        return [];
    const result = [];
    return result;
};
exports.generateComposes = (stacks, outputDir, verbose = false) => {
    stacks.forEach(stack => {
        // Path Definitions
        const basePath = path_1.default.join(outputDir, stack.namespace);
        const composePath = path_1.default.join(basePath, 'docker-compose.yml');
        // Buffer definitions
        const dcyml = [];
        const volumes = [];
        const networks = [];
        const configs = [];
        // Starting buffers
        dcyml.push(template_1.templateStart(stack));
        const addVolume = (volume) => {
            if (volumes.findIndex(v => v.Source === volume.Source) === -1)
                volumes.push(volume);
            dcyml.push(template_1.templateServiceVolume(volume));
        };
        const addNetwork = (net) => {
            if (networks.findIndex(n => n.Target === net.Target) === -1)
                networks.push(net);
            if (net.Link === undefined)
                throw Error(`Network ${net.Target} not found`);
            dcyml.push(...template_1.templateServiceNetwork(net));
        };
        const addConfig = (config) => {
            if (configs.findIndex(c => c.ConfigID === config.ConfigID) === -1)
                configs.push(config);
            dcyml.push(...template_1.templateServiceConfig(config));
        };
        stack.services.forEach(service => {
            const task = service.Spec.TaskTemplate;
            const spec = task.ContainerSpec;
            dcyml.push(template_1.templateServiceLine(service));
            dcyml.push(template_1.templateImageLine(service));
            if (spec.Args !== undefined && spec.Args.length > 0)
                dcyml.push(template_1.templateArgsLine(spec.Args));
            dcyml.push(...template_1.templateEnvLine(spec.Env));
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
                    .map(([k, v]) => template_1.templateServiceLabels(k, v));
                if (result.length > 0)
                    dcyml.push(`    labels:`, ...result);
            }
            if (service.Spec.Labels !== undefined) {
                const result = Object.entries(service.Spec.Labels)
                    .filter(([k]) => ![
                    'com.docker.stack.namespace',
                    'com.docker.stack.image'
                ].includes(k))
                    .map(([k, v]) => template_1.templateServiceDeployLabels(k, v));
                if (result.length > 0)
                    dcyml.push(`    deploy:`, `      labels:`, ...result);
            }
            if (verbose)
                dcyml.push(...util_1.default
                    .formatWithOptions({
                    colors: true,
                    showHidden: true,
                    showProxy: true,
                    getters: true,
                    depth: 15
                }, '%o %o', service, service.Spec.TaskTemplate.Networks)
                    .split('\n')
                    .map(s => `# ${s}`));
            dcyml.push('\n');
        });
        const dcymlFinal = `${dcyml.join('\n')}\n${exports.generateVolumes(volumes).join('\n')}\n${exports.generateNetworks(networks).join('\n')}\n${exports.generateConfigs(configs).join('\n')}`;
        console.log('Writing', composePath);
        fs_1.writeFileSync(composePath, dcymlFinal);
    });
};
exports.dumping = async (dockerUrl, outputDir, namespaceFilter, verbose = false) => {
    const allNetworks = await docker_1.getAllNetworks(dockerUrl);
    const allServices = await docker_1.getAllServices(dockerUrl);
    // Build Stacks
    const stacks = allServices
        .reduce((acc, service) => {
        const namespace = service.Spec.Labels['com.docker.stack.namespace'];
        if (namespace !== undefined) {
            const addStack = (content) => {
                acc.push(content);
                return content;
            };
            const stack = acc.find(s => s.namespace === namespace) ||
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
        .filter(s => namespaceFilter === undefined || s.namespace === namespaceFilter);
    if (exports.generateDirs(stacks, outputDir))
        exports.generateComposes(stacks, outputDir, verbose);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kdW1waW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0RBQXdCO0FBQ3hCLGdEQUF3QjtBQUN4QiwyQkFBMEQ7QUFDMUQscUNBT2tCO0FBQ2xCLHlDQWFvQjtBQU9wQjs7OztHQUlHO0FBQ1UsUUFBQSxZQUFZLEdBQUcsQ0FBQyxNQUFlLEVBQUUsU0FBaUIsRUFBVyxFQUFFO0lBQ3hFLElBQUk7UUFDQSxJQUFJLENBQUMsZUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3hCLGNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN4QjtRQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDZixNQUFNLE9BQU8sR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLGVBQVUsQ0FBQyxPQUFPLENBQUM7Z0JBQUUsY0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0tBQ047SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbEQsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFVyxRQUFBLGVBQWUsR0FBRyxDQUFDLE9BQXVCLEVBQVksRUFBRTtJQUNqRSxNQUFNLE1BQU0sR0FBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsNkJBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQztBQUVX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