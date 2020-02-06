import { Stack } from './dumping';
import { Service, ServiceMount, ServiceNetwork, ServiceConfig } from './docker';
export declare const template_start: (stack: Stack) => string;
export declare const template_service_line: (service: Service) => string;
export declare const template_image_line: (service: Service) => string;
export declare const template_args_line: (args: string[]) => string;
export declare const template_env_line: (env: string[]) => string[];
export declare const template_service_volume: (volume: ServiceMount) => string;
export declare const template_service_networkPure: (net: ServiceNetwork) => string[];
export declare const template_service_networkAliases: (net: ServiceNetwork) => string[];
export declare const template_service_network: (net: ServiceNetwork) => string[];
export declare const template_service_config: (config: ServiceConfig) => string[];
export declare const template_volumes_def: (volume: ServiceMount) => string[];
export declare const template_networks_def: (net: ServiceNetwork) => string[];
export declare const template_service_labels: (k: string, v: string) => string;
export declare const template_service_deploy_labels: (k: string, v: string) => string;
//# sourceMappingURL=template.d.ts.map