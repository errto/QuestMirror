"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ダウンロードするパッケージ
var Package = /** @class */ (function () {
    // コンストラクタ
    function Package(name, link) {
        this.name = name;
        this.link = link;
    }
    // 名前を取得する
    Package.prototype.getName = function () {
        return this.name;
    };
    // 文字列で返す
    Package.prototype.toString = function () {
        return this.name + "(" + this.link + ")";
    };
    return Package;
}());
exports.default = Package;
