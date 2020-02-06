import { Stack } from './dumping';
import {
    Service,
    ServiceMount,
    ServiceNetwork,
    Network,
    ServiceConfig
} from './docker';
import { uniqueStringArray } from './utils';

export const templateStart = (stack: Stack): string => `
#
# dcreverse - stack: ${stack.namespace}
#
version: '3.6'

services:
`;

export const templateServiceLine = (service: Service): string =>
    `  ${service.Spec.Name}:`;

export const templateImageLine = (service: Service): string =>
    `    image: ${
        service.Spec.TaskTemplate.ContainerSpec.Image.split('@sha')[0]
    }`;

export const templateArgsLine = (args: string[]): string =>
    args !== undefined && args.length > 0
        ? `    command: "${args.join(' ')}"`
        : '';

export const templateEnvLine = (env: string[]): string[] => {
    const arr: string[] = [];
    if (env !== undefined && env.length > 0)
        arr.push('    environment:', ...env.map(e => `      - ${e}`));
    return arr;
};

export const templateServiceVolume = (volume: ServiceMount): string =>
    `      - ${volume.Source}:${volume.Target}`;

export const templateServiceNetworkPure = (net: ServiceNetwork): string[] => [
    `      - ${(net.Link as Network).Name}`
];

export const templateServiceNetworkAliases = (
    net: ServiceNetwork
): string[] => {
    const arr: string[] = [];
    arr.push(
        `      ${(net.Link as Network).Name}:`,
        '        aliases:',
        ...uniqueStringArray(net.Aliases).map(
            aliases => `          - ${aliases}`
        )
    );
    return arr;
};

export const templateServiceNetwork = (net: ServiceNetwork): string[] =>
    net.Aliases.length > 0
        ? templateServiceNetworkAliases(net)
        : templateServiceNetworkPure(net);

export const templateServiceConfig = (config: ServiceConfig): string[] => {
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

export const templateVolumesDef = (volume: ServiceMount): string[] => {
    const arr: string[] = [
        `  ${volume.Source}:`,
        `    name: ${volume.Source}`,
        ...(volume.VolumeOptions !== undefined
            ? [`    driver: ${volume.VolumeOptions.DriverConfig.Name}`]
            : [])
    ];
    return arr;
};

export const templateNetworksDef = (net: ServiceNetwork): string[] => {
    const labels = (net.Link as Network).Labels;
    const arr: string[] = [
        `  ${(net.Link as Network).Name}:`,
        ...(labels && labels['com.docker.stack.namespace'] !== undefined
            ? []
            : ['    external: true'])
    ];
    return arr;
};

export const templateServiceLabels = (k: string, v: string): string =>
    `      - ${k}=${v}`;

export const templateServiceDeployLabels = (k: string, v: string): string =>
    `        - ${k}=${v}`;
