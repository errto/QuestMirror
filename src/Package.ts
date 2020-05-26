// ダウンロードするパッケージ
export default class Package {

    // パッケージ名
    private name: string;
    // リンク
    private link: string;

    // コンストラクタ
    constructor(name: string, link: string) {
        this.name = name;
        this.link = link;
    }

    // 名前を取得する
    public getName(): string {
        return this.name
    }

    // 文字列で返す
    public toString(): string {
        return this.name + "(" + this.link + ")";
    }

}