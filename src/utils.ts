export const uniqueStringArray = (arr: string[]): string[] => {
    let result: string[] = [];
    arr.forEach(item => {
        if (!result.includes(item)) result.push(item);
    });
    return result;
};
