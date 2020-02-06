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
    .action(async (...args) => {
    const dockerUrl = commander_1.default.dockerUrl || 'http://localhost:8999';
    const outputDir = commander_1.default.outputDir || 'dumping';
    const namespace = commander_1.default.namespace;
    const verbose = commander_1.default.verbose;
    await dumping_1.dumping(dockerUrl, outputDir, namespace, verbose);
});
commander_1.default.parse(process.argv);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwREFBZ0M7QUFDaEMsdUNBQW9DO0FBRXBDLG1CQUFPO0tBQ0YsVUFBVSxDQUFDLFlBQVksRUFBRSxzQkFBc0IsQ0FBQztLQUNoRCxNQUFNLENBQUMsMEJBQTBCLEVBQUUscUJBQXFCLENBQUM7S0FDekQsTUFBTSxDQUFDLHdCQUF3QixFQUFFLHNCQUFzQixDQUFDO0tBQ3hELE1BQU0sQ0FBQyw2QkFBNkIsRUFBRSwrQkFBK0IsQ0FBQztLQUN0RSxNQUFNLENBQUMsOEJBQThCLEVBQUUsdUNBQXVDLENBQUM7S0FDL0UsTUFBTSxDQUFDLGVBQWUsRUFBRSxtREFBbUQsQ0FBQyxDQUFDO0FBRWxGLG1CQUFPO0tBQ0YsT0FBTyxDQUFDLE1BQU0sRUFBRTtJQUNiLFNBQVMsRUFBRSxJQUFJO0NBQ2xCLENBQUM7S0FDRCxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxFQUFFLEVBQUU7SUFDdEIsTUFBTSxTQUFTLEdBQUcsbUJBQU8sQ0FBQyxTQUFTLElBQUksdUJBQXVCLENBQUM7SUFDL0QsTUFBTSxTQUFTLEdBQUcsbUJBQU8sQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDO0lBQ2pELE1BQU0sU0FBUyxHQUFHLG1CQUFPLENBQUMsU0FBUyxDQUFDO0lBQ3BDLE1BQU0sT0FBTyxHQUFHLG1CQUFPLENBQUMsT0FBTyxDQUFDO0lBQ2hDLE1BQU0saUJBQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM1RCxDQUFDLENBQUMsQ0FBQztBQUVQLG1CQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyJ9