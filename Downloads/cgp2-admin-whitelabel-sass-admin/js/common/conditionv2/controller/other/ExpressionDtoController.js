/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */

Ext.define('CGP.common.conditionv2.controller.other.ExpressionDtoController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    generate: function () {
        var controller = this;
        var data = controller.model.raw;
        var mainController = controller.mainController;
        var expression = mainController.builderController(data.function).generate();
        return {
            clazz: 'com.qpp.cgp.expression.Expression',
            expression: expression,
            expressionEngine: 'JavaScript',
            resultType: data.resultType
        }
    }
})