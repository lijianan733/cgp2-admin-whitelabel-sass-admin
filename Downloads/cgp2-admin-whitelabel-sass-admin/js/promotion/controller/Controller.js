/**
 * @Description:
 * @author nan
 * @date 2023/7/6
 */
Ext.define('CGP.promotion.controller.Controller', {


    /**
     *
     * @param count 需要生成的数量
     * @param codeLength 需要生成的code长度
     * @returns {*[]}
     */
    generate: function (count, codeLength = 8) {
        var generated = [];
        var generateCodes = function (number, length) {
            for (var i = 0; i < number; i++) {
                generateCode(length);
            }
            return generated;
        };
        var generateCode = function generateCode(length) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";//可选字符
            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            if (generated.indexOf(text) == -1) {
                generated.push(text);
            } else {
                generateCode();
            }
        };
        return generateCodes(count, codeLength);
    }
})