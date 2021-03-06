import program from 'commander';
import { dumping } from './dumping';

program
    .helpOption('-h, --help', 'show program options')
    .option('-s, --socket-path <path>', 'specify a unix path')
    .option('-d, --docker-url <url>', 'specify a docker url')
    .option('-n, --namespace <namespace>', 'dumping a exclusive namespace')
    .option(
        '-v, --verbose',
        'show more details from collected data from docker'
    );

program
    .command('dump', {
        isDefault: true
    })
    .action(async () => {
        const dockerUrl = program.dockerUrl || 'http://localhost:8999';
        const { namespace, verbose } = program;
        await dumping(dockerUrl, namespace, verbose);
    });

program.parse(process.argv);
