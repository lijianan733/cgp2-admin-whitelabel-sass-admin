/**
 * Created by dick
 * 映射属性规则有多属性表达式
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.view.ConditionFieldContainer',
])
Ext.define('CGP.product.view.pricingStrategyv2.view.conditionV2.ConditionFieldSet', {
    extend: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.DiyFieldSet',
    alias: 'widget.pricing_condition_fieldset',
    productId: null,
    contextAttributeStore: null,//自己按照指定格式生成的上下文store
    checkOnly: false,//是否只查看
    haveElse: true,
    inputModel: 'MULTI',//MULTI代表有复杂输入，SIMPLE代表仅有简单输入
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.pricingStrategyv2.controller.PricingStrategy');
        var contextData = controller.buildContextData(parseInt(JSGetQueryString('productId')));
        //条件组件使用的store
        // var contextAttributeStore = Ext.create('CGP.product.view.pricingStrategyv2.store.Attribute', {
        //     storeId: 'contextAttributeStore',
        //     productId: productId
        // });

        // 条件组件使用的store

        var simpleStore = Ext.create('Ext.data.Store', {
            storeId: 'simpleStore',
            fields: [
                {
                    name: 'key',
                    type: 'string'
                },
                {
                    name: 'type',
                    type: 'string'
                }, {
                    name: 'valueType',
                    type: 'string'
                }, {
                    name: 'selectType',
                    type: 'string'
                }, {
                    name: 'attrOptions',
                    type: 'array'
                }, {
                    name: 'required',
                    type: 'string'
                }, {
                    name: 'attributeInfo',
                    type: 'object'
                }, {
                    name: 'path',
                    type: 'string'
                },
                {
                    name: 'displayName',
                    type: 'string'
                },
                {
                    name: 'displayNameType',
                    type: 'string',
                    convert: function (value, record) {
                        var displayName = record.get('displayName');
                        var valueType = record.get('valueType');
                        return displayName + '<' + valueType + '>';
                    }
                }
            ],
            data: Ext.clone(contextData)
        });
        contextData.push({
            key: 'qty',
            type: 'skuAttribute',
            valueType: 'Number',
            selectType: 'NON',
            attrOptions: [],
            required: true,
            displayName: 'Qty',
            path: 'args',
            attributeInfo: {}
        });
        var contextAttributeStore = Ext.create('Ext.data.Store', {
            storeId: 'contextAttributeStore',
            fields: [
                {
                    name: 'key',
                    type: 'string'
                },
                {
                    name: 'type',
                    type: 'string'
                }, {
                    name: 'valueType',
                    type: 'string'
                }, {
                    name: 'selectType',
                    type: 'string'
                }, {
                    name: 'attrOptions',
                    type: 'array'
                }, {
                    name: 'required',
                    type: 'string'
                }, {
                    name: 'attributeInfo',
                    type: 'object'
                }, {
                    name: 'path',
                    type: 'string'
                },
                {
                    name: 'displayName',
                    type: 'string'
                },
                {
                    name: 'displayNameType',
                    type: 'string',
                    convert: function (value, record) {
                        var displayName = record.get('displayName');
                        var valueType = record.get('valueType');
                        return displayName + '<' + valueType + '>';
                    }
                }
            ],
            data: contextData
        });

        var qtyStore = Ext.create('Ext.data.Store', {
            storeId: 'contextAttributeStore',
            fields: [
                {
                    name: 'key',
                    type: 'string'
                },
                {
                    name: 'type',
                    type: 'string'
                }, {
                    name: 'valueType',
                    type: 'string'
                }, {
                    name: 'selectType',
                    type: 'string'
                }, {
                    name: 'attrOptions',
                    type: 'array'
                }, {
                    name: 'required',
                    type: 'string'
                }, {
                    name: 'attributeInfo',
                    type: 'object'
                }, {
                    name: 'path',
                    type: 'string'
                },
                {
                    name: 'displayName',
                    type: 'string'
                },
                {
                    name: 'displayNameType',
                    type: 'string',
                    convert: function (value, record) {
                        var displayName = record.get('displayName');
                        var valueType = record.get('valueType');
                        return displayName + '<' + valueType + '>';
                    }
                }
            ],
            data: [{
                key: 'qty',
                type: 'skuAttribute',
                valueType: 'Number',
                selectType: 'NON',
                attrOptions: [],
                required: true,
                displayName: 'Qty',
                path: 'args',
                attributeInfo: {}
            }]
        });
        me.items = [
            {
                xtype: 'conditionfieldcontainer',
                width: '100%',
                itemId: 'conditionFieldContainer',
                hideLabel: true,
                productId: me.productId,
                contentAttributeStore: contextAttributeStore,
                extraParams: null,
                valueType: 'expression',//valueEx,和expression两种类型的返回值
                contentData: null,//标准格式的上下文数据
                rawData: null,
                contentTemplate: null,
                functionTemplate: null,
                leftValue: 'ProductAttributeValue',
                conditionPanelItems: {
                    simpleConditionGrid: {
                        contentAttributeStore: simpleStore
                    },
                    qtyConditionGridPanel: {
                        hidden: false,
                        contentAttributeStore: qtyStore
                    }
                },
                customConditionPanelConfig: {
                    height: 250,
                },
                //这里重写getBaseValueResult方法,返回带[0]的表达式
                getExpression: function () {
                    var me = this;
                    console.log('1111111111111111');
                    var conditionDTO = me.getValue();
                    //空的条件
                    if (Ext.isEmpty(conditionDTO)) {
                        return null;
                    } else {
                        me.controller.getBaseValueResult = function (baseValue, valueType) {
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
                                var record = controller.contentAttributeStore.findRecord('key', baseValue.attributeId);
                                var path = record.get('path');
                                var key = baseValue.attributeId;
                                resultValue = path + "['" + key + "']";
                                if (valueType) {
                                    resultValue = controller.parseFormat(valueType, resultValue);
                                }
                                //单选的类型才需要加特殊处理
                                if (record.raw.selectType == "SINGLE") {
                                    resultValue += '[0]';
                                }
                            } else if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.VariableValue') {
                                var record = controller.contentAttributeStore.findRecord('key', baseValue.name);
                                if (Ext.isEmpty(record)) {
                                    resultValue = baseValue.value;
                                } else {
                                    var path = record.get('path');
                                    var key = baseValue.name;
                                    resultValue = path + "['" + key + "']";
                                    if (valueType) {
                                        resultValue = controller.parseFormat(valueType, resultValue);
                                    }
                                }
                            }
                            return resultValue;
                        };
                        return me.controller.conditionDTOToDomain(me.valueType, conditionDTO);
                    }
                },
            }
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this, data = me.data || {};
        console.log(me.id);
        for (var item of me.items.items) {
            data = item.getValue() || {
                "clazz": "com.qpp.cgp.domain.executecondition.InputCondition",
                "conditionType": "normal",
                "operation": {
                    "clazz": "com.qpp.cgp.domain.executecondition.operation.LogicalOperation",
                    "operations": [],
                    "operator": "AND"
                },
                "type": "normal"
            };
            data.expression = item.getExpression();
        }
        return data;

    },
    setValue: function (data) {
        var me = this;
        me.data = data;
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            return false;
        }
        for (var item of me.items.items) {
            item.setValue(data);
        }
    },
    isValid: function () {
        var me = this;
        var valid = true;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.hidden != true) {
                if (item.isValid && item.isValid() == false) {
                    valid = false;
                }
            }
        }
        return valid;
    }
})
