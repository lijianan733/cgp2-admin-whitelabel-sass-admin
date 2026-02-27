/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.controller.template.CustomizeFunctionController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    generate: function () {
        var controller = this;
        var mainController = controller.mainController;
        var data = controller.model.raw;
        var result = '';
        result = data.expression;
        return result;
    }
})