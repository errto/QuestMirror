"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringUtil = /** @class */ (function () {
    function StringUtil() {
    }
    // 文字列を1行づつの配列で返す
    StringUtil.getLines = function (text) {
        return text.split(/\r\n|\r|\n/);
    };
    return StringUtil;
}());
exports.default = StringUtil;
