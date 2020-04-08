"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const docker_1 = require("./docker");
const template_1 = require("./template");
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
exports.generateComposes = (stacks, verbose = false) => {
    stacks.forEach(stack => {
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
        // eslint-disable-next-line
        console.log(dcymlFinal);
    });
};
exports.dumping = async (dockerUrl, namespaceFilter, verbose = false) => {
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
        .filter(s => s.namespace === namespaceFilter);
    if (verbose)
        stacks.forEach(s => console.log(`VERBOSE: StackName: ${s}`));
    exports.generateComposes(stacks, verbose);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kdW1waW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsZ0RBQXdCO0FBQ3hCLHFDQU9rQjtBQUNsQix5Q0Fhb0I7QUFPUCxRQUFBLGVBQWUsR0FBRyxDQUFDLE9BQXVCLEVBQVksRUFBRTtJQUNqRSxNQUFNLE1BQU0sR0FBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsNkJBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQztBQUVXLFFBQUEsZ0JBQWdCLEdBQUcsQ0FBQyxRQUEwQixFQUFZLEVBQUU7SUFDckUsTUFBTSxNQUFNLEdBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN2QyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLDhCQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRSxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUM7QUFFVyxRQUFBLGVBQWUsR0FBRyxDQUFDLE9BQXdCLEVBQVksRUFBRTtJQUNsRSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQztRQUFFLE9BQU8sRUFBRSxDQUFDO0lBQ3BDLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUM1QixPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUM7QUFFVyxRQUFBLGdCQUFnQixHQUFHLENBQUMsTUFBZSxFQUFFLE9BQU8sR0FBRyxLQUFLLEVBQVEsRUFBRTtJQUN2RSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ25CLHFCQUFxQjtRQUNyQixNQUFNLEtBQUss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