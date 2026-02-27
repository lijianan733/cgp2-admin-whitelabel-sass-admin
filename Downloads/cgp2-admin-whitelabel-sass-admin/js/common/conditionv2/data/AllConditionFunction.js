
//生成的函数
function expression(args) {
    if (
        //属性值相等
        (args["context"]["attributeValue"]["123456"] == args["context"]["attributeValue"]["654321"])
        //属性值在区间内
        && (args["context"]["attributeValue"]["123456"] > 0 && args["context"]["attributeValue"]["123456"] <= 100)
        //属性值包含于数组内
        && ([1, 10, 20, 30, 40, 50, 60, 70, 80, 90].indexOf(args["context"]["attributeValue"]["123456"]) > -1)
    ) {
        return true;
    }

    return false;
}

//model对象
var data = {
    clazz: "AllConditionFunction",
    name: "my function",
    type: "ValueEx",
    paragraph: {
        //and连接
        "condition": {
            clazz: "LogicalOperation",
            andOperator: true,
            expressions: [
                //属性值相等
                {
                    clazz: "CompareOperation",
                    operator: "==",
                    source: {
                        //PropertyPathValue里的属性对象，参照原有的实现
                        clazz: "PropertyPathValue",
                        skuAttributeId: {
                            id: "123456"
                        },
                        attributeProfile: {},
                        propertyName: {}
                    },
                    value: {
                        clazz: "PropertyPathValue",
                        skuAttributeId: {
                            id: "654321"
                        },
                        attributeProfile: {},
                        propertyName: {}
                    }
                },
                //属性值在区间内
                {
                    clazz: "IntervalOperation",
                    source: {
                        //PropertyPathValue里的属性对象，参照原有的实现
                        clazz: "PropertyPathValue",
                        skuAttributeId: {
                            id: "123456"
                        },
                        attributeProfile: {},
                        propertyName: {}
                    },
                    min: {
                        clazz: "ConstantValue",
                        value: "0",
                        nullable: false,
                        valueType: "number"
                    },
                    max: {
                        clazz: "ConstantValue",
                        value: "100",
                        nullable: false,
                        valueType: "number"
                    }
                },
                //属性值包含于数组内
                {
                    clazz: "RangeOperationModel",
                    source: {
                        //PropertyPathValue里的属性对象，参照原有的实现
                        clazz: "PropertyPathValue",
                        skuAttributeId: {
                            id: "123456"
                        },
                        attributeProfile: {},
                        propertyName: {}
                    },
                    inOperator: true,
                    value: "[1, 10, 20, 30, 40, 50, 60, 70, 80, 90]"
                }
            ]
        }
    }
}

//模板, 模板内置到AllConditionFunction的类实现中即可
var template = "function expression(args) { \
    if ( ${condition} ) { \
        return true; \
    } \
\
    return false;\
}";