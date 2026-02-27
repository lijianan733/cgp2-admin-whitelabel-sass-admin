/**
 * Created by nan on 2018/3/19.
 */
Ext.define('CGP.common.valueExV2.view.CommonPartField', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    defaultValueConfig: {
        clazz: 'com.qpp.cgp.value.ConstantValue',
        type: 'String',

    },//配置commonPartFieid中个组件的默认值
    defaults: {
        padding: '10 10 0 10',
        msgTarget: 'side',
        allowBlank: false
    },
    isCanUseTemplate: false,//在配置表达式时是否可以使用便捷模板
    constructor: function (config) {
        var me = this;
        if (config && config.defaultValueConfig) {
            config.defaultValueConfig = Ext.Object.merge(me.defaultValueConfig, config.defaultValueConfig);
        }
        me.callParent([config])
    },
    initComponent: function () {
        var me = this;
        Ext.apply(Ext.form.VTypes, {
            valid2: function (v) {
                /*  var isNumber = /^(\-|\+)?\d+(\.\d+)?$/;
                 return isNumber.test(v);*/
                return true
            },
            valid2Text: ''
        });
        var expressionStore = Ext.create('Ext.data.Store', {
            autoSync: true,
            id: JSGetUUID(),//唯一标识
            fields: [
                {name: 'clazz', type: 'string'},
                {name: 'expression', type: 'string'},
                {name: 'expressionEngine', type: 'string', defaultValue: 'JavaScript'},
                {name: 'inputs', type: 'array'},
                {name: 'resultType', type: 'string'},
                {name: 'promptTemplate', type: 'string'},
                {name: 'min', type: 'object', defaultValue: undefined},
                {name: 'max', type: 'object', defaultValue: undefined},
                {name: 'regexTemplate', type: 'object', defaultValue: undefined}
            ],
            data: []
        });
        me.items = [
            {
                xtype: 'combo',
                editable: false,
                name: 'clazz',
                itemId: 'clazz',
                fieldLabel: i18n.getKey('type'),
                value: 'com.qpp.cgp.value.ConstantValue',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'clazz', type: 'string'},
                        {name: 'value', type: 'string'}
                    ],
                    data: [
                        {clazz: 'ConstantValue', value: 'com.qpp.cgp.value.ConstantValue'},
                        /*
                         {clazz: 'ProductAttrValueEx', value: 'com.qpp.cgp.domain.product.value.ProductAttributeValueEx'},

                         {clazz: 'UserAssignValue', value: 'com.qpp.cgp.value.UserAssignValue'},
                         */
                        {clazz: 'JsonPathValue', value: 'com.qpp.cgp.value.JsonPathValue'},
                        {clazz: 'ExpressionValueEx', value: 'com.qpp.cgp.value.ExpressionValueEx'}
                    ]
                }),
                displayField: 'clazz',
                valueField: 'value',
                listeners: {
                    'afterrender': function (view) {
                        if (me.defaultValueConfig.clazz) {
                            view.setValue(me.defaultValueConfig.clazz);
                        }
                    },
                    'change': function (view, newValue, oldValue) {
                        var container = view.ownerCt.items.items;
                        for (var i = 0; i < container.length; i++) {
                            if (Ext.Array.contains(['clazz', 'otherOperation', 'type'], container[i].getName())) {
                                continue;
                            }
                            container[i].setDisabled(true);
                            container[i].hide();
                        }
                        switch (newValue) {
                            case 'com.qpp.cgp.value.ConstantValue': {
                                var value = view.up().getComponent('value');
                                value.show();
                                value.setDisabled(false)
                                break;
                            }
                            case 'com.qpp.cgp.domain.product.value.ProductAttributeValueEx': {
                                var attributeID = view.up().getComponent('attributeID');
                                attributeID.show();
                                attributeID.setDisabled(false)
                                break;
                            }
                            case 'ClassSelector': {
                                break;
                            }
                            case 'com.qpp.cgp.value.UserAssignValue': {
                                break;
                            }
                            case 'com.qpp.cgp.value.JsonPathValue': {
                                var path = view.up().getComponent('path');
                                path.show();
                                path.setDisabled(false)
                                break;
                            }
                            case 'com.qpp.cgp.value.ExpressionValueEx': {
                                var expression = view.up().getComponent('expression');
                                expression.show();
                                expression.setDisabled(false)
                                break;
                            }
                        }
                    }
                }
            },
            {
                xtype: 'combo',
                editable: false,
                name: 'type',
                itemId: 'type',
                value: 'String',
                fieldLabel: i18n.getKey('valueType'),
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'type', type: 'string'}
                    ],
                    data: [
                        {type: 'Boolean'},
                        {type: 'String'},
                        {type: 'Array'},
                        {type: 'Date'},
                        {type: 'Number'}
                    ]
                }),
                displayField: 'type',
                valueField: 'type',
                listeners: {
                    'afterrender': function (view) {
                        if (me.defaultValueConfig.type) {
                            view.setValue(me.defaultValueConfig.type);
                        }
                    },
                    'change': function (view, newValue, oldValue) {
                        var value = view.up().getComponent('value');
                        var clazz = view.up().getComponent('clazz').getValue();
                        if (clazz == 'com.qpp.cgp.value.ConstantValue') {
                            switch (newValue) {
                                case 'Number' : {
                                    Ext.apply(Ext.form.VTypes, {
                                        valid2: function (v) {
                                            var isNumber = /^(\-|\+)?\d+(\.\d+)?$/;
                                            return isNumber.test(v);
                                        },
                                        valid2Text: '输入值必须为数值！'
                                    });
                                    break;
                                }
                                case 'Boolean' : {
                                    Ext.apply(Ext.form.VTypes, {
                                        valid2: function (v) {
                                            return v == 'true' || v == 'false'
                                        },
                                        valid2Text: '输入值必须为true或false'
                                    });
                                    break;
                                }
                                default : {
                                    Ext.apply(Ext.form.VTypes, {
                                        valid2: function (v) {
                                            return !Ext.isEmpty(v);
                                        },
                                        valid2Text: '该输入项不予许为空'
                                    });
                                    break;
                                }
                            }
                        }
                        value.validate();
                    }
                }
            },
            {
                xtype: 'textfield',
                name: 'value',
                itemId: 'value',
                vtype: 'valid2',
                fieldLabel: i18n.getKey('value')
            },
            {
                xtype: 'textfield',
                name: 'path',
                itemId: 'path',
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('path')
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'expression',
                itemId: 'expression',
                fieldLabel: i18n.getKey('expression'),
                hidden: true,
                disabled: true,
                layout: {xtype: 'hbox'},
                labelAlign: 'left',
                defaults: {
                    //去除原有的样式
                },
                items: [
                    {
                        xtype: 'button',
                        text: '编辑',
                        name: 'expression',
                        storeData: expressionStore,
                        getValue: function () {
                            if (Ext.isEmpty(this.storeData.getAt(0))) {
                                return null;

                            } else {
                                var result = this.storeData.getAt(0).getData();//去除多余数据
                                for (var i in result) {
                                    if (Ext.isEmpty(result[i])) {
                                        delete result[i];
                                    }
                                }
                                return result;
                            }
                        },
                        getName: function () {
                            return this.name;
                        },
                        setValue: function (value) {
                            var record = new this.storeData.model(value);
                            this.storeData.removeAll();
                            this.storeData.add(record);
                        },
                        handler: function (view) {
                            var controller = Ext.create('CGP.common.valueExV2.controller.Controller');
                            controller.showExpressValueExValue(view.storeData, view, null, me.isCanUseTemplate);

                        }
                    }
                ],
                getValue: function () {
                    return this.items.items[0].getValue();
                },
                setValue: function (value) {
                    this.items.items[0].setValue(value);
                }
            }
        ];
        me.callParent(arguments);
    }
})
