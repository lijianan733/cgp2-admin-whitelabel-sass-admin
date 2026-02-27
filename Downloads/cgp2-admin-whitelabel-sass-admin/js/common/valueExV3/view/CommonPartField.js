/**
 * Created by nan on 2018/3/19.
 */
Ext.define('CGP.common.valueExV3.view.CommonPartField', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    autoScroll: true,
    defaultValueConfig: null,
    defaults: {
        padding: '10 10 0 10',
        msgTarget: 'side',
        width: 300
    },
    layout: {
        type: 'vbox'
    },
    msgTarget: 'none',
    readOnly: false,
    isCanUseTemplate: false,//是否可以使用便捷模板生成expression
    uxTextareaContextData: null,//配置expression时可以使用的属性上下文
    expressionConfig: null,//expression字段的配置
    setExpressionValueWindowConfig: null,
    defaultValueCmp: null,
    constructor: function (config) {
        var me = this;
        me.defaultValueConfig = {//配置commonPartFieid中个组件的默认值
            clazz: 'com.qpp.cgp.value.ConstantValue',
            type: 'Number',
            clazzSetReadOnly: false,//是否只读，在设置完默认值后，界面不能再修改
            typeSetReadOnly: false
        }
        if (config && config.defaultValueConfig) {
            config.defaultValueConfig = Ext.Object.merge(me.defaultValueConfig, config.defaultValueConfig);
        }
        me.callParent([config]);
    },
    initComponent: function () {
        var me = this;
        me.defaults.readOnly = me.readOnly;
        Ext.apply(Ext.form.VTypes, {
            valid2: function (v) {
                return true
            },
            valid2Text: ''
        });
        Ext.apply(Ext.form.VTypes, {
            arrayValue: function (v) {
                var isarrayValue = /^\[.*\]$/;//校验以[开头，以]结尾的数据
                return isarrayValue.test(v);
            },
            arrayValueText: '不是array格式数据'
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
                {name: 'regexTemplate', type: 'string', defaultValue: undefined}
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
                        if (me.defaultValueConfig.clazzSetReadOnly) {
                            view.setReadOnly(me.defaultValueConfig.clazzSetReadOnly);
                            view.setFieldStyle('background-color: silver');
                        }
                    },
                    'change': function (view, newValue, oldValue) {
                        var container = view.ownerCt.items.items;
                        var path = view.up().getComponent('path');
                        var type = view.up().getComponent('type');
                        for (var i = 0; i < container.length; i++) {
                            if (Ext.Array.contains(['clazz', 'otherOperation', 'type', 'defaultValue'], container[i].getName())) {
                                continue;
                            }
                            container[i].setDisabled(true);
                            container[i].hide();
                        }
                        /* if (path.resizer) {//resizer得渲染后才有
                             path.resizer.el.hide();
                         }*/
                        switch (newValue) {
                            case 'com.qpp.cgp.value.ConstantValue': {
                                var typeValue = type.getValue();
                                if (typeValue == 'Boolean') {
                                    var booleanValue = view.up().getComponent('booleanValue');
                                    booleanValue.show();
                                    booleanValue.setDisabled(false)
                                } else if (typeValue == 'Array') {
                                    var value = view.up().getComponent('arrayValue');
                                    value.show();
                                    value.setDisabled(false)
                                } else {
                                    var value = view.up().getComponent('value');
                                    value.show();
                                    value.setDisabled(false)
                                }
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
                                /*        type.setValue('String');
                                        if (path.resizer) {
                                            path.resizer.el.show();
                                        }
                                        */
                                path.show();
                                path.setDisabled(false);
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
                allowBlank: false,
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
                        {type: 'Number'},
                        {type: 'Map'}
                    ]
                }),
                displayField: 'type',
                valueField: 'type',
                listeners: {
                    'afterrender': function (view) {
                        if (me.defaultValueConfig.type) {
                            view.setValue(me.defaultValueConfig.type);
                            var valueField = view.up().getComponent('value');
                            valueField.clearInvalid();
                        }
                        if (me.defaultValueConfig.typeSetReadOnly) {
                            view.setReadOnly(me.defaultValueConfig.typeSetReadOnly);
                            view.setFieldStyle('background-color: silver');
                        }
                    },
                    'change': function (view, newValue, oldValue) {
                        var value = view.up().getComponent('value');
                        var booleanValue = view.up().getComponent('booleanValue');
                        var clazz = view.up().getComponent('clazz').getValue();
                        var arrayValue = view.up().getComponent('arrayValue');
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
                                    booleanValue.hide();
                                    booleanValue.setDisabled(true);
                                    value.show();
                                    value.setDisabled(false);
                                    arrayValue.hide();
                                    arrayValue.setDisabled(true);
                                    break;
                                }
                                case 'Boolean' : {
                                    booleanValue.reset();
                                    booleanValue.show();
                                    booleanValue.setDisabled(false);
                                    value.hide();
                                    value.setDisabled(true);
                                    arrayValue.hide();
                                    arrayValue.setDisabled(true);
                                    break;
                                }
                                case 'Array' : {
                                    arrayValue.show();
                                    arrayValue.setDisabled(false);
                                    value.hide();
                                    value.setDisabled(true);
                                    booleanValue.hide();
                                    booleanValue.setDisabled(true);
                                    break;
                                }
                                default : {
                                    Ext.apply(Ext.form.VTypes, {
                                        valid2: function (v) {
                                            return !Ext.isEmpty(v);
                                        },
                                        valid2Text: '该输入项不予许为空'
                                    });
                                    booleanValue.hide();
                                    booleanValue.setDisabled(true);
                                    value.show();
                                    value.setDisabled(false);
                                    arrayValue.hide();
                                    arrayValue.setDisabled(true);
                                    break;
                                }
                            }
                        } else if (clazz == 'com.qpp.cgp.value.ExpressionValueEx') {
                            //设置表达式中resultType的值
                            var expression = view.up().getComponent('expression').getValue();
                            if (expression) {
                                expression.resultType = newValue;
                                view.up().getComponent('expression').setValue(expression);
                            }

                        }
                        value.validate();
                    }
                }
            },
            {
                xtype: 'textfield',
                name: 'defaultValue',
                itemId: 'defaultValue',
                allowBlank: true,
                fieldLabel: i18n.getKey('defaultValue')
            },
            {
                xtype: 'textfield',
                name: 'value',
                itemId: 'value',
                vtype: 'valid2',
                allowBlank: false,
                fieldLabel: i18n.getKey('value')
            },
            {
                xtype: 'combo',
                name: 'value',
                hidden: true,
                disabled: true,
                itemId: 'booleanValue',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'display', 'value'
                    ],
                    data: [
                        {
                            value: true,
                            display: 'true'
                        }, {
                            value: false,
                            display: 'false'
                        }
                    ]
                }),
                editable: false,
                displayField: 'display',
                valueField: 'value',
                allowBlank: false,
                fieldLabel: i18n.getKey('value')
            },
            {
                xtype: 'textfield',
                name: 'value',
                hidden: true,
                disabled: true,
                itemId: 'arrayValue',
                allowBlank: false,
                vtype: 'arrayValue',
                emptyText: '数据格式必须如:["123",123]',
                fieldLabel: i18n.getKey('value')
            },
            {
                xtype: 'textarea',
                name: 'path',
                itemId: 'path',
                hidden: true,
                width: '90%',
                grow: true,
                disabled: true,
                /*  listeners: {
                      afterrender: function (view) {
                          view;
                          console.log(view);
                          Ext.create('Ext.resizer.Resizer', {
                              el: view.inputEl,
                              handles: 'e s se',
                              pinned: false
                          });
                      }
                  },*/
                allowBlank: false,
                fieldLabel: i18n.getKey('path')
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'expression',
                itemId: 'expression',
                allowBlank: false,
                fieldLabel: i18n.getKey('expression'),
                hidden: true,
                disabled: true,
                layout: {type: 'hbox'},
                labelAlign: 'left',
                defaults: {
                    //去除原有的样式
                },
                items: [
                    {
                        xtype: 'button',
                        name: 'expression',
                        tooltip: me.readOnly ? i18n.getKey('check') : '点击进行编辑',
                        text: me.readOnly ? i18n.getKey('check') : i18n.getKey('compile'),
                        allowBlank: false,
                        width: '100%',
                        expressionStore: expressionStore,
                        getFieldLabel: function () {
                            var me = this;
                            return me.ownerCt.getFieldLabel();
                        },
                        getErrors: function () {
                            return '不允许为空'
                        },
                        getValue: function () {
                            if (Ext.isEmpty(this.expressionStore.getAt(0))) {
                                return null;

                            } else {
                                var result = this.expressionStore.getAt(0).getData();//去除多余数据
                                for (var i in result) {
                                    if (Ext.isEmpty(result[i])) {
                                        delete result[i];
                                    }
                                }
                                return result;
                            }
                        },
                        isValid: function () {
                            var me = this;
                            if (me.disabled) {//禁用时不校验
                                return true;
                            } else {
                                return me.getValue() ? true : false;

                            }
                        },
                        getName: function () {
                            return this.name;
                        },
                        setValue: function (value) {
                            this.expressionStore.removeAll();
                            if (Ext.isEmpty(value)) {
                            } else {
                                var record = new this.expressionStore.model(value);
                                this.expressionStore.add(record);
                            }
                        },
                        handler: function (btn) {
                            var defaultResultType = btn.ownerCt.ownerCt.getComponent('type').getValue();
                            var win = Ext.create('CGP.common.valueExV3.view.SetExpressionValueWindow', Ext.Object.merge({
                                expressionValueStore: btn.expressionStore,//记录expressionValue的store
                                configurableId: null,//旧的配置现在暂时没用到,
                                readOnly: me.readOnly,
                                isCanUseTemplate: me.isCanUseTemplate,//是否可以使用快捷的模板来创建function表达式，
                                uxTextareaContextData: me.uxTextareaContextData,//表达式中使用的上下文
                                defaultResultType: defaultResultType,//expression中的结果类型
                                expressionConfig: me.expressionConfig//expression中expression字段的配置
                            }, me.setExpressionValueWindowConfig));
                            win.show();
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
