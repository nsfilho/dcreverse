import { Stack } from './dumping';
import { Service, ServiceMount, ServiceNetwork, Network, ServiceConfig } from './docker';
import { uniqueStringArray } from './utils';

export const template_start = (stack: Stack) => `
#
# dcreverse - stack: ${stack.namespace}
#
version: '3.6'

services:
`;

export const template_service_line = (service: Service) => `  ${service.Spec.Name}:`;

export const template_image_line = (service: Service) =>
    `    image: ${service.Spec.TaskTemplate.ContainerSpec.Image.split('@sha')[0]}`;

export const template_args_line = (args: string[]) =>
    args !== undefined && args.length > 0 ? `    command: "${args.join(' ')}"` : '';

export const template_env_line = (env: string[]) => {
    const arr: string[] = [];
    if (env !== undefined && env.length > 0) arr.push('    environment:', ...env.map(e => `      - ${e}`));
    return arr;
};

export const template_service_volume = (volume: ServiceMount) => `      - ${volume.Source}:${volume.Target}`;

export const template_service_networkPure = (net: ServiceNetwork): string[] => [
    `      - ${(net.Link as Network).Name}`
];

export const template_service_networkAliases = (net: ServiceNetwork): string[] => {
    const arr: string[] = [];
    arr.push(`      ${(net.Link as Network).Name}:`, `        aliases:`);
    arr.push(...uniqueStringArray(net.Aliases).map(aliases => `          - ${aliases}`));
    return arr;
};

export const template_service_network = (net: ServiceNetwork): string[] =>
    net.Aliases.length > 0 ? template_service_networkAliases(net) : template_service_networkPure(net);

export const template_service_config = (config: ServiceConfig): string[] => {
    const arr: string[] = [];
    arr.push(
        `      - source: ${config.ConfigName}`,
        `        target: ${config.File.Name}`,
        `        uid: ${config.File.UID}`,
        `        gid: ${config.File.GID}`,
        `        mode: ${config.File.Mode}`
    );
    return arr;
};

export const template_volumes_def = (volume: ServiceMount): string[] => {
    const arr: string[] = [
        `  ${volume.Source}:`,
        `    name: ${volume.Source}`,
        ...(volume.VolumeOptions !== undefined ? [`    driver: ${volume.VolumeOptions.DriverConfig.Name}`] : [])
    ];
    return arr;
};

export const template_networks_def = (net: ServiceNetwork): string[] => {
    const labels = (net.Link as Network).Labels;
    const arr: string[] = [
        `  ${(net.Link as Network).Name}:`,
        ...(labels && labels['com.docker.stack.namespace'] !== undefined ? [] : ['    external: true'])
    ];
    return arr;
};

export const template_service_labels = (k: string, v: string): string => `      - ${k}=${v}`;

export const template_service_deploy_labels = (k: string, v: string): string => `        - ${k}=${v}`;
