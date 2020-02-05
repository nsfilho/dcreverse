import program from 'commander';
import { dumping } from './dumping';

program
    .helpOption('-h, --help', 'show program options')
    .option('-s, --socket-path <path>', 'specify a unix path')
    .option('-d, --docker-url <url>', 'specify a docker url')
    .option('-n, --namespace <namespace>', 'dumping a exclusive namespace')
    .option('-o, --output-dir <directory>', 'dumping all namespaces in a directory')
    .option('-v, --verbose', 'show more details from collected data from docker');

program
    .command('dump', {
        isDefault: true
    })
    .action(async (...args) => {
        const dockerUrl = program.dockerUrl || 'http://localhost:8999';
        const outputDir = program.outputDir || 'dumping';
        const namespace = program.namespace;
        const verbose = program.verbose;
        await dumping(dockerUrl, outputDir, namespace, verbose);
    });

program.parse(process.argv);
