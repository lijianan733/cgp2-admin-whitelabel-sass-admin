/**
 * @Description: in NotIn
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.controller.logical.RangeOperationController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    //todo
    /**
     *
     * isContained(['133724','133725'],[args.context['133723']])==true
     * @param data
     * @returns {*}
     */
    generate: function (data) {
        var controller = this;
        var mainController = controller.mainController;
        var data = controller.model.raw;
        var operator = data.operator;
        var leftValue = mainController.builderController(data.source).generate();
        var rightValue = mainController.builderController(data.value).generate();
        leftValue = mainController.translateArgsToAttrs(leftValue, data.source, data.value);
        rightValue = mainController.translateArgsToAttrs(rightValue, data.value, data.source);
        switch (data.operator) {
            case 'In':
                break;
            case 'NotIn':
                break;
        }
        var InOrNotInTemplate = new Ext.XTemplate('isContained({secondValue},{firstValue})=={[this.getOperatorBooleanValue(values)]}', {
            getOperatorBooleanValue: function (values) {
                //values为上下文
                return values.operator == 'In'
            }
        });
        var result = InOrNotInTemplate.apply({
            firstValue: leftValue,
            secondValue: rightValue,
            operator: operator
        });
        return result;
    }

})
