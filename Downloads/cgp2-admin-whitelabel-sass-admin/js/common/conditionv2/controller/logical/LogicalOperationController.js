/**
 * @Description: 一般作为左值，指明一个属性
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.controller.logical.LogicalOperationController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    generate: function (data) {
        var controller = this;
        var mainController = controller.mainController;
        var data = controller.model.raw;
        var expressionDto = data.expressions;
        var expressions = [];
        for (var i = 0; i < expressionDto.length; i++) {
            var item = expressionDto[i];
            expressions.push(mainController.builderController(item).generate());
        }
        var result = '';
        if (expressions.length > 1) {
            switch (data.operator) {
                case 'AND':
                    result = expressions.join('&&');
                    break;
                case 'OR':
                    result = expressions.join('||');
                    break;
            }
            result = '(' + result + ')';
        } else if (expressions.length == 1) {
            //不作处理
            result = expressions[0];
        } else {
            result = '(true)';
        }
        return result;
    }
})