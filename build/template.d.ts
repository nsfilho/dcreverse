import { Stack } from './dumping';
import { Service, ServiceMount, ServiceNetwork, ServiceConfig } from './docker';
export declare const templateStart: (stack: Stack) => string;
export declare const templateServiceLine: (service: Service) => string;
export declare const templateImageLine: (service: Service) => string;
export declare const templateArgsLine: (args: string[]) => string;
export declare const templateEnvLine: (env: string[]) => string[];
export declare const templateServiceVolume: (volume: ServiceMount) => string;
export declare const templateServiceNetworkPure: (net: ServiceNetwork) => string[];
export declare const templateServiceNetworkAliases: (net: ServiceNetwork) => string[];
export declare const templateServiceNetwork: (net: ServiceNetwork) => string[];
export declare const templateServiceConfig: (config: ServiceConfig) => string[];
export declare const templateVolumesDef: (volume: ServiceMount) => string[];
export declare const templateNetworksDef: (net: ServiceNetwork) => string[];
export declare const templateServiceLabels: (k: string, v: string) => string;
export declare const templateServiceDeployLabels: (k: string, v: string) => string;
//# sourceMappingURL=template.d.ts.map