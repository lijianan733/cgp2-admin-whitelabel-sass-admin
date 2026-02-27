/**
 * Created by nan on 2019/12/27.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.ModifyPageContentItemPlaceholderForm", {
    requires: ['CGP.common.valueExV3.view.ExpressionField', 'CGP.variabledatasource.store.VariableDataSourceStore'],
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.modifypagecontentitemplaceholderfrom',
    region: 'center',
    itemId: 'centerPanel',
    createOrEdit: 'create',
    record: null,
    data: null,
    pageContentItemPlaceHolderId: null,
    bodyStyle: {
        borderColor: 'silver'
    },
    defaults: {
        height: 800,
        width: 600,
        hidden: true,
        margin: '10 10 10 10',
    },
    listeners: {
        afterrender: function (panel) {
            panel.el.mask();
        }
    },
    tbar: [
        {
            xtype: 'button',
            text: i18n.getKey('save') + i18n.getKey('PlaceHolderVdCfg'),
            hidden: true,
            iconCls: 'icon_save',
            handler: function (btn) {
                var centerPanel = btn.ownerCt.ownerCt;
                var leftPanel = centerPanel.ownerCt.getComponent('leftPanel');
                var data = centerPanel.getValue();
                if (centerPanel.createOrEdit == 'create') {
                    leftPanel.store.proxy.data.push(data);
                    leftPanel.store.load();
                    leftPanel.getSelectionModel().select(leftPanel.store.proxy.data.length - 1);
                } else {
                    var index = centerPanel.record.index;
                    leftPanel.store.proxy.data[index] = data;
                    leftPanel.store.load();
                    leftPanel.getSelectionModel().select(index);
                }
                console.log(data);

            }
        },
        /*{
            xtype: 'button',
            text: i18n.getKey('refresh'),
            iconCls: 'icon_refresh',
            handler: function (btn) {
                var panel = btn.ownerCt.ownerCt;
                panel.setValue(panel.data);
            }
        },*/ {
            xtype: 'button',
            text: i18n.getKey('查看原PageContentItemPlaceholder'),
            iconCls: 'icon_check',
            handler: function (btn) {
                var panel = btn.ownerCt.ownerCt;
                var fieldset = Ext.widget('originalpagecontentitemplaceholderfrom', {
                    itemId: 'originalData',
                    // title: '<font color="red">原PageContentItemPlaceholder</font>',
                    readOnly: true,
                });
                var win = Ext.create('Ext.window.Window', {
                    constrain: true,
                    title: '原PageContentItemPlaceholder',
                    items: [
                        fieldset
                    ]
                });
                var pageContentItemPlaceholderId = panel.data.pageContentItemPlaceholder._id;
                var pageContentItemPlaceholderData = panel.ownerCt.pageContentItemPlaceholderStore.findRecord('_id', pageContentItemPlaceholderId).getData();
                fieldset.setValue(pageContentItemPlaceholderData);
                win.show();
            }
        }
    ],
    border: false,
    setValue: function (data) {
        var me = this;
        me.data = data;
        console.log(data);
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.xtype == 'gridcombo') {
                if (data[item.getName()]) {
                    item.setInitialValue([data[item.getName()]._id]);
                }
            }
            if (item.itemId == 'pageContentItemPlaceholder') {
                item.setValue(data[item.getName()]._id);
            } else {
                item.setValue(data[item.getName()]);
            }
        }
        me.el.unmask();
    },
    reset: function () {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.xtype == 'expressionfield') {
                item.setValue({});
            } else {
                item.reset();
            }
        }
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.disabled != true) {
                if (item.itemId == 'dataSourceGridcombo') {
                    var dataSourceId = item.getSubmitValue()[0];
                    if (dataSourceId) {
                        var variableDataSource = item.getValue()[dataSourceId];
                        result[item.getName()] = {
                            _id: item.getSubmitValue()[0],
                            clazz: variableDataSource.clazz
                        };
                    }
                } else if (item.getName() == 'pageContentItemPlaceholder') {
                    result[item.getName()] = {
                        _id: item.getValue(),
                        clazz: 'com.qpp.cgp.domain.bom.PageContentItemPlaceholder'
                    };
                } else {
                    result[item.getName()] = item.getValue();
                }
            }
        }
        return result;
    },
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
    initComponent: function () {
        var me = this;
        me.defaults = {
            width: 550,
            margin: '5 15 5 15'

        };
        var variableDataSourceStore = Ext.create('CGP.variabledatasource.store.VariableDataSourceStore', {});
        me.items = [
            {
                xtype: 'textfield',
                readOnly: true,
                itemId: 'pageContentItemPlaceholder',
                fieldStyle: 'background-color:silver',
                fieldLabel: i18n.getKey('pageContentItem PlaceHolderId'),
                name: 'pageContentItemPlaceholder',
                hidden: true
            },
            {
                xtype: 'textfield',
                readOnly: true,
                itemId: 'itemSelector',
                fieldLabel: i18n.getKey('itemSelector'),
                fieldStyle: 'background-color:silver',
                name: 'itemSelector'
            },
            {
                xtype: 'textfield',
                readOnly: true,
                itemId: 'itemAttributes',
                fieldLabel: i18n.getKey('itemAttributes'),
                fieldStyle: 'background-color:silver',
                name: 'itemAttributes',

            },
            {
                xtype: 'textfield',
                itemId: 'description',
                allowBlank: false,
                fieldLabel: i18n.getKey('description'),
                name: 'description'
            },
            {
                name: 'variableDataSource',
                xtype: 'gridcombo',
                itemId: 'dataSourceGridcombo',
                allowBlank: true,
                fieldLabel: i18n.getKey('variable DataSource'),
                displayField: '_id',
                valueField: '_id',
                editable: false,
                haveReset: true,
                store: variableDataSourceStore,
                matchFieldWidth: false,
                gridCfg: {
                    height: 250,
                    width: 600,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 80,
                            dataIndex: '_id'
                        },
                        {
                            text: i18n.getKey('selector'),
                            width: 200,
                            dataIndex: 'selector',

                        },
                        {
                            text: i18n.getKey('type'),
                            dataIndex: 'clazz',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                return value.split('.').pop();
                            }
                        }
                    ],
                    tbar: [
                        {
                            xtype: 'button',
                            iconCls: 'icon_add',
                            text: i18n.getKey('add'),
                            handler: function () {
                                JSOpen({
                                    id: 'variableDataSource_edit',
                                    url: path + "partials/variabledatasource/edit.html",
                                    title: i18n.getKey('create') + '_' + i18n.getKey('variableDataSource'),
                                    refresh: true
                                });
                            }
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'pagingtoolbar',
                            store: variableDataSourceStore,
                            dock: 'bottom',
                            displayInfo: true
                        }
                    ]
                }
            },
            {
                xtype: 'expressionfield',
                name: 'expression',
                itemId: 'expression',
                allowBlank: true,
                fieldLabel: i18n.getKey('expression')
            },
            {
                xtype: 'expressionfield',
                itemId: 'variableDataIndexExpression',
                name: 'variableDataIndexExpression',
                allowBlank: true,
                fieldLabel: i18n.getKey('variableData IndexExpression')
            }

        ];
        me.callParent();
    }
})
