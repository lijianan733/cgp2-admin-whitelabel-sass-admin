/**
 * Created by nan on 2019/4/4.
 * 离散值约束中的item项添加数据窗口
 */
Ext.define('CGP.common.valueExV3.view.SetDiscreteValueItemWindow', {
    extend: 'Ext.window.Window',
    requires: ['Ext.ux.form.ErrorStrickForm'],
    controller: Ext.create('CGP.common.valueExV3.controller.Controller'),
    expressionValueStore: null,
    createOrEdit: 'create',//以上3个参数时必须传的
    height: '70%',
    constrain: true,
    modal: true,
    width: '50%',
    maximizable: true,
    layout: 'fit',
    record: null,
    saveHandler: null,//自定义的保存操作
    initComponent: function () {
        var me = this;
        me.createOrEdit = me.record ? 'edit' : 'create';//是否已经有数据
        me.title = i18n.getKey(me.createOrEdit) + i18n.getKey('ExpressionValue');
        me.items = [{
            xtype: 'errorstrickform',
            autoScroll: true,
            itemId: 'conditionsForm',
            fieldDefaults: {
                allowBlank: false
            },
            border: false,
            items: [
                {
                    xtype: 'gridfield',
                    name: 'conditions',
                    itemId: 'conditions',
                    msgTarget: 'none',
                    allowBlank: true,
                    margin: '10 0 0 50',
                    fieldLabel: i18n.getKey('condition'),
                    width: 650,
                    height: 200,
                    gridConfig: {
                        viewConfig: {
                            enableTextSelection: true
                        },
                        renderTo: JSGetUUID(),
                        height: 200,
                        width: 650,
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
                                                    {
                                                        name: 'expressionEngine',
                                                        type: 'string',
                                                        defaultValue: 'JavaScript'
                                                    },
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
                                                    ;
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
                Ext.create('CGP.common.valueExV3.view.CommonPartField', {
                    name: 'value',
                    itemId: 'valueContainer',
                    margin: '10 0 0 50',
                    fieldLabel: i18n.getKey('value'),
                    defaults: {
                        margin: '10 0 0 50',
                        width: 500
                    }
                })

            ]
        }];

        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('save'),
            iconCls: 'icon_save',
            handler: me.saveHandler || function (btn) {
                var win = btn.ownerCt.ownerCt;
                var form = win.items.items[0];
                if (form.isValid()) {
                    var clazz = form.getComponent('valueContainer').getComponent('clazz').getValue();
                    if (clazz == 'com.qpp.cgp.value.ExpressionValueEx') {
                        var expression = form.getComponent('valueContainer').getComponent('expression').getValue();
                        if (Ext.isEmpty(expression)) {
                            Ext.Msg.alert(i18n.getKey('prompt'), '表达式不能为空');
                            return;
                        }
                    }
                    for (var j = 0; j < form.items.items.length; j++) {
                        if (form.items.items[j].xtype == 'gridfield') {
                            win.record.set(form.items.items[j].getName(), form.items.items[j].getSubmitData().conditions)
                        } else {
                            win.record.set(form.items.items[j].getName(), form.items.items[j].getValue())
                        }
                    }
                    if (createOrEdit == 'create') {
                        win.store.add(record);
                    }
                    win.close();
                }
            }
        },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    win.close();
                }
            }
        ];
        me.listeners = {
            'afterrender': {
                fn: function (view) {
                    var me = view;
                    if (me.createOrEdit == 'edit') {
                        var conditions = me.getComponent('conditionsForm').getComponent('conditions');
                        conditions.setSubmitValue(me.record.get('conditions'))
                        var valueContainer = me.getComponent('conditionsForm').getComponent('valueContainer');
                        valueContainer.setValue(me.record.get('value'));
                    }
                },
                single: true//使监听只执行一次
            }

        }

        me.callParent();

    }
})

