export const rgbtohex = (...[red, green, blue]: number[]) => {
    return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
}
export default rgbtohex;