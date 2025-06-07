import * as c from '8colors';


export type ColorFunction = (char: string) => string;

export function applyGradient(str: string, colorFns: ColorFunction[]): string {
    const len = str.length;
    const n = colorFns.length;
    let result = '';

    for (let i = 0; i < len; i++) {
        const index = Math.floor(i * n / len);
        const colorFn = colorFns[index];

        if (colorFn) {
            result += colorFn((str[i] ?? ''));
        } else {
            result += str[i];
        }
    }

    return result;
}



export const horizontalGradient = (str: string) => str
    .split('\n')
    .map(line => applyGradient(line, [
        c.red,
        c.yellow,
        c.green,
        c.cyan,
        c.blue,
        c.magenta
    ]))
    .join('\n');

export const gradient = (str: string) => applyGradient(str, [
    c.red,
    c.yellow,
    c.green,
    c.cyan,
    c.blue,
    c.magenta,
])