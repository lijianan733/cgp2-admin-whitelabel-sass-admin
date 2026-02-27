Ext.define('CGP.product.view.productattributeconstraint.view.customcomp.CustomValueFieldSet', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.customvaluefieldset',
    initComponent: function () {
        var me = this;
        Ext.apply(Ext.form.VTypes, {
            valid2: function (v) {
                var isnumber =  /^(\-|\+)?\d+(\.\d+)?$/;
                return isnumber.test(v);
            },
            valid2Text: '输入值必须为数值！'
        });
        var expressionStore = Ext.create('Ext.data.Store', {
            autoSync: true,
            id: JSGetUUID(),//唯一标识
            fields: [
                {name: 'clazz', type: 'string'},
                {name: 'expression', type: 'string'},
                {name: 'expressionEngine', type: 'string'},
                {name: 'inputs', type: 'array'},
                {name: 'resultType', type: 'string'},
                {name: 'promptTemplate', type: 'string'},
                {name: 'min', type: 'object', defaultValue: undefined},
                {name: 'max', type: 'object', defaultValue: undefined},
                {name: 'regexTemplate', type: 'string', defaultValue: undefined}
            ],
            data: [
            ]
        });
        me.items = [
            {
                xtype: 'combo',
                editable: false,
                name: 'clazz',
                itemId: 'clazz',
                fieldLabel: i18n.getKey('type'),
                value: 'default',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'clazz', type: 'string'},
                        {name: 'value', type: 'string'}
                    ],
                    data: [
                        {clazz: 'ConstantValue', value: 'com.qpp.cgp.value.ConstantValue'},
                        {clazz: 'ProductAttrValueEx', value: 'com.qpp.cgp.domain.product.value.ProductAttributeValueEx'},
                        {clazz: 'UserAssignValue', value: 'com.qpp.cgp.value.UserAssignValue'},
                        {clazz: 'JsonPathValue', value: 'com.qpp.cgp.value.JsonPathValue'},
                        {clazz: 'ExpressionValueEx', value: 'com.qpp.cgp.value.ExpressionValueEx'}
                    ]
                }),
                displayField: 'clazz',
                valueField: 'value',
                listeners: {
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
                            case 'com.qpp.cgp.value.ConstantValue':
                            {
                                var value = view.up().getComponent('value');
                                value.show();
                                value.setDisabled(false);
                                break;
                            }
                            case 'com.qpp.cgp.domain.product.value.ProductAttributeValueEx':
                            {
                                var attributeID = view.up().getComponent('attributeID');
                                attributeID.show();
                                attributeID.setDisabled(false);
                                break;
                            }
                            case 'ClassSelector':
                            {
                                break;
                            }
                            case 'com.qpp.cgp.value.UserAssignValue':
                            {
                                /* var assginValue = view.up().getComponent('assginValue');
                                 assginValue.show();
                                 assginValue.setDisabled(false)*/
                                break;
                            }
                            case 'com.qpp.cgp.value.JsonPathValue':
                            {
                                /* var calculatedValue = view.up().getComponent('calculatedValue');
                                 calculatedValue.show();
                                 calculatedValue.setDisabled(false);*/
                                var path = view.up().getComponent('path');
                                path.show();
                                path.setDisabled(false);
                                break;
                            }
                            case 'com.qpp.cgp.value.ExpressionValueEx':
                            {
                                var expression = view.up().getComponent('expression');
                                expression.show();
                                expression.setDisabled(false);
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
                value: 'Number',
                defaultValue: 'Number',
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
                    'change': function (view, newValue, oldValue) {
                        var value = view.up().getComponent('value');
                        var clazz = view.up().getComponent('clazz').getValue();
                        if(clazz=='com.qpp.cgp.value.ConstantValue') {
                            switch (newValue) {
                                case 'Number' :
                                {
                                    Ext.apply(Ext.form.VTypes, {
                                        valid2: function (v) {
                                            var isnumber = /^(\-|\+)?\d+(\.\d+)?$/;
                                            return isnumber.test(v);
                                        },
                                        valid2Text: '输入值必须为数值！'
                                    });
                                    //value.reset();
                                    break;
                                }
                                case 'Boolean' :
                                {
                                    Ext.apply(Ext.form.VTypes, {
                                        valid2: function (v) {
                                            return v == 'true' || v == 'false'
                                        },
                                        valid2Text: '输入值必须为true或false'
                                    });
                                    //value.reset();
                                    break;
                                }
                                default :
                                {
                                    Ext.apply(Ext.form.VTypes, {
                                        valid2: function (v) {
                                            return !Ext.isEmpty(v);
                                        },
                                        valid2Text: '该输入项不予许为空'
                                    });
                                    //value.reset();
                                    break;
                                }
                            }
                            value.validate();
                        }
                    }
                }
            },
            {
                xtype: 'textfield',
                name: 'value',
                itemId: 'value',
                vtype:'valid2',
                fieldLabel: i18n.getKey('value')
            },
            {
                xtype: 'combo',
                name: 'attributeId',
                itemId: 'attributeID',
                editable: false,
                store: Ext.create('CGP.product.view.managerskuattribute.store.SkuAttribute', {
                    configurableId: me.configurableId
                }),
                displayField: 'attributeName',
                valueField: 'id',
                hidden: true,
                fieldLabel: i18n.getKey('attribute') + i18n.getKey('id')
            },
            {
                xtype: 'textfield',
                name: 'path',
                itemId: 'path',
                hidden: true,
                fieldLabel: i18n.getKey('path')
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'expression',
                itemId: 'expression',
                hidden: true,
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
                                return this.storeData.getAt(0).getData();
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
                            var controller = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.controller.Controller');
                            controller.showExpressValueExValue(view.storeData, view, me.configurableId);
                        }
                    }
                ],
                getValue: function () {
                    return this.items.items[0].getValue();
                },
                setValue: function (value) {
                    this.items.items[0].setValue(value);
                },
                fieldLabel: i18n.getKey('expression')
            }
        ];
        me.listeners = {
            'afterrender': function (view) {
                view.getComponent('clazz').setValue('com.qpp.cgp.value.ConstantValue')
            }
        };
        me.callParent(arguments);
    }
});
