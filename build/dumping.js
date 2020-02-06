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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kdW1waW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0RBQXdCO0FBQ3hCLGdEQUF3QjtBQUN4QiwyQkFBMEQ7QUFDMUQscUNBT2tCO0FBQ2xCLHlDQWFvQjtBQU9QLFFBQUEsWUFBWSxHQUFHLENBQUMsTUFBZSxFQUFFLFNBQWlCLEVBQVcsRUFBRTtJQUN4RSxJQUFJO1FBQ0EsSUFBSSxDQUFDLGVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUN4QixjQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDeEI7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2YsTUFBTSxPQUFPLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxlQUFVLENBQUMsT0FBTyxDQUFDO2dCQUFFLGNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztLQUNOO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2xELE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRVcsUUFBQSxlQUFlLEdBQUcsQ0FBQyxPQUF1QixFQUFZLEVBQUU7SUFDakUsTUFBTSxNQUFNLEdBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLDZCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRSxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUM7QUFFVyxRQUFBLGdCQUFnQixH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