"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const dumping_1 = require("./dumping");
commander_1.default
    .helpOption('-h, --help', 'show program options')
    .option('-s, --socket-path <path>', 'specify a unix path')
    .option('-d, --docker-url <url>', 'specify a docker url')
    .option('-n, --namespace <namespace>', 'dumping a exclusive namespace')
    .option('-o, --output-dir <directory>', 'dumping all namespaces in a directory')
    .option('-v, --verbose', 'show more details from collected data from docker');
commander_1.default
    .command('dump', {
    isDefault: true
})
    .action(async () => {
    const dockerUrl = commander_1.default.dockerUrl || 'http://localhost:8999';
    const outputDir = commander_1.default.outputDir || 'dumping';
    const { namespace, verbose } = commander_1.default;
    await dumping_1.dumping(dockerUrl, outputDir, namespace, verbose);
});
commander_1.default.parse(process.argv);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwREFBZ0M7QUFDaEMsdUNBQW9DO0FBRXBDLG1CQUFPO0tBQ0YsVUFBVSxDQUFDLFlBQVksRUFBRSxzQkFBc0IsQ0FBQztLQUNoRCxNQUFNLENBQUMsMEJBQTBCLEVBQUUscUJBQXFCLENBQUM7S0FDekQsTUFBTSxDQUFDLHdCQUF3QixFQUFFLHNCQUFzQixDQUFDO0tBQ3hELE1BQU0sQ0FBQyw2QkFBNkIsRUFBRSwrQkFBK0IsQ0FBQztLQUN0RSxNQUFNLENBQ0gsOEJBQThCLEVBQzlCLHVDQUF1QyxDQUMxQztLQUNBLE1BQU0sQ0FDSCxlQUFlLEVBQ2YsbURBQW1ELENBQ3RELENBQUM7QUFFTixtQkFBTztLQUNGLE9BQU8sQ0FBQyxNQUFNLEVBQUU7SUFDYixTQUFTLEVBQUUsSUFBSTtDQUNsQixDQUFDO0tBQ0QsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ2YsTUFBTSxTQUFTLEdBQUcsbUJBQU8sQ0FBQyxTQUFTLElBQUksdUJBQXVCLENBQUM7SUFDL0QsTUFBTSxTQUFTLEdBQUcsbUJBQU8sQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDO0lBQ2pELE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEdBQUcsbUJBQU8sQ0FBQztJQUN2QyxNQUFNLGlCQUFPLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDNUQsQ0FBQyxDQUFDLENBQUM7QUFFUCxtQkFBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMifQ==