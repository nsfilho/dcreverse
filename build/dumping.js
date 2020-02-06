"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const docker_1 = require("./docker");
const fs_1 = require("fs");
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
    volumes.forEach(vol => result.push(...template_1.template_volumes_def(vol)));
    return result;
};
exports.generateNetworks = (networks) => {
    const result = [`networks:`];
    networks.forEach(net => result.push(...template_1.template_networks_def(net)));
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
        dcyml.push(template_1.template_start(stack));
        const addVolume = (volume) => {
            if (volumes.findIndex(v => v.Source === volume.Source) === -1)
                volumes.push(volume);
            dcyml.push(template_1.template_service_volume(volume));
        };
        const addNetwork = (net) => {
            if (networks.findIndex(n => n.Target === net.Target) === -1)
                networks.push(net);
            if (net.Link === undefined)
                throw Error(`Network ${net.Target} not found`);
            dcyml.push(...template_1.template_service_network(net));
        };
        const addConfig = (config) => {
            if (configs.findIndex(c => c.ConfigID === config.ConfigID) === -1)
                configs.push(config);
            dcyml.push(...template_1.template_service_config(config));
        };
        stack.services.forEach(service => {
            const task = service.Spec.TaskTemplate;
            const spec = task.ContainerSpec;
            dcyml.push(template_1.template_service_line(service));
            dcyml.push(template_1.template_image_line(service));
            spec.Args !== undefined && spec.Args.length > 0 && dcyml.push(template_1.template_args_line(spec.Args));
            dcyml.push(...template_1.template_env_line(spec.Env));
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
                    .map(([k, v]) => template_1.template_service_labels(k, v));
                if (result.length > 0)
                    dcyml.push(`    labels:`, ...result);
            }
            if (service.Spec.Labels !== undefined) {
                const result = Object.entries(service.Spec.Labels)
                    .filter(([k, v]) => !['com.docker.stack.namespace', 'com.docker.stack.image'].includes(k))
                    .map(([k, v]) => template_1.template_service_deploy_labels(k, v));
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
                    .map(s => '# ' + s));
            dcyml.push('\n\n');
        });
        const dcymlFinal = dcyml.join('\n') +
            '\n' +
            exports.generateVolumes(volumes).join('\n') +
            '\n' +
            exports.generateNetworks(networks).join('\n') +
            '\n' +
            exports.generateConfigs(configs).join('\n');
        console.log(dcymlFinal + '\n\n');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kdW1waW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0RBQXdCO0FBQ3hCLGdEQUF3QjtBQUN4QixxQ0FRa0I7QUFDbEIsMkJBQTJDO0FBQzNDLHlDQWFvQjtBQU9QLFFBQUEsWUFBWSxHQUFHLENBQUMsTUFBZSxFQUFFLFNBQWlCLEVBQVcsRUFBRTtJQUN4RSxJQUFJO1FBQ0EsSUFBSSxDQUFDLGVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUN4QixjQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDeEI7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2YsTUFBTSxPQUFPLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxlQUFVLENBQUMsT0FBTyxDQUFDO2dCQUFFLGNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztLQUNOO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2xELE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRVcsUUFBQSxlQUFlLEdBQUcsQ0FBQyxPQUF1QixFQUFZLEVBQUU7SUFDakUsTUFBTSxNQUFNLEdBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLCtCQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRSxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUM7QUFFVyxRQUFBLGdCQUFnQixH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