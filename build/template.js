"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.templateStart = (stack) => `
#
# dcreverse - stack: ${stack.namespace}
#
version: '3.6'

services:
`;
exports.templateServiceLine = (service) => `  ${service.Spec.Name}:`;
exports.templateImageLine = (service) => `    image: ${service.Spec.TaskTemplate.ContainerSpec.Image.split('@sha')[0]}`;
exports.templateArgsLine = (args) => args !== undefined && args.length > 0
    ? `    command: "${args.join(' ')}"`
    : '';
exports.templateEnvLine = (env) => {
    const arr = [];
    if (env !== undefined && env.length > 0)
        arr.push('    environment:', ...env.map(e => `      - ${e}`));
    return arr;
};
exports.templateServiceVolume = (volume) => `      - ${volume.Source}:${volume.Target}`;
exports.templateServiceNetworkPure = (net) => [
    `      - ${net.Link.Name}`
];
exports.templateServiceNetworkAliases = (net) => {
    const arr = [];
    arr.push(`      ${net.Link.Name}:`, '        aliases:', ...utils_1.uniqueStringArray(net.Aliases).map(aliases => `          - ${aliases}`));
    return arr;
};
exports.templateServiceNetwork = (net) => net.Aliases.length > 0
    ? exports.templateServiceNetworkAliases(net)
    : exports.templateServiceNetworkPure(net);
exports.templateServiceConfig = (config) => {
    const arr = [];
    arr.push(`      - source: ${config.ConfigName}`, `        target: ${config.File.Name}`, `        uid: ${config.File.UID}`, `        gid: ${config.File.GID}`, `        mode: ${config.File.Mode}`);
    return arr;
};
exports.templateVolumesDef = (volume) => {
    const arr = [
        `  ${volume.Source}:`,
        `    name: ${volume.Source}`,
        ...(volume.VolumeOptions !== undefined
            ? [`    driver: ${volume.VolumeOptions.DriverConfig.Name}`]
            : [])
    ];
    return arr;
};
exports.templateNetworksDef = (net) => {
    const labels = net.Link.Labels;
    const arr = [
        `  ${net.Link.Name}:`,
        ...(labels && labels['com.docker.stack.namespace'] !== undefined
            ? []
            : ['    external: true'])
    ];
    return arr;
};
exports.templateServiceLabels = (k, v) => `      - ${k}=${v}`;
exports.templateServiceDeployLabels = (k, v) => `        - ${k}=${v}`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSxtQ0FBNEM7QUFFL0IsUUFBQSxhQUFhLEdBQUcsQ0FBQyxLQUFZLEVBQVUsRUFBRSxDQUFDOzt1QkFFaEMsS0FBSyxDQUFDLFNBQVM7Ozs7O0NBS3JDLENBQUM7QUFFVyxRQUFBLG1CQUFtQixHQUFHLENBQUMsT0FBZ0IsRUFBVSxFQUFFLENBQzVELEtBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQztBQUVqQixRQUFBLGlCQUFpQixHQUFHLENBQUMsT0FBZ0IsRUFBVSxFQUFFLENBQzFELGNBQ0ksT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUNqRSxFQUFFLENBQUM7QUFFTSxRQUFBLGdCQUFnQixHQUFHLENBQUMsSUFBYyxFQUFVLEVBQUUsQ0FDdkQsSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7SUFDakMsQ0FBQyxDQUFDLGlCQUFpQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHO0lBQ3BDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFQSxRQUFBLGVBQWUsR0FBRyxDQUFDLEdBQWEsRUFBWSxFQUFFO0lBQ3ZELE1BQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztJQUN6QixJQUFJLEdBQUcsS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQ25DLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbEUsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDLENBQUM7QUFFVyxRQUFBLHFCQUFxQixHQUFHLENBQUMsTUFBb0IsRUFBVSxFQUFFLENBQ2xFLFdBQVcsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFbkMsUUFBQSwwQkFBMEIsR0FBRyxDQUFDLEdBQW1CLEVBQVksRUFBRSxDQUFDO0lBQ3pFLFdBQVksR0FBRyxDQUFDLElBQWdCLENBQUMsSUFBSSxFQUFFO0NBQzFDLENBQUM7QUFFVyxRQUFBLDZCQUE2QixHQUFHLENBQ3pDLEdBQW1CLEVBQ1gsRUFBRTtJQUNWLE1BQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztJQUN6QixHQUFHLENBQUMsSUFBSSxDQUNKLFNBQVUsR0FBRyxDQUFDLElBQWdCLENBQUMsSUFBSSxHQUFHLEVBQ3RDLGtCQUFrQixFQUNsQixHQUFHLHlCQUFpQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQ2pDLE9BQU8sQ0FBQyxFQUFFLENBQUMsZUFBZSxPQUFPLEVBQUUsQ0FDdEMsQ0FDSixDQUFDO0lBQ0YsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDLENBQUM7QUFFVyxRQUFBLHNCQUFzQixHQUFHLENBQUMsR0FBbUIsRUFBWSxFQUFFLENBQ3BFLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUM7SUFDbEIsQ0FBQyxDQUFDLHFDQUE2QixDQUFDLEdBQUcsQ0FBQztJQUNwQyxDQUFDLENBQUMsa0NBQTBCLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFN0IsUUFBQSxxQkFBcUIsR0FBRyxDQUFDLE1BQXFCLEVBQVksRUFBRTtJQUNyRSxNQUFNLEdBQUcsR0FBYSxFQUFFLENBQUM7SUFDekIsR0FBRyxDQUFDLElBQUksQ0FDSixtQkFBbUIsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUN0QyxtQkFBbUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFDckMsZ0JBQWdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQ2pDLGdCQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUNqQyxpQkFBaUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FDdEMsQ0FBQztJQUNGLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRVcsUUFBQSxrQkFBa0IsR0FBRyxDQUFDLE1BQW9CLEVBQVksRUFBRTtJQUNqRSxNQUFNLEdBQUcsR0FBYTtRQUNsQixLQUFLLE1BQU0sQ0FBQyxNQUFNLEdBQUc7UUFDckIsYUFBYSxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQzVCLEdBQUcsQ0FBQyxNQUFNLENBQUMsYUFBYSxLQUFLLFNBQVM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsZUFBZSxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMzRCxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQ1osQ0FBQztJQUNGLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRVcsUUFBQSxtQkFBbUIsR0FBRyxDQUFDLEdBQW1CLEVBQVksRUFBRTtJQUNqRSxNQUFNLE1BQU0sR0FBSSxHQUFHLENBQUMsSUFBZ0IsQ0FBQyxNQUFNLENBQUM7SUFDNUMsTUFBTSxHQUFHLEdBQWE7UUFDbEIsS0FBTSxHQUFHLENBQUMsSUFBZ0IsQ0FBQyxJQUFJLEdBQUc7UUFDbEMsR0FBRyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsNEJBQTRCLENBQUMsS0FBSyxTQUFTO1lBQzVELENBQUMsQ0FBQyxFQUFFO1lBQ0osQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQztLQUNoQyxDQUFDO0lBQ0YsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDLENBQUM7QUFFVyxRQUFBLHFCQUFxQixHQUFHLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBVSxFQUFFLENBQ2xFLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBRVgsUUFBQSwyQkFBMkIsR0FBRyxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQVUsRUFBRSxDQUN4RSxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyJ9