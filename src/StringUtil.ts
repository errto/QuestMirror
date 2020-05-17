export default class StringUtil {

    // 文字列を1行づつの配列で返す
    public static getLines(text: string): string[] {
        return text.split(/\r\n|\r|\n/);
    }
}