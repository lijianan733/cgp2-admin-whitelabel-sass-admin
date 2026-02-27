/**
 * Created by nan on 2018/3/14.
 */
Ext.define('CGP.common.valueExV3.view.EditDiscreteValueConstraintForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    isValid: function () {
        this.msgPanel.hide();
        var errors = {};
        var isValid = true;
        this.items.items.forEach(function (f) {
            if (!f.isValid()) {
                isValid = false;
                errors[f.getFieldLabel()] = f.getErrors();
            }
        });
        isValid ? null : this.showErrors(errors);
        return isValid;
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
    tbar: [
        {
            xtype: 'button',
            iconCls: 'icon_save',
            text: i18n.getKey('save'),
            handler: function () {
                var thisForm = this.ownerCt.ownerCt;
                var controller = Ext.create('CGP.common.valueExV3.controller.Controller');
                var data = thisForm.getFormValue(this);
                if (!Ext.isEmpty(data)) {
                    console.log(data);
                    var groupGridPanel = this.ownerCt.ownerCt.currentPanel;//跳转前的页面对象
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
        margin: '10 0 10 50',
        msgTarget: 'side',
        width: 700
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'checkboxfield',
                name: 'include',
                allowBlank: false,
                itemId: 'include',
                fieldLabel: i18n.getKey('isInclude')
            },
            {
                xtype: 'combo',
                readOnly: true,
                allowBlank: false,
                name: 'clazz',
                hidden: true,
                value: me.inputTypeClazz,
                fieldLabel: i18n.getKey('type'),
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
                valueField: 'class',
                displayField: 'name'
            },
            {
                xtype: 'textfield',
                name: 'description',
                itemId: 'description',
                fieldLabel: i18n.getKey('description'),
                allowBlank: true
            },
            {
                xtype: 'gridfield',
                name: 'items',
                itemId: 'items',
                fieldLabel: i18n.getKey('items'),
                width: 700,
                height: 500,
                allowBlank: false,
                msgTarget: 'under',
                gridConfig: {
                    height: 500,
                    renderTo: JSGetUUID(),
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        fields: [
                            {
                                name: 'clazz',
                                type: 'string',
                                defaultValue: 'com.qpp.cgp.value.constraint.DiscreteValueConstraintItem'
                            },
                            {name: 'conditions', type: 'object'},
                            {name: 'value', type: 'object'}
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
                                        var expressionValueStore = Ext.create('Ext.data.Store', {
                                            autoSync: true,
                                            fields: [
                                                {
                                                    name: 'clazz',
                                                    type: 'string',
                                                    defaultValue: 'com.qpp.cgp.domain.product.attribute.constraint2.single.DiscreteValueConstraintItem'
                                                },
                                                {name: 'conditions', type: 'object'},
                                                {name: 'value', type: 'object'}
                                            ],
                                            data: []
                                        });
                                        var win = Ext.create('CGP.common.valueExV3.view.SetDiscreteValueItemWindow', {
                                            expressionValueStore: expressionValueStore,//记录expressionValue的store
                                            record: record,//对应的编辑记录
                                            saveHandler: function (btn) {
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
                                                    win.close();
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
                            text: i18n.getKey('condition'),
                            dataIndex: 'conditions',
                            tdCls: 'vertical-middle',
                            flex: 1,
                            xtype: "componentcolumn",
                            renderer: function (value, metadata, record) {
                                if (!Ext.isEmpty(value)) {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('condition') + '</a>',
                                        listeners: {
                                            render: function (display) {
                                                display.getEl().on("click", function () {
                                                    var controller = Ext.create('CGP.common.valueExV3.controller.Controller');
                                                    controller.showconditionsDetail(value);
                                                });
                                            }
                                        }
                                    }
                                } else {
                                    return null;
                                }
                            }
                        },
                        {
                            text: i18n.getKey('value'),
                            dataIndex: 'value',
                            tdCls: 'vertical-middle',
                            flex: 2,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata) {
                                var id = JSGetUUID();
                                var expression = null;
                                var returnstr = '';
                                for (var i in value) {
                                    if (i == 'clazz') {
                                        returnstr += i + ' :  ' + value[i].substring(value[i].lastIndexOf('.') + 1, value[i].length) + '<br>';
                                    } else if (i == 'expression') {
                                        returnstr += i + ' ： <a href="#" id=' + id + '>' + '查看表达式' + '</a>';
                                        expression = value[i];
                                    } else if (i == 'multilingualKey' || i == 'constraints') {

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
                                                    var controller = Ext.create('CGP.common.valueExV3.controller.Controller');
                                                    controller.showExpression(expression);
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
                            text: i18n.getKey('add'),
                            iconCls: 'icon_create',
                            handler: function (btn) {
                                var gridStore = btn.ownerCt.ownerCt.store;
                                var expressionValueStore = Ext.create('Ext.data.Store', {
                                    autoSync: true,
                                    fields: [
                                        {
                                            name: 'clazz',
                                            type: 'string',
                                            defaultValue: 'com.qpp.cgp.domain.product.attribute.constraint2.single.DiscreteValueConstraintItem'
                                        },
                                        {name: 'conditions', type: 'object'},
                                        {name: 'value', type: 'object'}
                                    ],
                                    data: []
                                })
                                var win = Ext.create('CGP.common.valueExV3.view.SetDiscreteValueItemWindow', {
                                    expressionValueStore: expressionValueStore,//记录expressionValue的store
                                    record: null,//对应的编辑记录
                                    saveHandler: function (btn) {
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
                                            var result = {};
                                            for (var j = 0; j < form.items.items.length; j++) {
                                                if (form.items.items[j].xtype == 'gridfield') {
                                                    result[form.items.items[j].getName()] = form.items.items[j].getSubmitData().conditions;
                                                } else {
                                                    result[form.items.items[j].getName()] = form.items.items[j].getValue();
                                                }
                                            }
                                            var record = new win.expressionValueStore.model(result);
                                            gridStore.add(record);
                                            win.close();
                                        }
                                    }
                                });
                                win.show();
                            }
                        }
                    ]

                }
            }

        ];
        me.callParent(arguments);
    }
});
