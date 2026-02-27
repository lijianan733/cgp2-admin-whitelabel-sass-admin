
//生成的函数
function expression(args) {
    return (args["context"]["attributeValue"]["1"] + args["context"]["attributeValue"]["2"] + args["context"]["attributeValue"]["3"]);
}

//model对象
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
var template = "function expression(args) { \
     ${P1} \
}";