/**
 * @Description: if elseif else的结构体
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.controller.other.IfElseStructureController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    /**
     * 处理如下格式数据:{
     *                     clazz: "IfElseStructure",
     *                     conditions: [{
     *                         clazz: "IfCondition",
     *                         condition: {
     *                             clazz: "LogicalOperation",
     *                             andOperator: true,
     *                             expressions: [
     *                                 {
     *                                     clazz: "CompareOperation",
     *                                 },
     *                             ]
     *                         },
     *                         statement: {
     *                             clazz: "ReturnStructure",
     *                             value: {
     *                                 clazz: "ConstantValue",
     *                                 value: 'xxxxxxxxxx',
     *                             }
     *                         }
     *                     }],
     *                     elseStatement: {
     *                         clazz: "ReturnStructure",
     *                         value: {
     *                             clazz: "ConstantValue",
     *                             value: 'xxxxxxxxxx',
     *                         }
     *                     }
     *                 }
     * @returns {string}
     */
    generate: function () {
        var controller = this;
        var mainController = controller.mainController;
        var data = controller.model.raw;
        var ifStr = '';
        var elseStr = '';
        var ifArr = [];
        for (var i = 0; i < data.conditions.length; i++) {
            var item = data.conditions[i];
            ifArr.push(mainController.builderController(item).generate());
        }
        var result = '';
        //有conditions，有elseStatement
        if (ifArr.length > 0 && data.elseStatement) {
            ifStr = ifArr.join('else ');
            elseStr = mainController.builderController(data.elseStatement).generate();
            result = (ifStr + 'else{' + elseStr + '}');
        }
        //有conditions，无elseStatement
        else if (ifArr.length > 0 && Ext.isEmpty(data.elseStatement)) {
            ifStr = ifArr.join('else ');
            result = ifStr;
        }
        //无conditions，有elseStatement
        else if (ifArr.length == 0 && data.elseStatement) {
            elseStr = mainController.builderController(data.elseStatement).generate();
            result = elseStr;
        }
        //无conditions，无elseStatement
        else if (ifArr.length == 0 && Ext.isEmpty(data.elseStatement)) {
            result = '';
        }
        console.log(result)
        return result;
    }
})