/**
 * Created by nan on 2019/10/22.
 *属性约束中配置信息fieldSet组件
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.OnlyCurrentAttributeConfigFieldSet', {
    extend: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.DiyFieldSet',
    alias: 'widget.configfieldsetonlycurrentattribute',
    skuAttributeId: null,
    initComponent: function () {
        var me = this;
        Ext.apply(Ext.form.field.VTypes, {
            minAndMax: function (val, field) {
                if (field.itemId == 'min') {
                    var max = field.ownerCt.getComponent('max');
                    if (Ext.isEmpty(max.getValue())) {
                        return true;
                    }
                    if (val < max.getValue()) {
                        max.clearInvalid()
                        return true;
                    } else {
                        return false
                    }

                } else {
                    var min = field.ownerCt.getComponent('min');
                    if (Ext.isEmpty(min.getValue())) {
                        return true;
                    }
                    if (val > min.getValue()) {
                        min.clearInvalid()
                        return true;
                    } else {
                        return false
                    }
                }
            },
            minAndMaxText: '请输入正确数值'
        });
        me.items = [
            {
                xtype: 'form',
                border: false,
                items: [
                    {
                        fieldLabel: i18n.getKey('description'),
                        xtype: 'textfield',
                        name: 'description',
                        itemId: 'description',
                        allowBlank: false,
                        width: 400
                    },
                    {
                        xtype: 'fieldcontainer',
                        itemId: 'valueField',
                        layout: {
                            type: 'hbox',
                            align: 'middle'
                        },
                        items: [
                            {
                                xtype: 'combo',
                                displayField: 'display',
                                valueField: 'value',
                                editable: false,
                                name: 'operator',
                                fieldLabel: i18n.getKey('该属性值范围'),
                                matchFieldWidth: false,
                                value: '==',
                                width: 200,
                                allowBlank: false,
                                labelWidth: 100,
                                margin: '0 10 0 0',
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
                                        },
                                        {
                                            display: '[min,max)',
                                            value: '[min,max)',
                                            title: 'min<=属性值<max'
                                        },
                                        {
                                            display: '(min,max)',
                                            value: '(min,max)',
                                            title: 'min<属性值<max'
                                        },
                                        {
                                            display: '(min,max]',
                                            value: '(min,max]',
                                            title: 'min<属性值<=max'
                                        }
                                    ]
                                }),
                                listeners: {
                                    change: function (field, newValue, oldValue) {
                                        var simpleInput = field.ownerCt.getComponent('simpleInput');
                                        var complexInput = field.ownerCt.getComponent('complexInput');
                                        if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], newValue)) {
                                            simpleInput.hide();
                                            simpleInput.setDisabled(true);
                                            complexInput.show();
                                            complexInput.setDisabled(false);
                                        } else {
                                            complexInput.hide();
                                            complexInput.setDisabled(true);
                                            simpleInput.show();
                                            simpleInput.setDisabled(false);
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'numberfield',
                                itemId: 'simpleInput',
                                allowBlank: false,
                                name: 'minValue'
                            },
                            {
                                xtype: 'fieldcontainer',
                                hidden: true,
                                disabled: true,
                                itemId: 'complexInput',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        width: 100,
                                        labelWidth: 30,
                                        margin: '0 5 0 0',
                                        allowBlank: false,
                                        name: 'minValue',
                                        vtype: 'minAndMax',
                                        itemId: 'min',
                                        fieldLabel: i18n.getKey('min')
                                    },
                                    {
                                        xtype: 'numberfield',
                                        width: 100,
                                        labelWidth: 30,
                                        allowBlank: false,
                                        name: 'maxValue',
                                        vtype: 'minAndMax',
                                        itemId: 'max',
                                        fieldLabel: i18n.getKey('max')
                                    }
                                ]
                            }
                        ]
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
        console.log(result);
        result.clazz = 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousFixValueConstraint';
        result.executeCondition = null;
        result.skuAttribute = me.skuAttribute;
        result.skuAttributeId = me.skuAttributeId;
        return result;
    },
    setValue: function (data) {
        if (data) {
            var me = this;
            var fields = me.items.items[0].form.getFields().items;
            for (var i = 0; i < fields.length; i++) {
                fields[i].setValue(data[fields[i].getName()]);
            }
        }
    }
})
