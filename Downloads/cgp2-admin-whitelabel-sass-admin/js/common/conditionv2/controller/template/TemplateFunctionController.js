/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 *
 var data = {
    clazz: "TemplateFunction",
    name: "template.js",
    type: "ValueEx",
    component: "ConditionValue",
    paragraph: {
        //条件结构
        "P1": {
            clazz: "ReturnStructure",
            value: {
                clazz: "CalculationValue",
                parameter: {
                    "L": {
                        clazz: "PropertyPathValue",
                        skuAttributeId: {
                            id: "1"
                        },
                        attributeProfile: {},
                        propertyName: {}
                    },
                    "W": {
                        clazz: "PropertyPathValue",
                        skuAttributeId: {
                            id: "2"
                        },
                        attributeProfile: {},
                        propertyName: {}
                    },
                    "H": {
                        clazz: "PropertyPathValue",
                        skuAttributeId: {
                            id: "3"
                        },
                        attributeProfile: {},
                        propertyName: {}
                    }
                },
                expression: "${L}+${W}+${H}"
            }
        }
    }
}

 //模板
 template: 'function expression(args) { ${isContained} ${P1}};',
 *
 */
Ext.define('CGP.common.conditionv2.controller.template.TemplateFunctionController', {
    extend: 'CGP.common.conditionv2.controller.SubController',

    generate: function () {
        var controller = this;
        var mainController = controller.mainController;
        var data = controller.model.raw;
        var result = '';
        var template = data.template;
        var map = {};
        for (var i in data.paragraph) {
            map[i] = mainController.builderController(data.paragraph[i]).generate();
            //可能会在多个方法里重复添加isContained代码，所以先全部去除再添加
            map[i] = map[i].replace(mainController.extraFunString, '');
        }
        var isUsingIsContained = mainController.isNeedExtraFun(map);
        if (isUsingIsContained) {
            template = template.replace('${isContained}', mainController.extraFunString);
        } else {
            template = template.replace('${isContained}', '');
        }
        //是否使用了isContained这个方法
        for (var i in map) {
            template = template.replace('${' + i + '}', map[i]);
        }
        result = template;
        return result;
    }
})

