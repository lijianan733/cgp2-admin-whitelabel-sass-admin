/**
 * Created by nan on 2020/11/30
 * 在后台服务运行时，上下文的输入skuAttribute值为空时，仅能是[]，和null
 * 得有两套程序，一套处理旧数据，一套处理有ValueType后的数据
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.DealConditionV2", {
    operatorMapping: {
        'AND': '&&',
        'OR': '||'
    },
    betweenOperatorMapping: {
        '(min,max]': {
            leftOperator: '<',
            rightOperator: '<='
        },
        '(min,max)': {
            leftOperator: '<',
            rightOperator: '<'
        },
        '[min,max]': {
            leftOperator: '<=',
            rightOperator: '<='
        },
        '[min,max)': {
            leftOperator: '<=',
            rightOperator: '<'
        }
    },

    templates: {
        InOrNotInTemplate: new Ext.XTemplate('isContained([{secondValue}],{firstValue})=={[this.getOperatorBooleanValue(values)]}', {
            getOperatorBooleanValue: function (values) {
                return values.operator == 'In'
            }
        }),
        ArrayCompareTemplate: new Ext.XTemplate('equal({firstValue},[{secondValue}])=={[this.getOperatorBooleanValue(values)]}', {
            getOperatorBooleanValue: function (values) {
                return values.operator == '=='
            }
        }),
        normalTemplate: new Ext.Template('{firstValue}{operator}{secondValue}'),
        BetweenTemplate: new Ext.Template('({minValue}{leftOperator}{midValue}&&{midValue}{rightOperator}{maxValue})'),

    },
    /**
     * 获取BaseOperation
     * @param operation
     * @param skuAttributeStore
     * @returns {string|*}
     */
    calculateBaseOperation: function (operation, skuAttributeStore) {
        var controller = this;
        var resultData = '';
        if (Ext.isEmpty(operation)) {
            return resultData;
        }
        var operationClazz = operation.clazz;
        if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation') {
            resultData = controller.calculateLogicalOperation(operation, skuAttributeStore);
        } else if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation') {
            resultData = controller.calculateCustomExpressionOperation(operation);
        } else if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.BetweenOperation') {
            resultData = controller.calculateBetweenOperation(operation, skuAttributeStore);
        } else if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.CompareOperation') {
            resultData = controller.calculateCompareOperation(operation, skuAttributeStore);
        } else {
            resultData = controller.getBaseValueResult(operation);
        }
        console.log(resultData);
        return resultData;
    }
    ,
    /**
     * && 和 ||把两个表达式连接起来
     * @param operation
     * @param skuAttributeStore
     * @returns {string}
     */
    calculateLogicalOperation: function (operation, skuAttributeStore) {
        var controller = this;
        var resultData = '';
        var logicalOperator = controller.operatorMapping[operation.operator];
        var resultArr = [];
        if (operation.operations.length > 0) {
            //条件中有写配置
            Ext.each(operation.operations, function (item, index) {
                var expression = controller.calculateBaseOperation(item, skuAttributeStore);
                //特殊处理下数据，当直接连接baseValue时，为空值的处理
                if (expression == '') {
                    expression = "''"
                }
                resultArr.push(expression);
            })
            resultData = resultArr.join(logicalOperator);
            return resultData;
        } else {
            //没写配置，默认执行，返回true
            return true;
        }
    }
    ,
    /**
     * 获取到区间表达式
     * @param operation
     * @param skuAttributeStore
     * @returns {string}
     */
    calculateBetweenOperation: function (operation, skuAttributeStore) {
        var resultData = '';
        var controller = this;
        var midValue = controller.getBaseValueResult(operation.midValue);
        var minValue = controller.getBaseValueResult(operation.operations[0], 'Number');
        var maxValue = controller.getBaseValueResult(operation.operations[1], 'Number');
        resultData = controller.concatBetweenOperation(midValue, operation.operator, minValue, maxValue);
        return resultData;
    },
    /**
     * 拼接比较类型的表达式
     * @param midValue
     * @param operators
     * @param minValue
     * @param maxValue
     * @returns {String}
     */
    concatBetweenOperation: function (midValue, operator, minValue, maxValue) {
        var controller = this;
        var operators = controller.betweenOperatorMapping[operator];
        var template = controller.templates['BetweenTemplate'];
        var context = {
            midValue: midValue,
            leftOperator: operators.leftOperator,
            rightOperator: operators.rightOperator,
            minValue: minValue,
            maxValue: maxValue
        };
        var result = template.apply(context);
        return result;
    },
    /**
     * 获取到比较类型的属性表达式

     * 根据skuAttribute转换出对应的数据类型
     * @param operation
     * @param skuAttributeStore
     * @returns {string}
     */
    calculateCompareOperation: function (operation, skuAttributeStore) {
        var controller = this;
        var valueType = 'String';
        var skuAttribute = null;
        var firstValue = controller.getBaseValueResult(operation.operations[0]);//上下文中的属性
        if (operation.operations[0].clazz == 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue') {
            //旧数据的格式，通过skuAttribute来判断属性值类型
            var skuAttributeId = operation.operations[0].skuAttributeId;
            skuAttribute = skuAttributeStore.getById(Number(skuAttributeId));
            valueType = skuAttribute.raw.attribute.valueType;
            var selectType = skuAttribute.raw.attribute.selectType;
            if (['In', 'NotIn'].indexOf(operation.operator) >= 0) {
                valueType = 'Array';
                //处理单选的数据返回的类型不是个数组
                if (selectType == 'SINGLE') {
                    firstValue = "[" + firstValue + "]";
                }
            }
            if (selectType == 'MULTI') {
                valueType = 'Array'
            } else {
                if (valueType == 'Number') {
                    valueType = 'Number';
                } else {
                    //其他的boolean,date,YearMonth,string
                    valueType = 'String'
                }
            }
        }
        var secondValue = controller.getBaseValueResult(operation.operations[1], valueType);//比较的值
        return controller.concatCompareOperation(operation.operator, firstValue, secondValue);
    },
    /**
     * 根据sku属性转换保存的string类型的值
     * 本来不需要转换的，因为界面上输入sku属性的组件和在条件里获取值的组件是同一类型，但是保存为fixValue时只能为string
     * @param skuAttribute
     * @param value
     * @returns {*}
     */
    translateStringValue: function (selectType, valueType, value) {
        var result = '';
        if (selectType == 'MULTI') {
            result = value.replace(/'/g, '');
            result = result.split(',');
        } else {
            if (valueType == 'String') {
                result = "'" + value + "'";
            } else if (valueType == 'Boolean') {
                //处理旧数据中有'true','false',选项类型格式的数据
                if (value == 'true') {
                    result = true;
                } else if (value == 'false') {
                    result = false;
                } else {
                    //选项类型
                    result = "'" + value + "'";
                }
            } else if (valueType == 'Number') {
                result = Number(value);
            } else {
                result = "'" + value + "'";
            }
        }
        return result;
    },

    /**
     * 拼接比较表达式，
     * 数组是否包含某个元素用isContained()
     * 数组的是否相等用equal
     * @param operator
     * @param selectType
     * @param firstValue
     * @param secondValue
     * @returns {string}
     */
    concatCompareOperation: function (operator, firstValue, secondValue) {
        var controller = this;
        var resultData = '';
        if (operator == 'In' || operator == 'NotIn') {
            resultData = controller.templates['InOrNotInTemplate'].apply({
                firstValue: firstValue,
                secondValue: secondValue,
                operator: operator
            });
        } else {
            //数组类型的数据，只有==和!=
            if (Ext.isArray(secondValue)) {
                resultData = controller.templates['ArrayCompareTemplate'].apply({
                    firstValue: firstValue,
                    secondValue: secondValue,
                    operator: operator
                });
            } else {
                //非数组数据
                resultData = controller.templates['normalTemplate'].apply({
                    firstValue: firstValue,
                    secondValue: secondValue,
                    operator: operator
                });
            }
        }
        return resultData;
    },
    /**
     * 获取自定义表达式条件
     * @param operation
     * @returns {*}
     */
    calculateCustomExpressionOperation: function (operation) {
        var resultData = operation.expression;
        return resultData;
    }
    ,
    /**
     * 获取到各种类型的基础值的在运行环境中的格式
     * valueType指定值类型
     * @param baseValue
     * @returns {string}
     */
    getBaseValueResult: function (baseValue, valueType) {
        var controller = this;
        var resultValue = '';
        if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
            if (valueType) {
                resultValue = controller.translateStringValue(valueType, baseValue.value);
            } else {
                resultValue = controller.translateStringValue(baseValue.valueType, baseValue.value);
            }
        } else if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue') {
            var calculationExpression = baseValue.calculationExpression;
            resultValue = controller.dealCalculationExpression(calculationExpression);
        } else if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue') {
            resultValue = "args.context['" + baseValue.attributeId + "']";//将所有类型都转成string,该上下文使用的是attributeId
        }
        return resultValue;
    }
    ,
    /**
     * 转换界面输入的属性字符为正确的上下文属性
     * currentMaterial为遍历时的物料
     * generateObiQuantity 为要生成的OBI数量
     * 关系 attr_AttrId =>args.context['AttrId']
     * currentMaterial=>args.params.material
     * generateObiQuantity=>args.params.generateObiQuantity
     * @param input
     * @returns {*}
     */
    dealCalculationExpression: function (inputString) {
        var packer = new Packer;
        var output = packer.pack(inputString, 0, 0);
        output = output.replace(/Attr_[0-9]+/g, function (item) {
            item = item.replace('Attr_', "args.context['");
            item += "']";
            return item;
        });
        output = output.replace(/currentMaterial/g, 'args.params.material');
        output = output.replace(/generateObiQuantity/g, 'args.params.generateObiQuantity');
        return output;
    },
    /**
     * 根据值类型转换字符串数据，
     * 现在空值只有两种允许的类型[]，null
     * @param valueType
     * @param str
     */
    translateStringValue: function (valueType, str) {
        var resultValue = str;
        if (valueType == 'Array') {
            if (!Ext.isEmpty(str)) {
                resultValue = resultValue.split(',')
            } else {
                resultValue = [];
            }
        } else {
            if (Ext.isEmpty(str)) {
                return null;
            } else {
                if (valueType == 'Boolean') {
                    if (resultValue == 'true') {
                        resultValue = true;
                    } else {
                        resultValue = false;
                    }
                } else if (valueType == 'Number') {
                    resultValue = Number(resultValue);
                } else {
                    resultValue = "'" + resultValue + "'"
                }
            }
        }
        return resultValue;
    }
})