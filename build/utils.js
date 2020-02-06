"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueStringArray = (arr) => {
    const result = [];
    arr.forEach(item => {
        if (!result.includes(item))
            result.push(item);
    });
    return result;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBYSxRQUFBLGlCQUFpQixHQUFHLENBQUMsR0FBYSxFQUFZLEVBQUU7SUFDekQsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzVCLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQyxDQUFDIn0=