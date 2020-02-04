import { getAllServices } from './docker';

export const dumping = async (dockerUrl: string, outputDir: string, namespace?: string) => {
    const allServices = await getAllServices(dockerUrl);
};
