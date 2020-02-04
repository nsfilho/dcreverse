import axios from 'axios';
import util from 'util';

export interface Service {
    ID: string;
    Version: {
        Index: number;
    };
    CreatedAt: string;
    UpdatedAt: string;
    Spec: {
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
                Mounts: {
                    Type: string;
                    Source: string;
                    Target: string;
                    VolumeOptions: {
                        Labels: {};
                        DriverConfig: {};
                    };
                }[];
                Configs: {
                    File: {};
                    ConfigID: string;
                    ConfigName: string;
                }[];
                Isolation: string;
            };
            Resources: {};
            Placement: {
                Platforms: [];
            };
            Networks: { Target: string; Aliases: [] }[];
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
    };
    PreviousSpec: {
        Labels: {
            [index: string]: string;
        };
        TaskTemplate: {};
        Mode: {};
        EndpointSpec: {};
    };
    Endpoint: {};
}

export const getAllServices = async (dockerUrl: string) => {
    const result = await axios.get(`${dockerUrl}/services`);
    console.log(
        util.formatWithOptions(
            {
                colors: true,
                depth: 15,
                showHidden: true,
                showProxy: true,
                getters: true
            },
            '%o',
            result.data[0].Spec
        )
    );
    return result;
};
