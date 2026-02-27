/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.controller.value.CalculationValueController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    generate: function () {
        var controller = this;
        var expression = controller.model.raw.expression;
        var parameter = controller.model.raw.parameter;
        var context = {};
        for (var i = 0; i < parameter.length; i++) {
            context[parameter[i].key] = controller.mainController.builderController(parameter[i].value).generate();
        }
        for (var i in context) {
            var regex = new RegExp('\\$\\{' + i + '\\}', 'g')
            expression = expression.replace(regex, context[i]);
        }
        return '(' + expression + ')(args)';

    }
})
