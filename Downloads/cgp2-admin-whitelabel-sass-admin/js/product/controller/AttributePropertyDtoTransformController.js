Ext.define("CGP.product.controller.AttributePropertyDtoTransformController", {
    valueTypeisBooleanArr: ['Hidden', 'Enable', 'Required', 'ReadOnly'],
    //额外的自定义方法，用于处理数组比较，是否包含某个元素
    //isContainer 两边必须都为array，第一个为值，第二个为上下文属性
    extraFunString: 'var profileContext = inputContext.context.profileContext;var inputs = inputContext.inputs;var currentProfile = profileContext.currentProfile;var profiles = profileContext.profileAttributeValues;' +
        'var currentProfileAttributeValues = currentProfile.attributeValues;function isContained(aa,bb){if(typeof(bb)=="string"){bb=bb.split(",")}if(aa==null||aa==undefined||aa==""){return false}if(bb==null||bb==undefined||bb==""){return false}for(var i=0;i<bb.length;i++){var flag=false;for(var j=0;j<aa.length;j++){if(aa[j]==bb[i]){flag=true;break}}if(flag==false){return flag}}return true};function equal(arr1,arr2){var flag=true;if(typeof(arr1)=="string"){arr1=arr1.split(",")}if(typeof(arr2)=="string"){arr2=arr2.split(",")}if(arr1==""||arr1==undefined||arr1==null){if(arr2.length==0){return true}else{return false}}if(arr2==""||arr2==undefined||arr2==null){if(arr1.length==0){return true}else{return false}}if(arr1.length!==arr2.length){flag=false}else{arr1.forEach(function(item,index,arr){if(!isContained(arr2,[item])){flag=false}})}return flag};',
    /**
     *
     * @param mappingConfigData
     */
    dealOneWayAttributeMapping: function (mappingConfigData) {
        var me = this;
        var mappingClazz = mappingConfigData.clazz;
        var resultData = {};
        if (mappingClazz == 'com.qpp.cgp.domain.attributemapping.oneway.ConditionOneWayValueMapping') {
            resultData = me.conditionAttributeMapping(mappingConfigData);
        } else if (mappingClazz == 'com.qpp.cgp.domain.attributemapping.oneway.OneWaySimpleValueMapping') {
            resultData = me.oneWaySimpleValueMapping(mappingConfigData);
        } else if (mappingClazz == 'com.qpp.cgp.domain.attributemapping.oneway.OneWaySimpleCalculateValueMapping') {
            resultData = me.oneWaySimpleCalculateValueMaping(mappingConfigData)
        } else if (mappingClazz == 'com.qpp.cgp.domain.attributemapping.enableoption.MultiDiscreteAttributeEnableOptionMapping') {
            resultData = me.dealMultiDiscreteAttributeEnableOptionMapping(mappingConfigData)
        } else if (mappingClazz == 'com.qpp.cgp.domain.attributemapping.oneway.OneWaySimpleCalculateValueConditionMapping') {
            resultData = me.oneWaySimpleCalculateValueConditionMaping(mappingConfigData)
        }
        resultData.productId = mappingConfigData.productId;
        resultData.mappingLinks = mappingConfigData.mappingLinks;
        resultData.propertyPath = JSON.parse(JSON.stringify(mappingConfigData.attributePropertyPath));
        resultData.propertyPath.clazz = 'com.qpp.cgp.domain.attributecalculate.PropertyPath';
        resultData.propertyPath.mappingLink = resultData.propertyPath.entryLink;
        resultData.depends = [];
        Ext.each(mappingConfigData.depends, function (item) {
            resultData.depends.push(item.attributeMappingDomain);
        });
        return resultData;
    },
    dealMultiDiscreteAttributeEnableOptionMapping: function (mappingConfigData) {
        var me = this;
        var resultData = {
            "clazz": "com.qpp.cgp.domain.attributecalculate.MultiDiscreteEnableOptionsConfig",
            "productId": mappingConfigData.productId,
            "items": [{
                "clazz": "com.qpp.cgp.domain.product.attribute.constraint2.multi.MultiDiscreteValueMappingItem",
                "conditions": [{
                    "clazz": "com.qpp.cgp.expression.Expression",
                    "resultType": "Boolean",
                    "expressionEngine": "JavaScript",
                    "inputs": [],
                    "expression": "function expression(){return true;}",
                    "promptTemplate": null
                }],
                "attributeValues": [{
                    "clazz": "com.qpp.cgp.domain.product.attribute.constraint2.multi.AttributeValue",
                    "attributeId": 187898,
                    "value": {
                        "clazz": "com.qpp.cgp.value.ConstantValue",
                        "type": "Number",
                        "constraints": [],
                        "value": "133724",
                        "multilingualKey": "com.qpp.cgp.value.ConstantValue"
                    }
                }]
            }],
            "isEnable": mappingConfigData.enable,
            "skuAttributeIds": mappingConfigData.inSkuAttributeIds,
            "isInclude": true
        };
        resultData.description = mappingConfigData.description;
        resultData.skuAttributes = mappingConfigData.inSkuAttributeIds;
        resultData.items = me.dealMultiAttributeDiscreteValueMappingItems(mappingConfigData.items);
        return resultData;
    },
    dealMultiAttributeDiscreteValueMappingItems: function (multiAttributeDiscreteValueConstraintItems) {
        var me = this;
        var resultItems = [];
        if (multiAttributeDiscreteValueConstraintItems.length > 1) {
            Ext.each(multiAttributeDiscreteValueConstraintItems, function (multiAttributeDiscreteValueConstraintItem, index) {
                if (multiAttributeDiscreteValueConstraintItem[index].rules.clazz !== multiAttributeDiscreteValueConstraintItem[index + 1].rules.clazz) {
                    Ext.Msg.alert('提示', '映射item的类型冲突！');
                    return
                }
            })
        }
        Ext.each(multiAttributeDiscreteValueConstraintItems, function (multiAttributeDiscreteValueConstraintItem, index) {
            var condition = {
                "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": "Boolean",
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression(inputContext) {return true}",
                "promptTemplate": "",
                "multilingualKey": "com.qpp.cgp.expression.Expression"
            };
            var executeConditionExpression = me.executeCondition(multiAttributeDiscreteValueConstraintItem.executeCondition);

            var attributeVariables = 'var profileContext = inputContext.context.profileContext;var currentProfile = profileContext.currentProfile;var profiles = profileContext.profileAttributeValues;' +
                'var currentProfileAttributeValues = currentProfile.attributeValues;';
            if (!Ext.isEmpty(multiAttributeDiscreteValueConstraintItem.executeCondition.executeAttributeInput)) {
                attributeVariables += me.defineConstraintInputAttribute(multiAttributeDiscreteValueConstraintItem.executeCondition.executeAttributeInput.operation);
            }
            condition.expression = "function expression(inputContext) {" + attributeVariables + executeConditionExpression + "}";
            Ext.each(multiAttributeDiscreteValueConstraintItem.rules, function (rule) {

                resultItems = Ext.Array.merge(resultItems, me.dealMultiAttributeDiscreteValueMappingItemRule(rule, condition));
            })
        });
        return resultItems;

    },
    dealMultiAttributeDiscreteValueMappingItemRule: function (rule, condition) {
        var me = this;
        var ruleItems = [];
        var ruleItem = {
            "clazz": "com.qpp.cgp.domain.product.attribute.constraint2.multi.MultiDiscreteValueConstraintItem",
            "conditions": [],
            "attributeValues": []
        };
        ruleItem.conditions[0] = condition;
        if (rule.clazz === 'com.qpp.cgp.domain.attributemapping.enableoption.AttributeKeyValueList') {
            ruleItem.attributeValues = [];
            Ext.each(rule.list, function (attributeKeyValue) {
                var attributeValue = {
                    "clazz": "com.qpp.cgp.domain.product.attribute.constraint2.multi.AttributeValue",
                    "attributeId": 187898,
                    "value": {
                        "clazz": "com.qpp.cgp.value.ConstantValue",
                        "type": "Number",
                        "constraints": [],
                        "value": "133724"
                    }
                };
                attributeValue.attributeId = attributeKeyValue.skuAttributeId;
                attributeValue.value.value = attributeKeyValue.optionId;
                ruleItem.attributeValues.push(attributeValue);
            });
            ruleItems.push(ruleItem);

        } else if (rule.clazz === 'com.qpp.cgp.domain.attributemapping.enableoption.DecisionTree') {
            var root = {
                children: rule.tree,
                leaf: false
            };
            var attributeValues = me.createAttributeValues(root);
            Ext.Array.each(attributeValues, function (item) {
                var attributeArr = [];
                var ConstraintItem = {};
                ConstraintItem.conditions = [];
                Ext.Object.each(item, function (key, value) {
                    attributeArr.push({
                        attributeId: parseInt(key),
                        clazz: 'com.qpp.cgp.domain.product.attribute.constraint2.multi.AttributeValue',
                        value: {
                            clazz: 'com.qpp.cgp.value.ConstantValue',
                            type: 'Number',
                            value: value
                        }
                    })
                });
                ConstraintItem.conditions[0] = condition;
                ConstraintItem.clazz = 'com.qpp.cgp.domain.product.attribute.constraint2.multi.MultiDiscreteValueConstraintItem';
                ConstraintItem.attributeValues = attributeArr;
                ruleItems.push(ConstraintItem);
            });

        }
        return ruleItems;
    },
    dealTwoWayAttributeMapping: function (mappingConfigData) {
        var me = this;
        var resultData = {
            clazz: 'com.qpp.cgp.domain.attributeconfig.MultiAttributeTwoWayPropertyValueConfig',
            name: '',
            skuAttributes: [],
            items: []
        };
        var skuAttributeObjs = Ext.Array.merge(mappingConfigData.leftAttributes, mappingConfigData.rightAttributes);
        resultData.skuAttributes = Ext.Array.merge(mappingConfigData.leftSkuAttributeIds, mappingConfigData.rightSkuAttributeIds);
        var attributeVariables = me.definefixValueVariable(skuAttributeObjs);
        var condition = {
            "clazz": "com.qpp.cgp.expression.Expression",
            "resultType": "Boolean",
            "expressionEngine": "JavaScript",
            "inputs": [],
            "expression": "function expression(inputContext) {return true}",
            "promptTemplate": "",
            "multilingualKey": "com.qpp.cgp.expression.Expression"
        };
        var executeConditionExpression = me.executeCondition(mappingConfigData.executeCondition);
        condition.expression = "function expression(inputContext) {" + attributeVariables + executeConditionExpression + "}";
        resultData.productId = mappingConfigData.productId;
        resultData.mappingLinks = mappingConfigData.mappingLinks;

        resultData.depends = [];
        Ext.each(mappingConfigData.depends, function (item) {
            resultData.depends.push(item.attributeMappingDomain);
        });
        resultData.items = me.dealTwoWayMappingGrids(mappingConfigData.mappingGrids, condition, attributeVariables);
        return resultData;
    },
    dealTwoWayMappingGrids: function (mappingGrids, condition, attributeVariables) {
        var me = this;
        var recordItems = [];
        Ext.each(mappingGrids, function (item) {
            var recordItem = {
                left: [],
                condition: condition,
                right: []
            };
            recordItem.left = me.dealOutPuts(item.leftValues, null, attributeVariables, []);
            recordItem.right = me.dealOutPuts(item.rightValues, null, attributeVariables, []);
            recordItems.push(recordItem);
        });
        return recordItems;
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
        /*Ext.each(mappingConfigData.mappingRules, function (mappingRule) {
            attributePropertyValues = Ext.Array.merge(attributePropertyValues, me.attributeMappingRule(mappingRule, attributeVariables));
        });*/

        resultData.propertyValues = me.dealMappingRules(mappingConfigData.mappingRules, mappingConfigData.inSkuAttributes);
        resultData.inAttributes = [];
        Ext.each(mappingConfigData.inSkuAttributes, function (item) {
            resultData.inAttributes.push(item.id);
        });
        resultData.condition.expression = "function expression(inputContext) {" + attributeVariables + executeConditionExpression + "}";
        resultData.name = mappingConfigData.description;
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
        resultData.name = mappingConfigData.description;
        var resultInSkuAttributes = [];
        var skuAttributeObjs = [];
        Ext.each(mappingConfigData.inputs, function (item) {
            skuAttributeObjs.push(item.propertyPath.skuAttribute);
            resultInSkuAttributes.push(item.propertyPath.skuAttribute.id);
        });
        resultData.inAttributes = resultInSkuAttributes;
        var dealInputs = function (inputs) {
            var inputVariables = '';
            Ext.Array.each(inputs, function (input, index) {
                var selectType = input.propertyPath.skuAttribute.attribute.selectType;
                var propertyPath = input.propertyPath;
                var value = input.value;
                if (index == 0) {
                    if (selectType == 'SINGLE') {
                        inputVariables += 'profiles["' + propertyPath.attributeProfile._id + '"]["' + propertyPath.skuAttribute.id + '"]["' + propertyPath.propertyName + '"][0]' + ' == ' + value.value;
                    } else if (selectType == 'MULTI') {
                        inputVariables += '"' + 'profiles["' + propertyPath.attributeProfile._id + '"]["' + propertyPath.skuAttribute.id + '"]["' + propertyPath.propertyName + '"]' + ' == ' + value.value + '"';
                    } else {
                        inputVariables += 'profiles["' + propertyPath.attributeProfile._id + '"]["' + propertyPath.skuAttribute.id + '"]["' + propertyPath.propertyName + '"]' + ' == ' + value.value;
                    }
                } else {
                    if (selectType == 'SINGLE') {
                        inputVariables += ' && ' + 'profiles["' + propertyPath.attributeProfile._id + '"]["' + propertyPath.skuAttribute.id + '"]["' + propertyPath.propertyName + '"][0]' + ' == ' + value.value;
                    } else if (selectType == 'MULTI') {
                        inputVariables += ' && ' + '"' + 'profiles["' + propertyPath.attributeProfile._id + '"]["' + propertyPath.skuAttribute.id + '"]["' + propertyPath.propertyName + '"]' + ' == ' + value.value + '"';
                    } else {
                        inputVariables += ' && ' + 'profiles["' + propertyPath.attributeProfile._id + '"]["' + propertyPath.skuAttribute.id + '"]["' + propertyPath.propertyName + '"]' + ' == ' + value.value;
                    }
                }
            });
            return inputVariables;
        };
        var inputValue = dealInputs(mappingConfigData.inputs);
        var attributeVariables = me.definefixValueVariable(mappingConfigData.inSkuAttributes);
        resultData.propertyValues = me.dealOutPuts(mappingConfigData.outputs, inputValue, attributeVariables, []);
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
        Ext.each(inAttributeObjs, function (item) {
            resultData.inAttributes.push(item.id);
        });
        resultData.name = mappingConfigData.description;
        var attributeVariables = me.definefixValueVariable(mappingConfigData.inSkuAttributes);
        resultData.propertyValues = me.dealOutPuts(mappingConfigData.outputs, null, attributeVariables);
        return resultData;

    },
    oneWaySimpleCalculateValueConditionMaping: function (mappingConfigData) {
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
        Ext.each(inAttributeObjs, function (item) {
            resultData.inAttributes.push(item.id);
        });
        resultData.name = mappingConfigData.description;
        var executeConditionExpression = me.executeCondition(mappingConfigData.executeCondition);
        var attributeVariables = me.definefixValueVariable(mappingConfigData.inSkuAttributes);
        resultData.condition.expression = "function expression(inputContext) {" + attributeVariables + executeConditionExpression + "}";
        var inputs = me.dealExtraParams(mappingConfigData.inputGroups);
        resultData.propertyValues = me.dealOutPuts(mappingConfigData.outputs, null, attributeVariables, inputs);
        return resultData;
    },
    dealMappingRules: function (mappingrules, inSkuAttributes) {
        var me = this;
        var rulesToAttrPropertyValue = {};
        var propertyValueGroup = [];
        var mappingRuleGroup = [];
        var attributeVariables = me.definefixValueVariable(inSkuAttributes);
        Ext.each(mappingrules[0].outputs, function (output) {
            rulesToAttrPropertyValue[output.propertyPath.skuAttributeId + '_' + output.propertyPath.propertyName] = [];
        });

        Ext.each(mappingrules, function (rule, index) {
            Ext.each(rule.outputs, function (output) {
                output.input = rule.input;
                rulesToAttrPropertyValue[output.propertyPath.skuAttributeId + '_' + output.propertyPath.propertyName].push(output);
            })
        });
        Ext.Object.each(rulesToAttrPropertyValue, function (key, value) {
            var attrPropertyValue = {
                propertyPath: {
                    propertyName: 'value',
                    skuAttribute: 'skuAttribute',
                    skuAttributeId: 'skuAttributeId',
                    attributeProfile: null
                },
                propertyValue: {
                    clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                    type: 'Boolean',
                    expression: {
                        "clazz": "com.qpp.cgp.expression.Expression",
                        "resultType": "Boolean",
                        "expressionEngine": "JavaScript",
                        "inputs": [],
                        "expression": "function expression(inputContext) {return true}",
                        "promptTemplate": "",
                        "multilingualKey": "com.qpp.cgp.expression.Expression"
                    }
                }
            };
            var conditionExpression = '';
            Ext.Array.each(value, function (item) {
                var skuAttribute = item.propertyPath.skuAttribute;
                attrPropertyValue.propertyPath = item.propertyPath;
                /*var attrPropertyValue = {
                    propertyPath: item.propertyPath,
                    propertyValue: {
                        clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                        type: 'Boolean',
                        expression: {
                            "clazz": "com.qpp.cgp.expression.Expression",
                            "resultType": "Boolean",
                            "expressionEngine": "JavaScript",
                            "inputs": [],
                            "expression": "function expression(inputContext) {return true}",
                            "promptTemplate": "",
                            "multilingualKey": "com.qpp.cgp.expression.Expression"
                        }
                    }
                };*/
                if (Ext.Array.contains(me.valueTypeisBooleanArr, item.propertyPath.propertyName)) {
                    attrPropertyValue.propertyValue.type = 'Boolean';
                    attrPropertyValue.propertyValue.expression.resultType = 'Boolean';
                } else {
                    if (skuAttribute.attribute.selectType === 'NON') {
                        attrPropertyValue.propertyValue.type = skuAttribute.attribute.valueType;
                        attrPropertyValue.propertyValue.expression.resultType = skuAttribute.attribute.valueType;
                    } else {
                        attrPropertyValue.propertyValue.type = 'Array';
                        attrPropertyValue.propertyValue.expression.resultType = 'Array';
                    }
                }
                var resultValue = '';
                if (item.value.clazz === 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue') {
                    resultValue = item.value.calculationExpression;
                    if (Ext.isEmpty(item.value.calculationExpression)) {
                        if (skuAttribute.attribute.selectType != 'NON') {
                            resultValue = "[]"
                        } else {
                            if (skuAttribute.attribute.valueType == 'String') {
                                resultValue = '"defaultNone"';
                            } else if (skuAttribute.attribute.valueType == 'Number') {
                                resultValue = Infinity;
                            }

                        }

                    }
                } else if (item.value.clazz === 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
                    resultValue = item.value.value;
                    if (skuAttribute.attribute.selectType != 'NON' && !Ext.Array.contains(me.valueTypeisBooleanArr, item.propertyPath.propertyName)) {
                        if (!Ext.isEmpty(item.isInclude) && item.isInclude == false) {
                            var originalArr = [];
                            var removeArr = item.value.value.split(',');
                            Ext.Array.each(skuAttribute.attribute.options, function (option) {
                                originalArr.push(option.id);
                            });
                            resultValue = "[" + me.removeDifferentArr(originalArr, removeArr) + "]";
                        } else {
                            resultValue = "[" + item.value.value + "]";
                        }

                    }
                    if (Ext.isEmpty(item.value.value)) {
                        if (skuAttribute.attribute.selectType != 'NON') {
                            resultValue = "[]"
                        } else {
                            if (skuAttribute.attribute.valueType == 'String') {
                                resultValue = '"defaultNone"';
                            } else if (skuAttribute.attribute.valueType == 'Number') {
                                resultValue = Infinity;
                            }

                        }
                    }

                }
                if (Ext.isEmpty(item.input) || item.input.operation?.operations?.length == 0) {
                    conditionExpression = 'return ' + resultValue + ';';
                } else {
                    if (item.input.conditionType == 'else') {
                        conditionExpression += 'return ' + resultValue + ';';
                    } else {
                        conditionExpression += 'if(' + me.inputCondition(item.input) + '){return ' + resultValue + ';}';
                    }
                }


            });
            attrPropertyValue.propertyValue.expression.expression = "function expression(inputContext) {" + attributeVariables + conditionExpression + "}";
            try {
                eval('{' + attrPropertyValue.propertyValue.expression.expression + '}');
            } catch (e) {
                console.log('表达式错误', attrPropertyValue.propertyValue.expression.expression )
            }
            propertyValueGroup.push(attrPropertyValue);
        });
        return propertyValueGroup;
    },
    attributeMappingRule: function (mappingRule, attributeVariables) {
        var me = this;

        var judgeCondition = "if(" + me.inputCondition(mappingRule.input) + ")";
        if (Ext.isEmpty(me.inputCondition(mappingRule.input))) {
            judgeCondition = "if(" + true + ")";
        }
        var attributePropertyValues = me.dealOutPuts(mappingRule.outputs, judgeCondition, attributeVariables, []);
        return attributePropertyValues;
    },
    executeCondition: function (executeCondition) {
        var me = this;
        var profiles = executeCondition.executeProfileItemIds;
        var profileCondition = (Ext.isEmpty(profiles) ? "[]" : JSON.stringify(profiles)) + ".indexOf(profileContext.currentProfile.profileId) >= 0";
        var operation = me.inputCondition(executeCondition.executeAttributeInput);
        if (Ext.isEmpty(profiles)) {
            profileCondition = true;
        }
        if (Ext.isEmpty(operation)) {
            return "return " + profileCondition;
        } else {
            return "return " + profileCondition + "&& (" + operation + ")";
        }

    },
    inputCondition: function (InputCondition) {
        var me = this;
        if (Ext.isEmpty(InputCondition)) {
            return '';
        }
        if (InputCondition.conditionType == 'custom') {
            return InputCondition.operation.expression;
        } else {
            return me.operation(InputCondition.operation);
        }
    },
    operation: function (operation) {
        var me = this;
        var resultData = '';
        if (Ext.isEmpty(operation)) {
            return resultData;
        }
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
                    resultData += "(" + value + operator.leftOperator + midValue;
                } else if (index == 1) {
                    resultData += '&&' + midValue + operator.rightOperator + value + ")";
                }
            })
        } else if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.CompareOperation') {
            var resultOperator = '';
            Ext.each(operation.operations, function (item, index) {
                var isMultiSelect = false;
                var value = me.getBaseValueResult(item);
                if (['In', 'NotIn'].indexOf(operation.operator) >= 0) {
                    if (index == 0) {
                        isMultiSelect = (item.skuAttribute.attribute.selectType == 'MULTI');
                        resultData = value;
                    } else {
                        var subArr = '[' + value + ']';
                        if (isMultiSelect) {
                            //多选的in和noin,其值就是数组
                        } else {
                            //单选的in和notIn，其值是当个数据，需转换为数组
                            //resultData = '[' + resultData + ']';
                        }
                        if (operation.operator == 'In') {
                            resultData = 'isContained(' + subArr + ',' + resultData + ')';
                        } else {
                            resultData = '!isContained(' + subArr + ',' + resultData + ')';
                        }
                    }
                } else {
                    if (index == 0) {
                        if (!Ext.isEmpty(item.skuAttribute)) {
                            if (item.skuAttribute.attribute.selectType == 'MULTI') {
                                resultData += value;
                                if (operation.operator == '!=') {
                                    resultOperator = '!equal';
                                } else {
                                    resultOperator = 'equal';
                                }

                            } else {
                                resultData += value + operation.operator;
                            }
                        } else {
                            resultData += value + operation.operator;
                        }
                    } else {
                        if (resultOperator == 'equal') {
                            resultData = 'equal(' + resultData + ',' + "'" + value + "'" + ')';
                        } else if (resultOperator == '!equal') {
                            resultData = '!equal(' + resultData + ',' + "'" + value + "'" + ')';
                        } else {
                            if (Ext.isEmpty(value)) {
                                resultData += null;
                            } else {
                                resultData += value;
                            }
                        }

                    }
                }

            })
        }
        ;
        return resultData
    },
    baseValue: function () {
        var me = this;
    },
    dealOutPuts: function (outputs, inputValue, attributeVariables, inputs) {
        var me = this;
        var attributePropertyValues = [];

        Ext.each(outputs, function (item) {
            var value = '';
            var propertyPath = item.propertyPath;
            var skuAttribute = propertyPath.skuAttribute;
            var attributePropertyValue = {
                propertyPath: {
                    skuAttribute: skuAttribute,
                    skuAttributeId: skuAttribute.id,
                    propertyName: 'value',
                    mappingLink: propertyPath.entryLink,
                    attributeProfile: propertyPath.attributeProfile,
                    clazz: 'com.qpp.cgp.domain.attributecalculate.PropertyPath',
                    _id: JSGetCommonKey()
                },
                propertyValue: {
                    clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                    type: 'Boolean',
                    expression: {}
                }
            };
            var expression = {
                "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": "Boolean",
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression(inputContext) {return true}",
                "promptTemplate": "",
                "multilingualKey": "com.qpp.cgp.expression.Expression"
            };
            expression.inputs = inputs;
            if (Ext.Array.contains(me.valueTypeisBooleanArr, propertyPath.propertyName)) {
                expression.resultType = 'Boolean';
            } else {
                if (skuAttribute.attribute.selectType === 'NON') {
                    expression.resultType = skuAttribute.attribute.valueType;
                } else {
                    expression.resultType = 'Array';
                }
            }


            if (item.value.clazz === 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue') {
                value = item.value.calculationExpression;
                if (Ext.isEmpty(item.value.calculationExpression)) {
                    if (skuAttribute.attribute.selectType != 'NON') {
                        value = "[]"
                    } else {
                        if (skuAttribute.attribute.valueType == 'String') {
                            value = '"defaultNone"';
                        } else if (skuAttribute.attribute.valueType == 'Number') {
                            value = Infinity;
                        }
                    }
                }
            } else if (item.value.clazz === 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
                value = item.value.value;
                if (skuAttribute.attribute.selectType != 'NON' && !Ext.Array.contains(me.valueTypeisBooleanArr, item.propertyPath.propertyName)) {
                    if (!Ext.isEmpty(item.isInclude) && item.isInclude == false) {
                        var originalArr = [];
                        var removeArr = item.value.value.split(',');
                        Ext.Array.each(skuAttribute.attribute.options, function (option) {
                            originalArr.push(option.id);
                        });
                        value = "[" + me.removeDifferentArr(originalArr, removeArr) + "]";
                    } else {
                        value = "[" + item.value.value + "]";
                    }

                }
                if (Ext.isEmpty(item.value.value)) {
                    if (skuAttribute.attribute.selectType != 'NON') {
                        value = "[]"
                    } else {
                        if (skuAttribute.attribute.valueType == 'String') {
                            value = '"defaultNone"';
                        } else if (skuAttribute.attribute.valueType == 'Number') {
                            value = Infinity;
                        }
                    }
                }
            }

            if (Ext.isEmpty(inputValue)) {
                expression.expression = "function expression(inputContext) {" + attributeVariables + "return " + value + "}";
            } else {
                expression.expression = "function expression(inputContext) {" + attributeVariables + 'if(' + inputValue + ')' + "{ return " + value + "}" + "}";
            }
            attributePropertyValue.propertyValue = {
                clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                type: expression.resultType,
                expression: expression
            };
            attributePropertyValue.propertyPath.propertyName = propertyPath.propertyName;
            attributePropertyValues.push(attributePropertyValue);

        });
        return attributePropertyValues;

    },
    definefixValueVariable: function (attributes) {
        var controller = this;
        var resultData = controller.extraFunString;
        Ext.each(attributes, function (item) {
            var valueExpression = 'var ' + 'skuAttribute_' + item.id + ' = ' + 'currentProfileAttributeValues[' + item.id + '];';
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
            case 'com.qpp.cgp.domain.attributeconstraint.single.SingleAttributeDiscreteValueConstraint':
                return me.dealSingleAttributeDiscreteValueConstraint(constraint);
                break;
            case 'com.qpp.cgp.domain.attributeconstraint.single.CalculateExpressionValueConstraint':
                return me.dealContinuousCalculateValueConstraint(constraint);
                break;
        }
    },
    dealContinuousCalculateValueConstraint: function (constraint) {
        var me = this;
        var continuousConstraintDomain = {
            "skuAttributeId": null,
            "clazz": "com.qpp.cgp.domain.product.attribute.constraint2.single.ContinuousValueConstraint",
            "description": "",
            "conditions": [],
            "validateExpression": {
                "clazz": "com.qpp.cgp.expression.Expression",
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression() { return Number(context.inputs.min)<Number(context.context.currentAttributeValue.value) && Number(context.context.currentAttributeValue.value)<Number(context.inputs.max);}",
                "resultType": "Boolean",
                "promptTemplate": ""
            }
        };
        var condition = {
            "clazz": "com.qpp.cgp.expression.Expression",
            "resultType": "Boolean",
            "expressionEngine": "JavaScript",
            "inputs": [],
            "expression": "function expression(inputContext) {return true}",
            "promptTemplate": "",
            "multilingualKey": "com.qpp.cgp.expression.Expression"
        };
        var executeConditionExpression = me.executeCondition(constraint.executeCondition);

        var attributeVariables = me.extraFunString;
        if (!Ext.isEmpty(constraint.executeCondition.executeAttributeInput)) {
            attributeVariables += me.defineConstraintInputAttribute(constraint.executeCondition.executeAttributeInput.operation);
        }
        continuousConstraintDomain.description = constraint.description;
        condition.expression = "function expression(inputContext) {" + attributeVariables + executeConditionExpression + "}";
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
        if (constraintClazz === 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousFixValueConstraint') {
            maxInput.value.value = constraint.maxValue;
            if (Ext.isEmpty(constraint.maxValue)) {
                maxInput.value.value = constraint.minValue;
            }
            minInput.value.value = constraint.minValue;
        } else if (constraintClazz === 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousAttributeValueConstraint') {
            minInput.value.clazz = 'com.qpp.cgp.value.ExpressionValueEx';
            maxInput.value.clazz = 'com.qpp.cgp.value.ExpressionValueEx';
            /*maxInput.value.attributeId = constraint.maxAttributeId;
            minInput.value.attributeId = constraint.minAttributeId;*/
            maxInput.value.expression = {
                "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": "Number",
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression(inputContext) {return true}",
                "promptTemplate": "",
                "multilingualKey": "com.qpp.cgp.expression.Expression"
            };
            minInput.value.expression = {
                "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": "Number",
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression(inputContext) {return true}",
                "promptTemplate": "",
                "multilingualKey": "com.qpp.cgp.expression.Expression"
            };
            var inputAttributeVariables = me.definefixValueVariable(constraint.inSkuAttributes);
            var maxSkuAttributeId;
            var minSkuAttributeId = constraint.minSkuAttributeId;
            if (Ext.isEmpty(constraint.maxSkuAttributeId)) {
                maxSkuAttributeId = constraint.minSkuAttributeId;
            } else {
                maxSkuAttributeId = constraint.maxSkuAttributeId;
            }
            maxInput.value.expression.expression = "function expression(inputContext) {" + inputAttributeVariables + "return " + "Number(inputContext.context.profileContext.currentProfile.attributeValues['" + maxSkuAttributeId + "']['Value'])" + "}";
            minInput.value.expression.expression = "function expression(inputContext) {" + inputAttributeVariables + "return " + "Number(inputContext.context.profileContext.currentProfile.attributeValues['" + minSkuAttributeId + "']['Value'])" + "}";
        } else if (constraintClazz === 'com.qpp.cgp.domain.attributeconstraint.single.CalculateExpressionValueConstraint') {
            minInput.value.clazz = 'com.qpp.cgp.value.ExpressionValueEx';
            maxInput.value.clazz = 'com.qpp.cgp.value.ExpressionValueEx';
            maxInput.value.expression = {
                "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": "Number",
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression(inputContext) {return true}",
                "promptTemplate": "",
                "multilingualKey": "com.qpp.cgp.expression.Expression"
            };
            minInput.value.expression = {
                "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": "Number",
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression(inputContext) {return true}",
                "promptTemplate": "",
                "multilingualKey": "com.qpp.cgp.expression.Expression"
            };
            var inputAttributeVariables = me.definefixValueVariable(constraint.inSkuAttributes);
            var maxExpression;
            var minExpression = constraint.minExpression;
            if (Ext.isEmpty(constraint.maxExpression)) {
                maxExpression = constraint.minExpression;
            } else {
                maxExpression = constraint.maxExpression;
            }
            maxInput.value.expression.expression = "function expression(inputContext) {" + inputAttributeVariables + "return Number(" + maxExpression + ")}";
            minInput.value.expression.expression = "function expression(inputContext) {" + inputAttributeVariables + "return Number(" + minExpression + ")}";


        }

        if (['<', '<='].indexOf(constraint.operator) >= 0 || ['<', '<='].indexOf(constraint.operator) >= 0) {
            continuousConstraintDomain.validateExpression.inputs = [maxInput];
            continuousConstraintDomain.validateExpression.expression = "function expression(inputContext) { var currentAttributeValue = inputContext.context.currentAttributeValue;return Number(currentAttributeValue.Value)" + constraint.operator + "Number(inputContext.inputs.max);}";
        } else if (['>', '>='].indexOf(constraint.operator) >= 0 || ['>', '>='].indexOf(constraint.operator) >= 0) {
            continuousConstraintDomain.validateExpression.inputs = [minInput];
            continuousConstraintDomain.validateExpression.expression = "function expression(inputContext) {var currentAttributeValue = inputContext.context.currentAttributeValue; return  Number(currentAttributeValue.Value)" + constraint.operator + "Number(inputContext.inputs.min);}";
        } else {
            var oprator = me.getSelectionOperator(constraint.operator);
            continuousConstraintDomain.validateExpression.inputs = [minInput, maxInput];
            continuousConstraintDomain.validateExpression.expression = "function expression(inputContext) { var currentAttributeValue = inputContext.context.currentAttributeValue; return Number(inputContext.inputs.min)" + oprator.leftOperator + "Number(inputContext.context.currentAttributeValue.Value) && Number(currentAttributeValue.Value)" + oprator.rightOperator + "Number(inputContext.inputs.max);}";
        }
        continuousConstraintDomain.validateExpression.promptTemplate = "function expression(inputContext) {var profileContext = inputContext.context.profileContext;var currentProfile = profileContext.currentProfile;var profiles = profileContext.profileAttributeValues; var currentProfileAttributeValues = currentProfile.attributeValues; return ' '+" + constraint.promptTemplate + "}";
        return continuousConstraintDomain;


    },
    dealMultiAttributeDiscreteValueConstraint: function (constraint) {
        var me = this;
        var resultData = {
            "clazz": "com.qpp.cgp.domain.product.attribute.constraint2.multi.MultiDiscreteValueConstraint",
            "productId": constraint.productId,
            "items": [{
                "clazz": "com.qpp.cgp.domain.product.attribute.constra  int2.multi.MultiDiscreteValueConstraintItem",
                "conditions": [{
                    "clazz": "com.qpp.cgp.expression.Expression",
                    "resultType": "Boolean",
                    "expressionEngine": "JavaScript",
                    "inputs": [],
                    "expression": "function expression(){return true;}",
                    "promptTemplate": null
                }],
                "attributeValues": [{
                    "clazz": "com.qpp.cgp.domain.product.attribute.constraint2.multi.AttributeValue",
                    "attributeId": 187898,
                    "value": {
                        "clazz": "com.qpp.cgp.value.ConstantValue",
                        "type": "Number",
                        "constraints": [],
                        "value": "133724",
                        "multilingualKey": "com.qpp.cgp.value.ConstantValue"
                    }
                }]
            }],
            "isEnable": constraint.enable,
            "skuAttributeIds": constraint.inSkuAttributeIds,
            "isInclude": true
        };
        resultData.description = constraint.description;
        resultData.items = me.dealMultiAttributeDiscreteValueConstraintItems(constraint.items);
        return resultData;
    },
    dealSingleAttributeDiscreteValueConstraint: function (constraint) {
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
        var condition = {
            "clazz": "com.qpp.cgp.expression.Expression",
            "resultType": "Boolean",
            "expressionEngine": "JavaScript",
            "inputs": [],
            "expression": "function expression(inputContext) {return true}",
            "promptTemplate": "",
            "multilingualKey": "com.qpp.cgp.expression.Expression"
        };
        var executeConditionExpression = me.executeCondition(constraint.executeCondition);

        var attributeVariables = me.extraFunString;
        if (!Ext.isEmpty(constraint.executeCondition.executeAttributeInput)) {
            attributeVariables += me.defineConstraintInputAttribute(constraint.executeCondition.executeAttributeInput.operation);
        }
        continuousConstraintDomain.description = constraint.description;
        condition.expression = "function expression(inputContext) {" + attributeVariables + executeConditionExpression + "}";
        Ext.each(constraint.optionValues.split(','), function (item) {
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
        } else {
            Ext.each(operation.operations, function (item, index) {
                if (item.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue') {
                    resultData += 'var ' + 'skuAttribute_' + item.id + ' = ' + 'currentProfileAttributeValues[' + item.id + '];';
                }
            })
        }
        return resultData;
    },
    getBaseValueResult: function (baseValue) {

        var resultValue = '';
        if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
            if (Array.isArray(baseValue.value)) {
                resultValue = baseValue.value.join(',');
            } else {
                resultValue = baseValue.value;

            }
            if (!Ext.isString(resultValue)) {
                resultValue = '"' + resultValue + '"';
            }
        } else if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue') {
            resultValue = baseValue.calculationExpression;
        } else if (baseValue.attributeId && baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue') {
            resultValue = "attribute_" + baseValue.attributeId;
            if (baseValue.skuAttribute.attribute.selectType == 'SINGLE' && (baseValue.propertyName == 'Value' || baseValue.propertyName == undefined)) {
                resultValue += '[0]';
            }
        } else if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue') {
            resultValue = "skuAttribute_" + baseValue.skuAttributeId;
        } else if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.PropertyPathValue') {
            resultValue = this.getPropertyPathValue(baseValue);
            /*else if(baseValue.skuAttribute.attribute.selectType == 'MULTI'){
                resultValue = resultValue+ '.join(",")';
            }*/
        }
        /*if(Ext.isEmpty(resultValue)){

            return '"defaultNone"';
        }*/
        return resultValue;
    },
    getPropertyPathValue: function (baseValue) {
        var resultValue = "profiles['" + baseValue.attributeProfile._id + "']['" + baseValue.skuAttributeId + "']['" + baseValue.propertyName + "']";
        if (baseValue.skuAttribute.attribute.selectType == 'SINGLE' && baseValue.propertyName == 'Value') {
            resultValue += '[0]';
        }
        return resultValue;
    },
    dealMultiAttributeDiscreteValueConstraintItems: function (multiAttributeDiscreteValueConstraintItems) {
        var me = this;
        var resultItems = [];
        if (multiAttributeDiscreteValueConstraintItems.length > 1) {
            Ext.each(multiAttributeDiscreteValueConstraintItems, function (multiAttributeDiscreteValueConstraintItem, index) {
                if (multiAttributeDiscreteValueConstraintItem[index].rules.clazz !== multiAttributeDiscreteValueConstraintItem[index + 1].rules.clazz) {
                    Ext.Msg.alert('提示', '约束item的类型冲突！');
                    return
                }
            })
        }
        Ext.each(multiAttributeDiscreteValueConstraintItems, function (multiAttributeDiscreteValueConstraintItem, index) {
            var condition = {
                "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": "Boolean",
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression(inputContext) {return true}",
                "promptTemplate": "",
                "multilingualKey": "com.qpp.cgp.expression.Expression"
            };
            var executeConditionExpression = me.executeCondition(multiAttributeDiscreteValueConstraintItem.executeCondition);

            var attributeVariables = me.extraFunString;
            if (!Ext.isEmpty(multiAttributeDiscreteValueConstraintItem.executeCondition.executeAttributeInput)) {
                attributeVariables += me.defineConstraintInputAttribute(multiAttributeDiscreteValueConstraintItem.executeCondition.executeAttributeInput.operation);
            }
            condition.expression = "function expression(inputContext) {" + attributeVariables + executeConditionExpression + "}";
            Ext.each(multiAttributeDiscreteValueConstraintItem.rules, function (rule) {

                resultItems = Ext.Array.merge(resultItems, me.dealMultiAttributeDiscreteValueConstraintItemRule(rule, condition));
            })
        });
        return resultItems;

    },
    dealMultiAttributeDiscreteValueConstraintItemRule: function (rule, condition) {
        var me = this;
        var ruleItems = [];
        var ruleItem = {
            "clazz": "com.qpp.cgp.domain.product.attribute.constraint2.multi.MultiDiscreteValueConstraintItem",
            "conditions": [],
            "attributeValues": []
        };
        ruleItem.conditions[0] = condition;
        if (rule.clazz === 'com.qpp.cgp.domain.attributeconstraint.multi.rule.ListData') {
            ruleItem.attributeValues = [];
            Ext.each(rule.list, function (attributeKeyValue) {
                var attributeValue = {
                    "clazz": "com.qpp.cgp.domain.product.attribute.constraint2.multi.AttributeValue",
                    "attributeId": 187898,
                    "value": {
                        "clazz": "com.qpp.cgp.value.ConstantValue",
                        "type": "Number",
                        "constraints": [],
                        "value": "133724"
                    }
                };
                attributeValue.attributeId = attributeKeyValue.skuAttributeId;
                attributeValue.value.value = attributeKeyValue.optionId;
                ruleItem.attributeValues.push(attributeValue);
            });
            ruleItems.push(ruleItem);

        } else if (rule.clazz === 'com.qpp.cgp.domain.attributeconstraint.multi.rule.DecisionTreeData') {
            var root = {
                children: rule.tree,
                leaf: false
            };
            var attributeValues = me.createAttributeValues(root);
            Ext.Array.each(attributeValues, function (item) {
                var attributeArr = [];
                var ConstraintItem = {};
                ConstraintItem.conditions = [];
                Ext.Object.each(item, function (key, value) {
                    attributeArr.push({
                        attributeId: parseInt(key),
                        clazz: 'com.qpp.cgp.domain.product.attribute.constraint2.multi.AttributeValue',
                        value: {
                            clazz: 'com.qpp.cgp.value.ConstantValue',
                            type: 'Number',
                            value: value
                        }
                    })
                });
                ConstraintItem.conditions[0] = condition;
                ConstraintItem.clazz = 'com.qpp.cgp.domain.product.attribute.constraint2.multi.MultiDiscreteValueConstraintItem';
                ConstraintItem.attributeValues = attributeArr;
                ruleItems.push(ConstraintItem);
            });

        }
        return ruleItems;
    },
    /**
     * 生成该决策树下属性选项全部可能性组合
     * @param root
     * @returns {Array}
     */
    createAttributeValues: function (root) {
        var me = this;

        function depthFirstPreOrder(node, paths, position) {
            var i, count, path;
            //var data = {};
            var children = node.children;

            if (children.length > 0) {
                for (i = 0, count = children.length; i < count; i++) {
                    var child = children[i];

                    if (i > 0) {
                        position.pop();
                    }
                    position.push(child);

                    depthFirstPreOrder(child, paths, position);

                    if (i == count - 1) {
                        position.pop();
                    }
                }
            } else {
                var data = {};
                /*path = position.map(function (currentValue) {
                 var node = {
                 attributeId: currentValue.data.attributeId,
                 //id: currentValue.id,
                 clazz: '',
                 value: {
                 type: 'Number',
                 clazz: 'constantValue',
                 value: (currentValue.data.optionId).toString()
                 }
                 *//*id:currentValue.id,
                 propertyName:currentValue.propertyName,
                 propertyValue:currentValue.propertyValue*//*
                 };
                 return node;
                 });*/
                Ext.Array.each(position, function (item) {
                    data[item.skuAttributeId] = item.optionId
                });
                paths.push(data);
            }
        }


        var paths = new Array(), position = new Array();

        depthFirstPreOrder(root, paths, position);
        return paths
        //console.log(paths);
    },
    dealPropertyPathDto: function (propertyPathDto) {
        var me = this;
        var _id = JSGetCommonKey(false);
        var propertyPath = {
            propertyName: propertyPathDto.propertyName,
            EntryLink: {},
            attributeId: propertyPathDto.attributeId,
            _id: _id,
            clazz: ''
        };
    },
    removeDifferentArr: function (arr1, arr2) {
        for (var i = 0; i < arr2.length; i++) {
            for (var j = 0; j < arr1.length; j++) {
                if (arr2[i] == arr1[j]) {
                    // console.log('输出重复的内容====》',arr1[j],'输出在父数组中的下标=====>', arr1.indexOf(arr1[j]),);
                    var indexs = arr1.indexOf(arr1[j]);
                    arr1.splice(indexs, 1);
                }
            }
        }
        // console.log('arr1======>',arr1);
        return arr1
    },
    dealExtraParams: function (inputGroups) {
        var me = this;
        var extraParams = [];
        var allInputs = [];
        Ext.Array.each(inputGroups, function (inputGroup) {
            Ext.Array.each(inputGroup.inputKeys, function (inputKey) {
                var input = {
                    name: inputKey.name,
                    valueType: inputKey.valueType,
                    values: inputGroup.conditionInputs
                };
                allInputs.push(input);
            })
        });
        var attributeVariables = me.definefixValueVariable([]);
        Ext.Array.each(allInputs, function (inputKeyValue) {
            var expression = {
                clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                type: inputKeyValue.valueType,
                expression: {
                    "clazz": "com.qpp.cgp.expression.Expression",
                    "resultType": inputKeyValue.valueType,
                    "expressionEngine": "JavaScript",
                    "inputs": [],
                    "expression": "function expression(inputContext) {return true}",
                    "promptTemplate": "",
                    "multilingualKey": "com.qpp.cgp.expression.Expression"
                }
            };
            var input = {
                name: inputKeyValue.name,
                value: expression,
                clazz: "com.qpp.cgp.expression.ExpressionInput"
            };
            var conditionExpression = '';
            Ext.Array.each(inputKeyValue.values, function (value) {
                var resultValue = '';
                Ext.Array.each(value.inputs, function (input) {
                    if (input.name == inputKeyValue.name) {
                        resultValue = input.valueExpression;
                    }
                });
                if (Ext.isEmpty(value.condition)) {
                    conditionExpression = 'return ' + resultValue;
                } else {
                    if (value.condition.conditionType == 'else') {
                        conditionExpression += 'return ' + resultValue;
                    } else {
                        conditionExpression += 'if(' + me.inputCondition(value.condition) + '){return ' + resultValue + '}';
                    }
                }
            });
            expression.expression.expression = "function expression(inputContext) {" + attributeVariables + conditionExpression + "}";
            extraParams.push(input);
        });
        return extraParams;
    }
});
