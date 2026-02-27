/**
 * @Description:if 这种条件语句块
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.controller.other.IfConditionController', {
    extend: 'CGP.common.conditionv2.controller.SubController',
    /**
     * 处理if(xxx){return 'xxxx'}结构
     *
     *    结构如下:    {
     *                     clazz: "IfCondition",
     *                     condition: {
     *                         clazz: "LogicalOperation",
     *                         andOperator: false,
     *                         expressions: [ ]
     *                     },
     *                     statement: {
     *                         clazz: "ReturnStructure",
     *                         value: { }
     *                     }
     *                 }
     */
    generate: function () {
        var controller = this;
        var mainController = controller.mainController;
        var data = controller.model.raw;
        var ifStr = '';
        //没条件执行
        var diyFun = '';
        var returnStr = mainController.builderController(data.statement).generate();
        var result = '';
        if (data.condition) {
            //特殊处理自定义条件
            var condition = data.condition;
            if (condition.clazz == 'CustomizeFunction') {
                diyFun = mainController.builderController(condition).generate();
                var funId = 'fun' + (Math.floor(Math.random() * 10000));
                diyFun = diyFun.replace('expression', funId);
                diyFun = '(' + diyFun + ')(args)';
                result = ` if(${diyFun}){${returnStr}}`;
            } else {
                //普通逻辑条件
                ifStr += mainController.builderController(condition).generate();
                result = `if(${ifStr}){${returnStr}}`;
            }
        } else {
            //无执行条件
            result = `if(true){${returnStr}}`;
        }
        return result;
    }
})
