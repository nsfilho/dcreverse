"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
exports.getAllServices = async (dockerUrl) => {
    const result = await axios_1.default.get(`${dockerUrl}/services`);
    return result.data;
};
exports.getAllNetworks = async (dockerUrl) => {
    const result = await axios_1.default.get(`${dockerUrl}/networks`);
    return result.data;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RvY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQThIYixRQUFBLGNBQWMsR0FBRyxLQUFLLEVBQUUsU0FBaUIsRUFBc0IsRUFBRTtJQUMxRSxNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQUssQ0FBQyxHQUFHLENBQVksR0FBRyxTQUFTLFdBQVcsQ0FBQyxDQUFDO0lBQ25FLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQztBQUN2QixDQUFDLENBQUM7QUFFVyxRQUFBLGNBQWMsR0FBRyxLQUFLLEVBQUUsU0FBaUIsRUFBc0IsRUFBRTtJQUMxRSxNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQUssQ0FBQyxHQUFHLENBQVksR0FBRyxTQUFTLFdBQVcsQ0FBQyxDQUFDO0lBQ25FLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQztBQUN2QixDQUFDLENBQUMifQ==