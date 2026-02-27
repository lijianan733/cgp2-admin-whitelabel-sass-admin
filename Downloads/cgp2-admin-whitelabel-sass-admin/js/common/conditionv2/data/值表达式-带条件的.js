
//生成的函数
function expression(args) {
    //条件1
    if (
        (args["context"]["attributeValue"]["1"] == args["context"]["attributeValue"]["2"])
        && (args["context"]["attributeValue"]["1"] > args["context"]["attributeValue"]["3"])
    ) {
        return (args["context"]["attributeValue"]["1"] * args["context"]["attributeValue"]["2"] + args["context"]["attributeValue"]["3"]);
    }
    //条件2
    else if (
        (args["context"]["attributeValue"]["1"] > 100)
        || (args["context"]["attributeValue"]["2"] > 100)
        || (args["context"]["attributeValue"]["3"] > 100)
    ) {
        return (args["context"]["attributeValue"]["1"] * args["context"]["attributeValue"]["2"] * args["context"]["attributeValue"]["2"]);
    }
    //else
    else {
        return (args["context"]["attributeValue"]["1"] + args["context"]["attributeValue"]["2"] + args["context"]["attributeValue"]["3"]);
    }
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
            clazz: "IfElseStructure",
            conditions: [
                //条件1
                {
                    clazz: "IfCondition",
                    condition: {
                        clazz: "LogicalOperation",
                        andOperator: true,
                        expressions: [
                            {
                                clazz: "CompareOperation",
                                operator: "==",
                                source: {
                                    clazz: "PropertyPathValue",
                                    skuAttributeId: {
                                        id: "1"
                                    },
                                    attributeProfile: {},
                                    propertyName: {}
                                },
                                value: {
                                    clazz: "PropertyPathValue",
                                    skuAttributeId: {
                                        id: "2"
                                    },
                                    attributeProfile: {},
                                    propertyName: {}
                                }
                            },
                            {
                                clazz: "CompareOperation",
                                operator: ">",
                                source: {
                                    clazz: "PropertyPathValue",
                                    skuAttributeId: {
                                        id: "1"
                                    },
                                    attributeProfile: {},
                                    propertyName: {}
                                },
                                value: {
                                    clazz: "PropertyPathValue",
                                    skuAttributeId: {
                                        id: "3"
                                    },
                                    attributeProfile: {},
                                    propertyName: {}
                                }
                            }
                        ]
                    },
                    statement: {
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
                            expression: "${L}*${W}+${H}"
                        }
                    }
                },

                //条件2
                {
                    clazz: "IfCondition",
                    condition: {
                        clazz: "LogicalOperation",
                        andOperator: false,
                        expressions: [
                            {
                                clazz: "CompareOperation",
                                operator: ">",
                                source: {
                                    clazz: "PropertyPathValue",
                                    skuAttributeId: {
                                        id: "1"
                                    },
                                    attributeProfile: {},
                                    propertyName: {}
                                },
                                value: {
                                    clazz: "ConstantValue",
                                    value: "100",
                                    valueType: "number",
                                    nullable: false
                                }
                            },
                            {
                                clazz: "CompareOperation",
                                operator: ">",
                                source: {
                                    clazz: "PropertyPathValue",
                                    skuAttributeId: {
                                        id: "2"
                                    },
                                    attributeProfile: {},
                                    propertyName: {}
                                },
                                value: {
                                    clazz: "ConstantValue",
                                    value: "100",
                                    valueType: "number",
                                    nullable: false
                                }
                            },
                            {
                                clazz: "CompareOperation",
                                operator: ">",
                                source: {
                                    clazz: "PropertyPathValue",
                                    skuAttributeId: {
                                        id: "3"
                                    },
                                    attributeProfile: {},
                                    propertyName: {}
                                },
                                value: {
                                    clazz: "ConstantValue",
                                    value: "100",
                                    valueType: "number",
                                    nullable: false
                                }
                            }
                        ]
                    },
                    statement: {
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
                            expression: "${L}*${W}*${H}"
                        }
                    }
                },
            ],
            elseStatement: {
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
}

//模板
var template = "function expression(args) { \
     ${P1} \
}";