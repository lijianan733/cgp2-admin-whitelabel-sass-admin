/**
 * @Description:
 * @author nan
 * @date 2022/10/12
 */
Ext.define("CGP.common.conditionv2.controller.SubController", {
    modelName: null,
    model: null,
    mainController: null,
    contextStore: null,
    constructor: function (config) {
        var me = this;
        Ext.Object.merge(me, config);
        me.model = Ext.create(me.modelName, me.data);
    },
    transformIExpression: function (IExpression) {
        var controller = this;
        var result = '未处理';
        if (IExpression.clazz == 'IfElseStructure') {
            //todo
        } else if (IExpression.clazz == 'ReturnStructure') {
            result = 'return (' + controller.transformValue(IExpression.value) + ')';
        } else if (IExpression.clazz == 'IfCondition') {

        } else if (IExpression.clazz == 'LogicalOperation') {

        } else if (IExpression.clazz == 'IntervalOperation') {

        } else if (IExpression.clazz == 'CompareOperation') {

        } else if (IExpression.clazz == 'RangeOperation') {

        } else if (IExpression.clazz == 'ContextPathValue' ||
            IExpression.clazz == 'ProductAttributeValue' ||
            IExpression.clazz == 'PropertyPathValue' ||
            IExpression.clazz == 'ConstantValue' ||
            IExpression.clazz == 'CalculationValue') {
            result = controller.transformValue(IExpression);
        }
        return result;
    },
    /**
     * 默认的空方法，只记录那些配置没处理
     * @returns {string}
     */
    generate: function () {
        var controller = this;
        var mainController = controller.mainController;
        var data = controller.model.raw;
        var result = controller.$className + '未处理';
        return result;
    },

})
