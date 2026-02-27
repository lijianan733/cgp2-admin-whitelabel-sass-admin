/**
 * Created by nan on 2018/3/14.
 */
Ext.syncRequire(['CGP.common.valueExV3.view.ValidExpressionContainer']);
Ext.define('CGP.common.valueExV3.view.EditContinuousValueConstraintForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    isValid: function () {
        this.msgPanel.hide();
        var errors = {};
        var isValid = true;
        this.items.items.forEach(function (f) {
            if (!f.isValid()) {
                isValid = false;
                if (Ext.isObject(f.getErrors())) {
                    Ext.Object.merge(errors, f.getErrors());
                } else {
                    errors[f.getFieldLabel()] = f.getErrors();
                }
            }
        });
        isValid ? null : this.showErrors(errors);
        return isValid;
    },
    getFormValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.xtype == 'gridfield') {
                result[item.getName()] = item.getSubmitValue();
            } else {
                result[item.getName()] = item.getValue();
            }
        }
        return result;
    },
    setFormValue: function (data) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.xtype == 'gridfield') {
                console.log(item);
                item.setSubmitValue(data[item.getName()]);
            } else {
                item.setValue(data[item.getName()]);
            }
        }
    },
    tbar: [
        {
            xtype: 'button',
            iconCls: 'icon_save',
            text: i18n.getKey('save'),
            handler: function (btn) {
                var controller = Ext.create('CGP.common.valueExV3.controller.Controller');
                var form = btn.ownerCt.ownerCt;
                if (form.isValid()) {
                    var data = form.getFormValue();
                    console.log(data);
                    var thisForm = this.ownerCt.ownerCt;
                    var groupGridPanel = thisForm.currentPanel;
                    var ThisPanel = this.ownerCt.ownerCt.editPanel;//当前编辑panel
                    controller.getDataToGridStore(data, groupGridPanel, thisForm.createOrEdit, thisForm.tab, thisForm.record);
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'), function () {
                        thisForm.tab.setActiveTab(groupGridPanel);
                        ThisPanel.close();
                    })

                }
            }
        }
    ],
    width: '100%',
    height: '100%',
    autoScroll: true,
    defaults: {
        allowBlank: false,
        margin: '10 0 10 50',
        msgTarget: 'side'
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'combo',
                readOnly: true,
                name: 'clazz',
                value: me.inputTypeClazz,
                fieldLabel: i18n.getKey('type'),
                width: 700,
                store: Ext.create('Ext.data.Store', {
                    autoSync: true,
                    fields: [
                        {name: 'name', type: 'string'},
                        {name: 'class', type: 'string'}
                    ],
                    data: [
                        {
                            class: 'com.qpp.cgp.value.constraint.ContinuousValueConstraint',
                            name: 'ContinuousValueConstraint'
                        },
                        {
                            class: 'com.qpp.cgp.value.constraint.DiscreteValueConstraint',
                            name: 'DiscreteValueConstraint'
                        }
                    ]
                }),
                hidden: true,
                valueField: 'class',
                displayField: 'name'
            },
            {
                xtype: 'textfield',
                name: 'description',
                itemId: 'description',
                fieldLabel: i18n.getKey('description'),
                width: 700,
                allowBlank: true
            },
            {
                xtype: 'gridfield',
                name: 'conditions',
                itemId: 'conditions',
                msgTarget: 'none',
                allowBlank: true,
                fieldLabel: i18n.getKey('condition'),
                width: 800,
                height: 200,
                gridConfig: {
                    viewConfig: {
                        enableTextSelection: true
                    },
                    height: 200,
                    width: 800,
                    renderTo: JSGetUUID(),
                    allowBlank: true,
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        fields: [
                            {name: 'clazz', type: 'string'},
                            {name: 'expression', type: 'string'},
                            {name: 'expressionEngine', type: 'string', defaultValue: 'JavaScript'},
                            {name: 'inputs', type: 'object'},
                            {name: 'resultType', type: 'string'},
                            {name: 'promptTemplate', type: 'string'},
                            {name: 'min', type: 'object', defaultValue: undefined},
                            {name: 'max', type: 'object', defaultValue: undefined},
                            {name: 'regexTemplate', type: 'string', defaultValue: undefined}
                        ],
                        data: []
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
                                    handler: function (view, rowIndex, colIndex, icon, event, record) {
                                        /*var controller = Ext.create('CGP.common.valueExV3.controller.Controller');
                                        controller.nodifyData(view, rowIndex, me.configurableId);*/
                                        var expressionValueStore = Ext.create('Ext.data.Store', {
                                            autoSync: true,
                                            fields: [
                                                {name: 'clazz', type: 'string'},
                                                {name: 'expression', type: 'string'},
                                                {name: 'expressionEngine', type: 'string', defaultValue: 'JavaScript'},
                                                {name: 'inputs', type: 'object'},
                                                {name: 'resultType', type: 'string'},
                                                {name: 'promptTemplate', type: 'string'},
                                                {name: 'min', type: 'object', defaultValue: undefined},
                                                {name: 'max', type: 'object', defaultValue: undefined},
                                                {name: 'regexTemplate', type: 'string', defaultValue: undefined}
                                            ],
                                            data: []
                                        });
                                        var expressionValueStoreRecord = new expressionValueStore.model(record.getData());
                                        expressionValueStore.add(expressionValueStoreRecord);
                                        var win = Ext.create('CGP.common.valueExV3.view.SetExpressionValueWindow', {
                                            expressionValueStore: expressionValueStore,//记录expressionValue的store
                                            isCanUseTemplate: false,//是否可以使用快捷的模板来创建function表达式
                                            record: record,//对应的编辑记录
                                            saveHandler: function (btn) {
                                                var form = btn.ownerCt.ownerCt;
                                                var window = form.ownerCt;
                                                var validExpressionContainer = form.items.items[0];
                                                if (form.isValid()) {
                                                    var data = validExpressionContainer.getValidExpressionContainerValue();
                                                    if (data) {
                                                        for (var i in data) {
                                                            window.record.set(i, data[i]);
                                                        }
                                                        window.close();
                                                    }
                                                }
                                            }
                                        });
                                        win.show();
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
                            tdCls: 'vertical-middle',
                            width: 200,
                            renderer: function (value) {
                                return value.substring(value.lastIndexOf('.') + 1, value.length)
                            }
                        },
                        {
                            text: i18n.getKey('expression'),
                            dataIndex: 'expression',
                            tdCls: 'vertical-middle',
                            width: 200,
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';//显示的文本
                                return '<div style="white-space:normal;">' + value + '</div>';
                            }
                        },
                        {
                            text: i18n.getKey('expressionEngine'),
                            dataIndex: 'expressionEngine',
                            tdCls: 'vertical-middle'
                        },
                        {
                            text: i18n.getKey('resultType'),
                            dataIndex: 'resultType',
                            tdCls: 'vertical-middle'

                        },
                        {
                            text: i18n.getKey('promptTemplate'),
                            dataIndex: 'promptTemplate',
                            tdCls: 'vertical-middle',
                            flex: 1,
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';//显示的文本
                                return value;
                            }
                        }
                    ],
                    tbar: [
                        {
                            text: i18n.getKey('add'),
                            iconCls: 'icon_create',
                            handler: function (btn) {
                                /*    var controller = Ext.create('CGP.common.valueExV3.controller.Controller');
                                    controller.nodifyData(this.ownerCt.ownerCt, null, me.configurableId);*/
                                var gridField = btn.ownerCt.ownerCt;
                                var expressionStore = gridField.getStore();
                                var expressionValueStore = Ext.create('Ext.data.Store', {
                                    autoSync: true,
                                    fields: [
                                        {name: 'clazz', type: 'string'},
                                        {name: 'expression', type: 'string'},
                                        {name: 'expressionEngine', type: 'string', defaultValue: 'JavaScript'},
                                        {name: 'inputs', type: 'object'},
                                        {name: 'resultType', type: 'string'},
                                        {name: 'promptTemplate', type: 'string'},
                                        {name: 'min', type: 'object', defaultValue: undefined},
                                        {name: 'max', type: 'object', defaultValue: undefined},
                                        {name: 'regexTemplate', type: 'string', defaultValue: undefined}
                                    ],
                                    data: []
                                })
                                var win = Ext.create('CGP.common.valueExV3.view.SetExpressionValueWindow', {
                                    expressionValueStore: expressionValueStore,//记录expressionValue的store
                                    isCanUseTemplate: false,//是否可以使用快捷的模板来创建function表达式
                                    saveHandler: function (btn) {
                                        var form = btn.ownerCt.ownerCt;
                                        var window = form.ownerCt;
                                        var validExpressionContainer = form.items.items[0];
                                        if (form.isValid()) {
                                            var data = validExpressionContainer.getValidExpressionContainerValue();
                                            if (data) {
                                                var record = null;
                                                window.expressionValueStore.removeAll();
                                                record = new window.expressionValueStore.model(data);
                                                expressionStore.add(record);
                                                window.close();
                                            }
                                        }
                                    }
                                });
                                win.show();
                            }
                        }
                    ]
                }
            },
            {
                xtype: 'validexpressioncontainer',
                itemId: 'validExpression',
                name: 'validExpression',
                gridConfigRenderTo: JSGetUUID(),
                fieldLabel: i18n.getKey('validExpression'),
                configurableId: me.configurableId
            }

        ];
        me.callParent(arguments);
    }
});
