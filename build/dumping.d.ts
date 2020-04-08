import { Service, ServiceMount, ServiceNetwork, ServiceConfig } from './docker';
export interface Stack {
    namespace: string;
    services: Service[];
}
export declare const generateVolumes: (volumes: ServiceMount[]) => string[];
export declare const generateNetworks: (networks: ServiceNetwork[]) => string[];
export declare const generateConfigs: (configs: ServiceConfig[]) => string[];
export declare const generateComposes: (stacks: Stack[], verbose?: boolean) => void;
export declare const dumping: (dockerUrl: string, namespaceFilter: string, verbose?: boolean) => Promise<void>;
//# sourceMappingURL=dumping.d.ts.map