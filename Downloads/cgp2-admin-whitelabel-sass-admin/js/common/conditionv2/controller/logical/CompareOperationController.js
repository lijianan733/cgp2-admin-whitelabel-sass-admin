/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.controller.logical.CompareOperationController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    /**
     * 数组的比较equal(args.context['1976299'],['1976945','1976300'])==true
     * @param data
     * @returns {string}
     */
    generate: function (data) {
        var controller = this;
        var mainController = controller.mainController;
        var data = controller.model.raw;
        var leftValue = mainController.builderController(data.source).generate();
        var rightValue = mainController.builderController(data.value).generate();

        leftValue = controller.mainController.translateArgsToAttrs(leftValue, data.source, data.value);
        rightValue = controller.mainController.translateArgsToAttrs(rightValue, data.value, data.source);

        if (data.value.valueType == 'Array') {
            //equal(args.context['1976299'],['1976945','1976300'])==true
            var result = 'equal(' + leftValue + ',' + rightValue + ')==true';
            return result;
        } else {
            //加入空格使&&和isContainer不连在一起
            var result = '(' + leftValue + ' ' + data.operator + ' ' + rightValue + ')';
            return result;
        }
    }
})


