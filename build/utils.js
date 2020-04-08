"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Deduplicate Array
 *
 * @returns {string[]} Return a new array without duplicated items.
 */
exports.uniqueStringArray = (arr) => {
    const result = [];
    arr.forEach(item => {
        if (!result.includes(item))
            result.push(item);
    });
    return result;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztHQUlHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBRyxDQUFDLEdBQWEsRUFBWSxFQUFFO0lBQ3pELE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUM1QixHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQyJ9