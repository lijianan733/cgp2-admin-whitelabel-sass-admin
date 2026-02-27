/**
 * Created by nan on 2018/3/14.
 */
Ext.syncRequire([ 'CGP.common.valueEx.view.DiyComponent']);
Ext.define('CGP.common.valueEx.view.ValidExpressionContainer', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.validexpressioncontainer',
    defaults: {
        allowBlank: false,
        width: 650,
        margin: '10 0 20 50 ',
        msgTarget: 'side'
    },
    layout: 'anchor',
    //编辑的弹窗
    handlerEdit: function (view, rowIndex) {
        var store = view.getStore();
        var record = store.getAt(rowIndex);
        var alertwindow = Ext.create('Ext.window.Window', {
            title: i18n.getKey('edit'),
            height: 350,
            modal: true,
            width: 400,
            layout: 'fit',
            items: {
                xtype: 'form',
                fieldDefaults: {
                    margin: '10 0 0 10 ',
                    allowBlank: false
                },
                items: view.ownerCt.commonPart,
                bbar: ['->', {
                    xtype: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function () {
                        if (this.ownerCt.ownerCt.form.isValid()) {
                            for (var i = 0; i < this.ownerCt.ownerCt.items.items.length; i++) {
                                record.set(this.ownerCt.ownerCt.items.items[i].getName(), this.ownerCt.ownerCt.items.items[i].getValue());
                            }
                            this.ownerCt.ownerCt.ownerCt.close();
                        }
                    }
                },
                    {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        iconCls: "icon_cancel",
                        handler: function () {
                            this.ownerCt.ownerCt.ownerCt.close();
                        }
                    }
                ]
            }
        });
        alertwindow.show();
        alertwindow.items.items[0].getComponent('name').setValue(record.get('name'));
        alertwindow.items.items[0].getComponent('clazz').setValue(record.get('clazz'));
        alertwindow.items.items[0].getComponent('value').setValue(record.get('value'));
    },
    //创建的弹窗
    handlerCreate: function (view, store) {
        var record = Ext.create(store.model);
        var alertwindow = Ext.create('Ext.window.Window', {
            title: i18n.getKey('create'),
            height: 350,
            modal: true,
            width: 400,
            layout: 'fit',
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'form',
                fieldDefaults: {
                    margin: '10 0 0 10 ',
                    allowBlank: false
                },
                items: view.ownerCt.ownerCt.commonPart,
                bbar: ['->', {
                    xtype: 'button',
                    text: i18n.getKey('ok'),
                    iconCls: 'icon_save',
                    handler: function () {
                        if (this.ownerCt.ownerCt.form.isValid()) {
                            var clazz = this.ownerCt.ownerCt.getComponent('value').getComponent('clazz').getValue();
                            if (clazz == 'com.qpp.cgp.value.ExpressionValueEx') {
                                var expression = this.ownerCt.ownerCt.getComponent('value').getComponent('expression').getValue();
                                if (Ext.isEmpty(expression)) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), '表达式不能为空');
                                    return;
                                }
                            }
                            for (var i = 0; i < this.ownerCt.ownerCt.items.items.length; i++) {
                                record.set(this.ownerCt.ownerCt.items.items[i].getName(), this.ownerCt.ownerCt.items.items[i].getValue());
                            }
                            store.add(record);
                            this.ownerCt.ownerCt.ownerCt.close();
                        }

                    }
                }, {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: "icon_cancel",
                    handler: function () {
                        this.ownerCt.ownerCt.ownerCt.close();
                    }
                }
                ]
            }
        });
        alertwindow.items.items[0].getComponent('value').getComponent('expression').items.items[0].storeData.removeAll();
        alertwindow.show();
    },
    showExpression: function (value) {
        var me = this;
        var items = [];
        var conditions = JSON.parse(JSON.stringify(value));
        var countItems = [];
        var count = 0;
        for (var i in conditions) {
            var item = null;
            if (i == 'clazz') {
                conditions[i] = conditions[i].substring(conditions[i].lastIndexOf('.') + 1, (conditions[i].length));
            }
            if (i == 'inputs') {
                var inputFieldSet = [];
                for (var k = 0; k < conditions[i].length; k++) {
                    var config = conditions[i][k];
                    var nextItem = [];
                    for (var j in config) {
                        if (j == 'clazz') {
                            config[j] = config[j].substring(config[j].lastIndexOf('.') + 1, (config[j].length));
                        }
                        var configItem = {
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey(j),
                            value: config[j]
                        };
                        if (j == 'value') {
                            var items2 = [];
                            for (var h in config[j]) {
                                if (h == 'clazz') {
                                    config[j][h] = config[j][h].substring(config[j][h].lastIndexOf('.') + 1, ( config[j][h].length));
                                }
                                if (h == 'expression') {
                                    var id = JSGetUUID();
                                    var value = config[j][h];
                                    var item2 = {
                                        xtype: 'displayfield',
                                        fieldLabel: i18n.getKey(h),
                                        value: '<a href="#" id=' + id + '>' + '查看表达式' + '</a>',
                                        listeners: {
                                            render: function (display) {
                                                var clickElement = document.getElementById(id);
                                                if (!Ext.isEmpty(clickElement)) {
                                                    clickElement.addEventListener('click', function () {
                                                        me.showExpression(value)
                                                    }, false);
                                                }
                                            }
                                        }
                                    };
                                } else {
                                    var item2 = {
                                        xtype: 'displayfield',
                                        fieldLabel: i18n.getKey(h),
                                        value: config[j][h]
                                    };
                                }

                                items2.push(item2)
                            }
                            configItem = {
                                xtype: 'fieldcontainer',
                                padding: false,
                                labelAlign: 'top',
                                border: false,
                                title: i18n.getKey(j),
                                fieldLabel: i18n.getKey(j),
                                defaults: {
                                    margin: '0 0 10 30'
                                },
                                items: items2
                            };
                        }
                        nextItem.push(configItem);
                    }

                    inputFieldSet.push({
                        xtype: 'fieldset',
                        labelAlign: 'top',
                        collapsed: true,
                        title: i18n.getKey('input') + (k + 1),
                        fieldLabel: i18n.getKey('input') + (k + 1),
                        collapsible: true,
                        items: nextItem,
                        defaults: {
                            margin: '0 0 10 30'
                        }
                    });

                }
                var inputContainer = {
                    xtype: 'fieldcontainer',
                    items: inputFieldSet,
                    fieldLabel: i18n.getKey('input'),
                    labelAlign: 'top'
                }
                items.push(inputContainer);
            } else {
                item = {
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey(i),
                    value: conditions[i]
                }
                items.push(item)
            }
        }
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            autoScroll: true,
            border: false,
            items: items
        });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('check') + i18n.getKey('expression'),
            height: 600,
            width: 800,
            modal: true,
            layout: 'fit',
            items: form
        }).show();
    },
    constructor: function (config) {
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
        me.commonPart = [
            {
                xtype: 'textfield',
                name: 'name',
                itemId: 'name',
                fieldLabel: i18n.getKey('name')
            },
            {
                xtype: 'textfield',
                name: 'clazz',
                itemId: 'clazz',
                hidden: true,
                fieldLabel: i18n.getKey('type'),
                value: 'com.qpp.cgp.expression.ExpressionInput'
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'value',
                itemId: 'value',
                fieldLabel: i18n.getKey('value'),
                items: [
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
                               // {clazz: 'ProductAttrValueEx', value: 'com.qpp.cgp.domain.product.value.ProductAttributeValueEx'},
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
                                        value.setDisabled(false)
                                        break;
                                    }
                                    case 'com.qpp.cgp.domain.product.value.ProductAttributeValueEx':
                                    {
                                        var attributeID = view.up().getComponent('attributeID');
                                        attributeID.show();
                                        attributeID.setDisabled(false)
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
                                        path.setDisabled(false)
                                        break;
                                    }
                                    case 'com.qpp.cgp.value.ExpressionValueEx':
                                    {
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
                                                    var isNumber = /^(\-|\+)?\d+(\.\d+)?$/;
                                                    return isNumber.test(v);
                                                },
                                                valid2Text: '输入值必须为数值！'
                                            });
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
                        vtype:'valid2',
                        fieldLabel: i18n.getKey('value')
                    },
               /*     {
                        xtype: 'combo',
                        name: 'attributeId',
                        itemId: 'attributeID',
                        editable: false,
                        store: Ext.create('CGP.product.view.managerskuattribute.store.SkuAttribute', {
                            configurableId: config.configurableId
                        }),
                        displayField: 'attributeName',
                        valueField: 'id',
                        hidden: true,
                        fieldLabel: i18n.getKey('attribute') + i18n.getKey('id')
                    },*/
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
                                    var controller = Ext.create('CGP.common.valueEx.controller.Controller');
                                    controller.showExpressValueExValue(view.storeData, view, config.configurableId);
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
                ],
                listeners: {
                    'afterrender': function (view) {
                        view.getComponent('clazz').setValue('com.qpp.cgp.value.ConstantValue')
                    }
                }
            }
        ];
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                name: 'clazz',
                xtype: 'combo',
                editable: false,
                itemId: 'clazz',
                fieldLabel: i18n.getKey('type'),
                store: Ext.create('Ext.data.Store', {
                    autoSync: true,
                    fields: [
                        {name: 'name', type: 'string'},
                        {name: 'class', type: 'string'}
                    ],
                    data: [
                        {class: 'com.qpp.cgp.expression.Expression', name: 'CustomExpression'},
                        {class: 'com.qpp.cgp.expression.RegexExpression', name: 'RegexExpression'},
                        {class: 'com.qpp.cgp.expression.RangeExpression', name: 'RangeExpression'}
                    ]
                }),
                valueField: 'class',
                displayField: 'name',
                value: 'com.qpp.cgp.expression.Expression',
                listeners: {
                    'change': function (view, newValue, oldValue) {
                        Ext.suspendLayouts();//挂起布局
                        if (this.ownerCt.getComponent('inputs').rendered) {
                            this.ownerCt.getComponent('inputs').reset();

                        }
                        this.ownerCt.remove(this.ownerCt.getComponent('min'));
                        this.ownerCt.remove(this.ownerCt.getComponent('max'));
                        this.ownerCt.remove(this.ownerCt.getComponent('regexTemplate'));
                        if (newValue == 'com.qpp.cgp.expression.RangeExpression') {
                            this.ownerCt.add([Ext.create('CGP.common.valueEx.view.DiyComponent', {
                                name: 'min',
                                itemId: 'min',
                                configurableId: me.configurableId,
                                fieldLabel: i18n.getKey('min'),
                                defaults: {
                                    allowBlank: false,
                                    width: 600,
                                    margin: '10 0 10 50 ',
                                    msgTarget: 'side'
                                }
                            }),
                                Ext.create('CGP.common.valueEx.view.DiyComponent', {
                                    name: 'max',
                                    itemId: 'max',
                                    configurableId: me.configurableId,
                                    fieldLabel: i18n.getKey('max'),
                                    defaults: {
                                        allowBlank: false,
                                        width: 600,
                                        margin: '10 0 10 50 ',
                                        msgTarget: 'side'

                                    }
                                })]);
                            this.ownerCt.getComponent('inputs').hide();
                            this.ownerCt.getComponent('expression').hide();
                            this.ownerCt.getComponent('resultType').setValue('Boolean');
                        }
                        if (newValue == 'com.qpp.cgp.expression.RegexExpression') {
                            this.ownerCt.add([Ext.create('Ext.form.field.Text', {
                                name: 'regexTemplate',
                                itemId: 'regexTemplate',
                                fieldLabel: i18n.getKey('regexTemplate')
                            })]);
                            this.ownerCt.getComponent('inputs').show();
                            this.ownerCt.getComponent('expression').show();
                            this.ownerCt.getComponent('resultType').setValue(null);

                        }
                        if (newValue == 'com.qpp.cgp.expression.Expression') {
                            this.ownerCt.getComponent('inputs').show();
                            this.ownerCt.getComponent('expression').show();
                            this.ownerCt.getComponent('resultType').setValue(null);
                        }
                        Ext.resumeLayouts();//停止布局
                        this.ownerCt.doLayout();
                    }
                }
            },

            {
                xtype: 'combo',
                itemId: 'expressionEngine',
                name: 'expressionEngine',
                editable: false,
                autoSelect: true,
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'enginName', type: 'string'}
                    ],
                    data: [
                        {enginName: 'JavaScript'}
                    ]
                }),
                displayField: 'enginName',
                valueField: 'enginName',
                value: 'JavaScript',
                fieldLabel: i18n.getKey('expressionEngine')
            },
            {
                xtype: 'gridfield',
                name: 'inputs',
                itemId: 'inputs',
                allowBlank: true,
                fieldLabel: i18n.getKey('input'),
                width: 665,
                height: 200,
                msgTarget: 'none',
                gridConfig: {
                    height: 200,
                    width: 545,
                    commonPart: me.commonPart,
                    renderTo: me.gridConfigRenderTo,
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        fields: [
                            {name: 'name', type: 'string'},
                            {name: 'clazz', type: 'string'},
                            {name: 'value', type: 'object'}
                        ],
                        data: [
                        ]
                    }),
                    columns: [
                        {
                            xtype: 'actioncolumn',
                            tdCls: 'vertical-middle',
                            itemId: 'actioncolumn',
                            width: 60,
                            sortable: false,
                            resizable: false,
                            menuDisabled: true,
                            items: [
                                {
                                    iconCls: 'icon_edit icon_margin',
                                    itemId: 'actionedit',
                                    tooltip: 'Edit',
                                    handler: function (view, rowIndex, colIndex) {
                                        me.handlerEdit(view, rowIndex);
                                    }
                                },
                                {
                                    iconCls: 'icon_remove icon_margin',
                                    itemId: 'actionremove',
                                    tooltip: 'Remove',
                                    handler: function (view, rowIndex, colIndex) {
                                        var store = view.getStore();
                                        store.removeAt(rowIndex);
                                    }
                                }
                            ]
                        },
                        {
                            text: i18n.getKey('type'),
                            dataIndex: 'clazz',
                            width: 150,
                            tdCls: 'vertical-middle',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value.substring(value.lastIndexOf('.') + 1, (value.length)) + '"';//显示的文本
                                return  value.substring(value.lastIndexOf('.') + 1, (value.length));
                            }
                        },
                        {
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                            tdCls: 'vertical-middle'

                        },
                        {
                            text: i18n.getKey('value'),
                            dataIndex: 'value',
                            tdCls: 'vertical-middle',
                            width: 200,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata) {
                                var id = JSGetUUID();
                                var expression = null;
                                var returnstr = '';
                                for (var i in value) {
                                    if (i == 'clazz') {
                                        returnstr += i + ' :  ' + value[i].substring(value[i].lastIndexOf('.') + 1, value[i].length) + '<br>';
                                    } else if (i == 'expression') {
                                        returnstr += '<a href="#" id=' + id + '>' + '查看表达式' + '</a>';
                                        expression = value[i];
                                    } else {
                                        returnstr += i + ' :  ' + value[i] + '<br>';
                                    }
                                }
                                return {
                                    xtype: 'displayfield',
                                    value: returnstr,
                                    listeners: {
                                        render: function (display) {
                                            var clickElement = document.getElementById(id);
                                            if (!Ext.isEmpty(clickElement)) {
                                                clickElement.addEventListener('click', function () {
                                                    me.showExpression(expression);
                                                }, false);
                                            }
                                        }
                                    }
                                };
                            }
                        }
                    ],
                    tbar: [
                        {
                            text: i18n.getKey('create'),
                            iconCls: 'icon_create',
                            handler: function (view) {
                                me.handlerCreate(view, this.ownerCt.ownerCt.store);
                            }
                        }
                    ]

                }},
            {
                xtype: 'textarea',
                name: 'expression',
                itemId: 'expression',
                originalValue: 'testOrigin',
                fieldLabel: i18n.getKey('expression')
            },
            {
                xtype: 'combo',
                name: 'resultType',
                itemId: 'resultType',
                fieldLabel: i18n.getKey('resultType'),
                editable: false,
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
                valueField: 'type'
            },
            {
                xtype: 'textfield',
                name: 'promptTemplate',
                allowBlank: true,
                itemId: 'promptTemplate',
                fieldLabel: i18n.getKey('promptTemplate')
            }
        ];
        me.callParent(arguments);
    }
})
