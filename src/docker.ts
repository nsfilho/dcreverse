import axios from 'axios';

export interface ServiceConfig {
    File: {
        Name: string;
        UID: string;
        GID: string;
        Mode: number;
    };
    ConfigID: string;
    ConfigName: string;
}
export interface ServiceNetwork {
    Target: string;
    Aliases: string[];
    Link?: Network;
}

export interface ServiceMount {
    Type: string;
    Source: string;
    Target: string;
    VolumeOptions: {
        Labels: {
            [index: string]: string;
        };
        DriverConfig: {
            Name: string;
        };
    };
}

export interface ServiceSpec {
    Name: string;
    Labels: {
        [index: string]: string;
    };
    TaskTemplate: {
        ContainerSpec: {
            Image: string;
            Labels: {
                [index: string]: string;
            };
            Args: string[];
            Env: string[];
            Privileges: {
                CredentialSpec: null | object;
                SELinuxContext: null | object;
            };
            Mounts: ServiceMount[];
            Configs: ServiceConfig[];
            Isolation: string;
        };
        Resources: {}; // Pegar container com este conteúdo para aferir
        Placement: {
            Platforms: {
                Architecture: string;
                OS: string;
            }[];
        };
        Networks: ServiceNetwork[];
        ForceUpdate: 0;
        Runtime: string;
    };
    Mode: {
        Replicated: {
            Replicas: number;
        };
    };
    EndpointSpec: {
        Mode: string;
    };
}

export interface Service {
    ID: string;
    Version: {
        Index: number;
    };
    CreatedAt: string;
    UpdatedAt: string;
    Spec: ServiceSpec;
    PreviousSpec: ServiceSpec;
    Endpoint: {
        Spec: {
            Mode: string;
        };
        VirtualIPs: {
            NetworkID: string;
            Addr: string;
        }[];
    };
}

export interface Network {
    Name: string;
    Id: string;
    Created: string;
    Scope: string;
    Driver: string;
    EnableIPv6: false;
    IPAM: {
        Driver: string;
        Options: null | undefined;
        Config: {
            Subnet: string;
            Gateway: string;
        }[];
    };
    Internal: boolean;
    Attachable: boolean;
    Ingress: boolean;
    ConfigFrom: {
        Network: string;
    };
    ConfigOnly: false;
    Containers: null;
    Options: {
        [index: string]: string;
    };
    Labels: {
        [index: string]: string;
    };
}

export const getAllServices = async (dockerUrl: string): Promise<Service[]> => {
    const result = await axios.get<Service[]>(`${dockerUrl}/services`);
    return result.data;
};

export const getAllNetworks = async (dockerUrl: string): Promise<Network[]> => {
    const result = await axios.get<Network[]>(`${dockerUrl}/networks`);
    return result.data;
};
