/**
 * Deduplicate Array
 *
 * @returns {string[]} Return a new array without duplicated items.
 */
export const uniqueStringArray = (arr: string[]): string[] => {
    const result: string[] = [];
    arr.forEach(item => {
        if (!result.includes(item)) result.push(item);
    });
    return result;
};
