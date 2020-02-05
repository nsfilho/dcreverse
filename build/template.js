"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.template_start = (stack) => `
#
# dcreverse - stack: ${stack.namespace}
#
version: '3.6'

services:
`;
exports.template_service_line = (service) => `  ${service.Spec.Name}:`;
exports.template_image_line = (service) => `    image: ${service.Spec.TaskTemplate.ContainerSpec.Image.split('@sha')[0]}`;
exports.template_args_line = (args) => args !== undefined && args.length > 0 ? `    command: "${args.join(' ')}"` : '';
exports.template_env_line = (env) => {
    const arr = [];
    if (env !== undefined && env.length > 0)
        arr.push('    environment:', ...env.map(e => `      - ${e}`));
    return arr;
};
exports.template_service_volume = (volume) => `      - ${volume.Source}:${volume.Target}`;
exports.template_service_networkPure = (net) => [
    `      - ${net.Link.Name}`
];
exports.template_service_networkAliases = (net) => {
    const arr = [];
    arr.push(`      ${net.Link.Name}:`, `        aliases:`);
    arr.push(...utils_1.uniqueStringArray(net.Aliases).map(aliases => `          - ${aliases}`));
    return arr;
};
exports.template_service_network = (net) => net.Aliases.length > 0 ? exports.template_service_networkAliases(net) : exports.template_service_networkPure(net);
exports.template_service_config = (config) => {
    const arr = [];
    arr.push(`      - source: ${config.ConfigName}`, `        target: ${config.File.Name}`, `        uid: ${config.File.UID}`, `        gid: ${config.File.GID}`, `        mode: ${config.File.Mode}`);
    return arr;
};
exports.template_volumes_def = (volume) => {
    const arr = [
        `  ${volume.Source}:`,
        `    name: ${volume.Source}`,
        ...(volume.VolumeOptions !== undefined ? [`    driver: ${volume.VolumeOptions.DriverConfig.Name}`] : [])
    ];
    return arr;
};
exports.template_networks_def = (net) => {
    const arr = [`  ${net.Link.Name}:`];
    return arr;
};
exports.template_service_labels = (k, v) => `      - ${k}=${v}`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxtQ0FBNEM7QUFFL0IsUUFBQSxjQUFjLEdBQUcsQ0FBQyxLQUFZLEVBQUUsRUFBRSxDQUFDOzt1QkFFekIsS0FBSyxDQUFDLFNBQVM7Ozs7O0NBS3JDLENBQUM7QUFFVyxRQUFBLHFCQUFxQixHQUFHLENBQUMsT0FBZ0IsRUFBRSxFQUFFLENBQUMsS0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO0FBRXhFLFFBQUEsbUJBQW1CLEdBQUcsQ0FBQyxPQUFnQixFQUFFLEVBQUUsQ0FDcEQsY0FBYyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBRXRFLFFBQUEsa0JBQWtCLEdBQUcsQ0FBQyxJQUFjLEVBQUUsRUFBRSxDQUNqRCxJQUFJLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFdkUsUUFBQSxpQkFBaUIsR0FBRyxDQUFDLEdBQWEsRUFBRSxFQUFFO0lBQy9DLE1BQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztJQUN6QixJQUFJLEdBQUcsS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2RyxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMsQ0FBQztBQUVX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