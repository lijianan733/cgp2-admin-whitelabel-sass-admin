/**
 * @Description: [] () [) (]类型的数据
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.controller.logical.IntervalOperationController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    generate: function (data) {
        var controller = this;
        var mainController = controller.mainController;
        var data = controller.model.raw;
        var operator = {};
        var leftValue = mainController.builderController(data.source).generate();
        var minValue = mainController.builderController(data.min).generate();
        var maxValue = mainController.builderController(data.max).generate();
        leftValue = mainController.translateArgsToAttrs(leftValue, data.source);
        minValue = mainController.translateArgsToAttrs(minValue, data.min, data.source);
        maxValue = mainController.translateArgsToAttrs(maxValue, data.max, data.source);
        switch (data.operator) {
            case '(min,max]':
                operator.leftOperator = '<';
                operator.rightOperator = '<=';
                break;
            case '[min,max]':
                operator.leftOperator = '<=';
                operator.rightOperator = '<=';
                break;
            case '[min,max)':
                operator.leftOperator = '<=';
                operator.rightOperator = '<';
                break;
            case '(min,max)':
                operator.leftOperator = '<';
                operator.rightOperator = '<';
                break;
        }
        var result = '((' + minValue + operator.leftOperator + leftValue + ')&&(' + leftValue + operator.rightOperator + maxValue + '))';
        return result;
    }
})