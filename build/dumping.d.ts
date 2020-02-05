import { Service, ServiceMount, ServiceNetwork } from './docker';
export interface Stack {
    namespace: string;
    services: Service[];
}
export declare const generateDirs: (stacks: Stack[], outputDir: string) => boolean;
export declare const generateVolumes: (volumes: ServiceMount[]) => string[];
export declare const generateNetworks: (networks: ServiceNetwork[]) => string[];
export declare const generateComposes: (stacks: Stack[], outputDir: string, verbose?: boolean) => void;
export declare const dumping: (dockerUrl: string, outputDir: string, namespaceFilter?: string | undefined, verbose?: boolean) => Promise<void>;
//# sourceMappingURL=dumping.d.ts.map