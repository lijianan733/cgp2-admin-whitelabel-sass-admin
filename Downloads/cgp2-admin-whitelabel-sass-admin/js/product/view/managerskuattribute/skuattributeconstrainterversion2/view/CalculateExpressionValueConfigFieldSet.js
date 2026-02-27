/**
 * Created by nan on 2019/10/22.
 * 通用的前置条件组件，有产品的profile,和产品的属性值判断
 * 可选的属性过滤掉非连续值的属性,过滤掉自己这个属性，现在又不需要过滤
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.CalculateExpressionValueConfigFieldSet', {
    extend: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.DiyFieldSet',
    alias: 'widget.calculateexpressionvalueconfigfieldset',
    createOrEdit: 'create',//新建时就有同时创建作用于其他属性的约束的功能
    productAttributeStore: null,
    productId: null,
    skuAttributeId: null,//配置约束的skuAttribute
    initComponent: function () {
        var me = this;
        var productAttributeStore = me.productAttributeStore = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [
                {
                    name: 'id',
                    type: 'int'
                },
                'displayName',
                'inputType',
                {
                    name: 'showName',
                    convert: function (value, record) {
                       
                        return record.data.displayName + '(' + record.getId() + ')'
                    }
                }
            ],
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/products/configurable/' + me.productId + '/skuAttributes',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            listeners: {
                load: function (store, record) {//过滤掉非连续值的属性,过滤掉自己这个属性
                    store.filterBy(function (item) {
                        /*if (Ext.Array.contains(['DropList', 'CheckBox', 'RadioButtons', 'Color'], item.raw.attribute.inputType)) {//过滤掉离散型属性
                            return false;
                        }*/
                        if (item.raw.id == me.skuAttributeId) {//过滤掉自己这个属性
                            return false;
                        }
                        return true;
                    })
                }
            }
        });
        me.items = [
            {
                xtype: 'form',
                border: false,
                defaults: {
                    width: 400
                },
                items: [
                    {
                        fieldLabel: i18n.getKey('description'),
                        xtype: 'textfield',
                        allowBlank: false,
                        name: 'description'
                    },
                    {
                        xtype: 'multicombobox',
                        itemId: 'inSkuAttributeIds',
                        editable: false,
                        multiSelect: true,
                        matchFieldWidth: true,
                        allowBlank: false,
                        fieldLabel: i18n.getKey('参数属性'),
                        name: 'inSkuAttributeIds',
                        store: productAttributeStore,
                        displayField: 'showName',
                        valueField: 'id'
                    },
                    {
                        xtype: 'combo',
                        displayField: 'display',
                        valueField: 'value',
                        editable: false,
                        allowBlank: false,
                        fieldLabel: i18n.getKey('该属性的值范围'),
                        matchFieldWidth: false,
                        value: '==',
                        name: 'operator',
                        listConfig: {
                            itemTpl: Ext.create('Ext.XTemplate',
                                '<div title="{title}" ext:qtitle="title" ext:qtip="{display} : {display} tip" >{display}</div>'),
                        },
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'display',
                                'value',
                                'title'
                            ],
                            data: [
                                {
                                    display: '=',
                                    value: '=='
                                },
                                {
                                    display: '<',
                                    value: '<'
                                },
                                {
                                    display: '>',
                                    value: '>'
                                },
                                {
                                    display: '<=',
                                    value: '<='
                                },
                                {
                                    display: '>=',
                                    value: '>='
                                },
                                {
                                    display: '!=',
                                    value: '!='
                                },
                                {
                                    display: '[min,max]',
                                    value: '[min,max]',
                                    title: 'min<=属性值<=max'
                                }, {
                                    display: '[min,max)',
                                    value: '[min,max)',
                                    title: 'min<=属性值<max'
                                }, {
                                    display: '(min,max)',
                                    value: '(min,max)',
                                    title: 'min<属性值<max'
                                }, {
                                    display: '(min,max]',
                                    value: '(min,max]',
                                    title: 'min<属性值<=max'
                                }
                            ]
                        }),
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var minExpression = field.ownerCt.getComponent('minExpression');
                                var maxExpression = field.ownerCt.getComponent('maxExpression');
                                if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], newValue)) {
                                    maxExpression.show();
                                    minExpression.setFieldLabel('最小值计算公式')
                                    maxExpression.setDisabled(false);

                                } else {
                                    maxExpression.hide();
                                    minExpression.setFieldLabel('计算公式')
                                    maxExpression.setDisabled(true);

                                }
                            }
                        }
                    },
                    {
                        xtype: 'textarea',
                        allowBlank: false,
                        name: 'minExpression',
                        tipInfo: "属性取值:profiles['profileId']['skuAttributeId']['propertyName']<br> 示例：profiles['123']['124']['Value']<br>" +
                            "属性取option的值: profiles['profileId']['skuAttributeId']['Options'][0]['value']<br>  示例：profiles['123']['125']['Options'][0]['value']",
                        itemId: 'minExpression',
                        fieldLabel: i18n.getKey('计算公式')
                    },
                    {
                        xtype: 'textarea',
                        allowBlank: false,
                        hidden: true,
                        disabled: true,
                        name: 'maxExpression',
                        itemId: 'maxExpression',
                        fieldLabel: i18n.getKey('最大值计算公式')
                    },
                    {
                        fieldLabel: i18n.getKey('错误提示信息模板'),
                        xtype: 'textfield',
                        width: 400,
                        name: 'promptTemplate',
                        allowBlank: false
                    }
                ]
            }
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var result = me.items.items[0].getValues();
        result.clazz = 'com.qpp.cgp.domain.attributeconstraint.single.CalculateExpressionValueConstraint';
        result.executeCondition = null;
        result.skuAttributeId = me.skuAttributeId;
        result.skuAttribute = me.skuAttribute;
        var inSkuAttributeIds = [];
        var inSkuAttributes = [];
        for (var i = 0; i < result.inSkuAttributeIds.length; i++) {
            var skuAttribute = me.productAttributeStore.findRecord('id', result.inSkuAttributeIds[i]).raw;
            inSkuAttributes.push(skuAttribute);
        }
        result.inSkuAttributes = inSkuAttributes;
        console.log(result);
        return result;
    },
    setValue: function (data) {
        if (Ext.Object.isEmpty(data)) {
            return;
        } else {
            var me = this;
            var fields = me.items.items[0].form.getFields().items;
            console.log(data)
            for (var i = 0; i < fields.length; i++) {
                var value = data[fields[i].getName()];
                if (!Ext.isEmpty(value)) {
                    fields[i].setValue(value);
                }
            }
        }
    }
})
