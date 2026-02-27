Ext.define("CGP.attrconfigtransform.Controller", {
    dealOneWayAttributeMapping: function (mappingConfigData) {
        var me = this;
        var mappingClazz = mappingConfigData.clazz;
        if (mappingClazz == 'com.qpp.cgp.domain.attributemapping.oneway.ConditionOneWayValueMapping') {
            me.conditionAttributeMapping(mappingConfigData);
        } else if (mappingClazz == 'com.qpp.cgp.domain.attributemapping.oneway.OneWaySimpleValueMapping') {
            me.oneWaySimpleValueMapping(mappingConfigData);
        } else if (mappingClazz == 'com.qpp.cgp.domain.attributemapping.oneway.OneWaySimpleCalculateValueMapping') {
            me.oneWaySimpleCalculateValueMaping(mappingConfigData)
        }
    },
    conditionAttributeMapping: function (mappingConfigData) {
        var me = this;
        var attributePropertyValues = [];
        var resultData = {
            condition: {
                "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": "Boolean",
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression(inputContext) {return true}",
                "promptTemplate": "",
                "multilingualKey": "com.qpp.cgp.expression.Expression"
            },
            clazz: "com.qpp.cgp.domain.attributeconfig.MultiAttributeOneWayPropertyValueConfig",
            propertyValues: [],
            inAttributes: []
        };
        var executeConditionExpression = me.executeCondition(mappingConfigData.executeCondition);
        var attributeVariables = me.definefixValueVariable(mappingConfigData.inSkuAttributes);
        Ext.each(mappingConfigData.mappingRules,function (mappingRule) {
            attributePropertyValues = Ext.Array.merge(attributePropertyValues,me.attributeMappingRule(mappingRule,attributeVariables));
        });

        resultData.propertyValues = attributePropertyValues;
        resultData.inAttributes = [];
        Ext.each(mappingConfigData.inSkuAttributes,function (item) {
            resultData.inAttributes.push(item.id);
        });

        resultData.condition.expression = "function expression(inputContext) {"+attributeVariables+ executeConditionExpression+"}";
        return resultData;
    },
    oneWaySimpleValueMapping: function (mappingConfigData) {
        var me = this;
        var resultData = {
            condition: {
                "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": "Boolean",
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression(inputContext) {return true}",
                "promptTemplate": "",
                "multilingualKey": "com.qpp.cgp.expression.Expression"
            },
            clazz: "com.qpp.cgp.domain.attributeconfig.MultiAttributeOneWayPropertyValueConfig",
            propertyValues: [],
            inAttributes: []
        };
        resultData.productId = mappingConfigData.productId;
        resultData.name = resultData.description;
        var resultInSkuAttributes = [];
        var skuAttributeObjs = [];
        Ext.each(mappingConfigData.inputs, function (item) {
            skuAttributeObjs.push(item.skuAttribute);
            resultInSkuAttributes.push(item.skuAttribute.id);
        });
        resultData.inAttributes = resultInSkuAttributes;
        var dealInputs = function (inputs) {
            var template = new Ext.XTemplate(
                'if(',
                '<tpl for=".">',
                //'{skuAttribute.name}'+' == ' + '{value.value}',
                '<tpl if="xindex != 1">',
                ' && ' + 'skuAttribute_{skuAttribute.id}' + ' == ' + '{value.value}',
                '<tpl else>',
                'skuAttribute_{skuAttribute.id}' + ' == ' + '{value.value}',
                '</tpl>',
                '</tpl>',
                ')'
            ).apply(inputs);
            return template;
        };
        var inputValue = dealInputs(mappingConfigData.inputs);
        var attributeVariables = me.definefixValueVariable(mappingConfigData.inSkuAttributes);
        resultData.propertyValues = me.dealOutPuts(mappingConfigData.inputs, inputValue, attributeVariables);
        return resultData;

    },
    oneWaySimpleCalculateValueMaping: function (mappingConfigData) {
        var me = this;
        var resultData = {
            condition: {
                "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": "Boolean",
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression(inputContext) {return true}",
                "promptTemplate": "",
                "multilingualKey": "com.qpp.cgp.expression.Expression"
            },
            clazz: "com.qpp.cgp.domain.attributeconfig.MultiAttributeOneWayPropertyValueConfig",
            propertyValues: [],
            inAttributes: []
        };
        var inAttributeObjs = mappingConfigData.inSkuAttributes;
        resultData.inAttributes = [];
        Ext.each(inAttributeObjs,function (item) {
            resultData.inAttributes.push(item.id);
        });
        resultData.productId = mappingConfigData.productId;
        resultData.name = resultData.description;
        var attributeVariables = me.definefixValueVariable(mappingConfigData.inSkuAttributes);
        resultData.propertyValues = me.dealOutPuts(mappingConfigData.outputs, null, attributeVariables);
        return resultData;


    },
    attributeMappingRule: function (mappingRule,attributeVariables) {
        var me = this;
        var judgeCondition = "if(" + me.inputCondition(mappingRule.input) + ")";
        var attributePropertyValues = me.dealOutPuts(mappingRule.outputs,judgeCondition,attributeVariables);
        return attributePropertyValues;
    },
    executeCondition: function (executeCondition) {
        var me = this;
        var profiles = executeCondition.executeProfileItemIds;
        var profileCondition = (Ext.isEmpty(profiles)? "[]": JSON.stringify(profiles))+".indexOf(profileContext.currentProfile.profileId)";
        var operation = me.inputCondition(executeCondition.executeAttributeInput);
        return "return " + profileCondition +"&& (" +operation+")";

    },
    inputCondition: function (InputCondition) {
        var me = this;
        return me.operation(InputCondition.operation);
    },
    operation: function (operation) {
        var me = this;
        var resultData = '';
        var relateOperator = '';
        var operationClazz = operation.clazz;
        if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation') {
            var logicalOperator = '';
            if (operation.operator == 'AND') {
                logicalOperator = ' && ';
            } else if (operation.operator == 'OR') {
                logicalOperator = ' || ';
            }
            Ext.each(operation.operations, function (item, index) {
                if (item.clazz == 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation') {
                    me.operation(item);
                } else if (item.clazz != 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation' && index != 0) {
                    resultData += logicalOperator + me.operation(item);
                } else if (item.clazz != 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation' && index == 0) {
                    resultData += me.operation(item);
                }
            })
        } else if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.BetweenOperation') {
            var operator = me.getSelectionOperator(operation.operator);
            var midValue = me.getBaseValueResult(operation.midValue);
            Ext.each(operation.operations, function (item, index) {
                var value = me.getBaseValueResult(item);
                if (index == 0) {
                    resultData += "(" +value + operator.leftOperator + midValue;
                } else if (index == 1) {
                    resultData += '&&' + midValue + operator.rightOperator + value + ")";
                }
            })
        } else if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.CompareOperation') {
            Ext.each(operation.operations, function (item, index) {
                var value = me.getBaseValueResult(item);
                if (index == 0) {
                    resultData += value + operation.operator;
                } else {
                    resultData += value;
                }
            })
        };
        return /*"if(" + */resultData /*+ ")"*/;
        /*if(operation.operator == 'AND'){
            relateOperator = '&&';
        }else if(operation.operator == 'OR'){
            relateOperator = '||';
        }*/
    },
    baseValue: function () {
        var me = this;
    },
    dealOutPuts: function (outputs, inputValue, attributeVariables) {
        var me = this;
        var attributePropertyValues = [];

        Ext.each(outputs, function (item) {
            var value = '';

            var attributePropertyValue = {
                propertyName: 'value',
                skuAttribute: item.skuAttribute,
                skuAttributeId: item.skuAttribute.id,
                value: {
                    "clazz": "com.qpp.cgp.expression.Expression",
                    "resultType": "Boolean",
                    "expressionEngine": "JavaScript",
                    "inputs": [],
                    "expression": "function expression(inputContext) {return true}",
                    "promptTemplate": "",
                    "multilingualKey": "com.qpp.cgp.expression.Expression"
                }
            };
            if(item.skuAttribute.attribute.selectType === 'NON'){
                attributePropertyValue.value.resultType = item.skuAttribute.attribute.valueType;
            }else{
                attributePropertyValue.value.resultType = 'Array';
            }

            if(item.value.clazz === 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue'){
                value = item.value.calculationExpression;
            }else if(item.value.clazz === 'com.qpp.cgp.domain.executecondition.operation.value.FixValue'){
                value = item.value.value;
                if(item.skuAttribute.attribute.selectType != 'NON'){
                    value = "[" + item.value.value + "]";
                }
                value = item.value.value;
            }

            if (Ext.isEmpty(inputValue)) {
                attributePropertyValue.value.expression = "function expression(inputContext) {" + attributeVariables + "return " + value + "}";
            } else {
                attributePropertyValue.value.expression = "function expression(inputContext) {" + attributeVariables + inputValue + "{ return " + value + "}" + "}";
            }

            attributePropertyValues.push(attributePropertyValue);

        });
        return attributePropertyValues;

    },
    definefixValueVariable: function (attributes) {
        var resultData = 'var profileContext = inputContext.context.profileContext;var currentProfile = profileContext.currentProfile;' +
            'var currentProfileAttributeValues = currentProfile.attributeValues;';
        Ext.each(attributes, function (item) {
            var valueExpression = 'var ' + 'skuAttribute_'+item.id + ' = ' + 'currentProfileAttributeValues[' + item.id + '];';
            resultData += valueExpression;
        });
        return resultData;

    },
    dealSingleAttributeContinuousValueConstraint: function (constraint) {
        var me = this;
        var constraintClazz = constraint.clazz;
        switch (constraintClazz) {
            case 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousFixValueConstraint':
                return me.dealContinuousCalculateValueConstraint(constraint);
                break;
            case 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousAttributeValueConstraint':
                return me.dealContinuousCalculateValueConstraint(constraint);
                break;
            case 'com.qpp.cgp.domain.attributeconstraint.single.SIngleAttributeDiscreteValueConstraint':
                return me.dealSingleAttributeDiscreteValueConstraint(constraint);
                break;
        }
    },

    dealContinuousCalculateValueConstraint: function (constraint) {
        var me =this;
        var continuousConstraintDomain = {
            "skuAttributeId": null,
            "clazz": "com.qpp.cgp.domain.product.attribute.constraint2.single.ContinuousValueConstraint",
            "description": "",
            "conditions": [],
            "validateExpression": {
                "clazz": "com.qpp.cgp.expression.CustomExpression",
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression() { return Number(context.inputs.min)<Number(context.context.currentAttributeValue.value) && Number(context.context.currentAttributeValue.value)<Number(context.inputs.max);}",
                "resultType": "Boolean",
                "promptTemplate": ""
            }
        };
        var condition= {
            "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": "Boolean",
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression(inputContext) {return true}",
                "promptTemplate": "",
                "multilingualKey": "com.qpp.cgp.expression.Expression"
        };
        var executeConditionExpression = me.executeCondition(constraint.executeCondition);

        var attributeVariables = me.attributeMappingRule(constraint.executeCondition.executeAttributeInput.operation);

        condition.expression = "function expression(inputContext) {"+attributeVariables+ executeConditionExpression+"}";
        var constraintClazz = constraint.clazz;
        continuousConstraintDomain.conditions = [condition];
        var minInput = {
            "name": "min",
            "clazz": "com.qpp.cgp.expression.ExpressionInput",
            "value": {
                "clazz": "com.qpp.cgp.value.ConstantValue",
                "type": "Number",
                "value": "100"
            }
        };
        var maxInput = {
            "name": "max",
            "clazz": "com.qpp.cgp.expression.ExpressionInput",
            "value": {
                "clazz": "com.qpp.cgp.value.ConstantValue",
                "type": "Number",
                "value": "200"
            }
        };
        continuousConstraintDomain.skuAttributeId = constraint.skuAttributeId;
        if(constraintClazz === 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousFixValueConstraint'){
            maxInput.value.value = constraint.maxValue;
            minInput.value.value = constraint.minValue;
        }else if(constraintClazz === 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousAttributeValueConstraint'){
            minInput.value.clazz = 'com.qpp.cgp.value.ProductAttrValueEx';
            maxInput.value.clazz = 'com.qpp.cgp.value.ProductAttrValueEx';
            maxInput.value.attributeId = constraint.minAttributeId;
            minInput.value.attributeId = constraint.minAttributeId;
        }

        if(['<','<='].indexOf(constraint.operator) === 0 || ['<','<='].indexOf(constraint.operator) === 0){
            continuousConstraintDomain.validateExpression.inputs = [maxInput];
            continuousConstraintDomain.validateExpression.expression = "function expression() { return Number(context.context.currentAttributeValue.value)"+constraint.operator+"Number(context.inputs.max);}";
        }else if(['>','>='].indexOf(constraint.operator) === 0 || ['>','>='].indexOf(constraint.operator) === 0){
            continuousConstraintDomain.validateExpression.inputs = [minInput];
            continuousConstraintDomain.validateExpression.expression = "function expression() { return  Number(context.context.currentAttributeValue.value)"+constraint.operator+"Number(context.inputs.min);}";
        }else{
            var oprator = me.getSelectionOperator(constraint.operator);
            continuousConstraintDomain.validateExpression.inputs = [minInput,maxInput];
            continuousConstraintDomain.validateExpression.expression = "function expression() { return Number(context.inputs.min)"+oprator.leftOperator+"Number(context.context.currentAttributeValue.value) && Number(context.context.currentAttributeValue.value)"+oprator.rightOperator+"Number(context.inputs.max);}";
        }
        return continuousConstraintDomain;


    },
    dealSingleAttributeDiscreteValueConstraint: function(constraint){
        var me = this;
        var continuousConstraintDomain = {
            "clazz": "com.qpp.cgp.domain.product.attribute.constraint2.single.DiscreteValueConstraint",
            "skuAttributeId": null,
            "items": [],
            "include": false
        };
        //var condition = me.executeCondition();
        continuousConstraintDomain.include = constraint.isInclude;
        continuousConstraintDomain.skuAttributeId = constraint.skuAttributeId;
        continuousConstraintDomain.items = [];
        var condition= {
            "clazz": "com.qpp.cgp.expression.Expression",
            "resultType": "Boolean",
            "expressionEngine": "JavaScript",
            "inputs": [],
            "expression": "function expression(inputContext) {return true}",
            "promptTemplate": "",
            "multilingualKey": "com.qpp.cgp.expression.Expression"
        };
        var executeConditionExpression = me.executeCondition(constraint.executeCondition);

        var attributeVariables = me.attributeMappingRule(constraint.executeCondition.executeAttributeInput.operation);

        condition.expression = "function expression(inputContext) {"+attributeVariables+ executeConditionExpression+"}";
        Ext.each(constraint.optionValues.split(','),function (item) {
            var discreteValueConstraintItem = {
                "clazz": "com.qpp.cgp.domain.product.attribute.constraint2.single.DiscreteValueConstraintItem",
                "conditions": [],
                "value": {
                    "clazz": "com.qpp.cgp.value.ConstantValue",
                    "type": "Number",
                    "value": "133730"
                }
            };
            discreteValueConstraintItem.conditions = [condition];
            discreteValueConstraintItem.value.value = item;
            continuousConstraintDomain.items.push(discreteValueConstraintItem);

        });
        return continuousConstraintDomain;

    },
    getSelectionOperator: function (operation) {
        var operator = {
            leftOperator: '',
            rightOperator: ''
        };
        switch (operation) {

            case '(min,max]':
                operator.leftOperator = '<';
                operator.rightOperator = '<=';
                break;
            case '[min,max]':
                operator.leftOperator = '<=';
                operator.rightOperator = '<=';
                break;
            case '[min,max)':
                operator.leftOperator = '<=';
                operator.rightOperator = '<';
                break;
            case '(min,max)':
                operator.leftOperator = '<';
                operator.rightOperator = '<';
                break;


        }
        return operator;
    },
    defineConstraintInputAttribute: function (operation) {
        var me = this;
        var resultData = '';
        var relateOperator = '';
        var operationClazz = operation.clazz;
        if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation') {

            Ext.each(operation.operations, function (item, index) {
                if (item.clazz == 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation') {
                    me.operation(item);
                }
            })
        } else{
            Ext.each(operation.operations, function (item, index) {
                if(item.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue'){
                    resultData += 'var ' + 'skuAttribute_'+item.id + ' = ' + 'currentProfileAttributeValues[' + item.id + '];';
                }
            })
        }
        return resultData ;
    },
    getBaseValueResult: function (baseValue) {
        var resultValue = '';
        if(baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue'){
            resultValue = baseValue.value;
        }else if(baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue'){
            resultValue = baseValue.calculationExpression;
        }else if(baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue'){
            resultValue = "skuAttribute_"+baseValue.skuAttributeId;
        }
        else if(baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.VariableValue'){
            var contentAttributeStore=Ext.data.StoreManager.lookup('contentAttributeStore');
            var attrRecord=contentAttributeStore.findRecord('key',baseValue.name);
            if (attrRecord?.get('attrOptions')?.length>0) {
                resultValue = "lineItems[0].productInstance.productAttributeValueMap['" + baseValue.name + "'].attributeOptionIds";
            } else {
                if(baseValue.name == 'qty'){
                    resultValue = 'lineItems[0].qty';
                }else{
                    resultValue = "lineItems[0].productInstance.productAttributeValueMap['" + baseValue.name + "'].attributeValue";
                }

            }
        }
        return resultValue;
    }
});
