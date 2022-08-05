export const compareAsNumbers = (a: any, b: any): number => {
    return parseInt(a) - parseInt(b);
};

export const deserializeRegexPretty = (regex: RegExp): string => {
    // parse regex strings to regular expressions
    const str = regex.toString();
    return str.slice(1, str.length - 1);
};