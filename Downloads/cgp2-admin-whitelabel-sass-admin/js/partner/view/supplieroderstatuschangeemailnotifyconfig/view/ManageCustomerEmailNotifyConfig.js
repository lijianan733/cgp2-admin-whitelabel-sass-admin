/**
 * Created by nan on 2018/4/24.
 */
Ext.onReady(function () {
    var store = Ext.create('CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.store.OrderStatusChangeMailConfigStore', {
        params: {
            filter: '[{"name":"type","value":"customer","type":"string"}]'
        }
    });
    var partnerId = JSGetQueryString('partnerId');
    var tab = this.parent.Ext.getCmp('supplierOrderStatusChangeEmailNotifyConfig');
    var controller = Ext.create('CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.controller.MainController');
    var OrderStatuses = parent.Ext.StoreManager.get('allOrderStatus');//很不幸，该panel使用的是iframe故是独立的，必须适应partner获取外围的window
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('orderStatusChangeEmailNotifyConfig'),
        tbarCfg: {
            btnCreate: {
                handler: function (view) {
                    controller.showCustomerEditOrCreateConfigPage(tab, 'create', partnerId)
                }
            },
            btnDelete: {
                handler: function (view) {
                    controller.batchDeleteRecord(view, store)
                }
            }
        },
        gridCfg: {
            store: store,
            frame: false,
            bodyStyle: 'overflow-x:hidden;',
            deleteAction: false,
            editAction: false,
            columns: [
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    width: 60,
                    tdCls: 'vertical-middle',
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: i18n.getKey('edit'),
                            handler: function (gridview, recordIndex, cellIndex, fun, button, record) {
                                var id = record.getId();
                                controller.showCustomerEditOrCreateConfigPage(tab, 'edit', partnerId, id);

                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actiondelete',
                            tooltip: i18n.getKey('destroy'),
                            handler: function (view, rowIndex, colIndex) {
                                controller.deleteRecord(view, rowIndex)
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id',
                    sortable: true,
                    width: 100
                },
                {
                    text: i18n.getKey('fromStatus'),
                    dataIndex: 'preStatusId',
                    itemId: 'preStatusId',
                    sortable: true,
                    width: 150,
                    renderer: function (value) {
                        var record = OrderStatuses.findRecord('id', value);
                        if (record) {
                            return record.get('name')
                        } else {
                            return null;
                        }
                    }
                },
                {
                    text: i18n.getKey('toStatus'),
                    dataIndex: 'curStatusId',
                    itemId: 'curStatusId',
                    sortable: true,
                    width: 150,
                    renderer: function (value) {
                        var record = OrderStatuses.findRecord('id', value);
                        if (record) {
                            return record.get('name')
                        } else {
                            return null;
                        }
                    }
                },
                {
                    text: i18n.getKey('notifyEmailConfig'),
                    dataIndex: 'mailTemplateConfig',
                    itemId: 'mailTemplateConfig',
                    xtype: "componentcolumn",
                    width: 200,
                    renderer: function (value, metadata, record) {
                        if (!Ext.isEmpty(value)) {
                            value.clazz = value.clazz.substring(value.clazz.lastIndexOf('.') + 1, value.clazz.length);
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('notifyEmailConfig') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        display.getEl().on("click", function () {
                                            controller.showCustomerMailTemplateConfigDetail(value);
                                        });
                                    }
                                }}
                        } else {
                            return null;
                        }
                    }
                }
            ]
        },
        filterCfg: {
            layout: {
                type: 'table',
                columns: 4
            },
            defaults: {
                margin: '10 10 10 10 '
            },
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    isLike: false,
                    itemId: '_id'
                },
                {
                    name: 'type',
                    xtype: 'textfield',
                    hidden: true,
                    itemId: 'type',
                    value: 'customer'
                },
                {
                    name: 'preStatusId',
                    xtype: 'combo',
                    itemId: 'fromStatus',
                    editable: false,
                    fieldLabel: i18n.getKey('fromStatus'),
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    labelAlign: 'right',
                    store: OrderStatuses,
                    queryMode: 'remote',
                    matchFieldWidth: true,
                    listeners: {
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            if (!combo.getValue())
                                combo.select(store.getAt(0));
                        }
                    }
                },
                {
                    name: 'curStatusId',
                    xtype: 'combo',
                    itemId: 'toStatus',
                    editable: false,
                    fieldLabel: i18n.getKey('toStatus'),
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    labelAlign: 'right',
                    store: OrderStatuses,
                    queryMode: 'remote',
                    matchFieldWidth: true,
                    listeners: {
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            if (!combo.getValue())
                                combo.select(store.getAt(0));
                        }
                    }
                }
            ]
        }
    });
    window.downLoad = function (itemId) {
        var field = Ext.getCmp(itemId);
        var fileName = field.fileName;
        const a = document.createElement('a');
        a.setAttribute('href', imageServer + field.name);
        a.setAttribute('download', fileName);
        a.click();
    };
})
