/**
 * Created by nan on 2017/12/8.
 *可用产品的弹窗中包含的panel
 */
Ext.syncRequire([
    'CGP.partner.view.ecommerceenableproductmanage.store.EnableProductStore'
]);
Ext.define("CGP.partner.view.ecommerceenableproductmanage.view.EnableProductManagePanel", {
    extend: 'CGP.partner.view.ProductSearchGrid',
    border: false,
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        var websiteStore = Ext.create('CGP.partner.store.WebsiteStore');
        var store = Ext.create('CGP.partner.view.ecommerceenableproductmanage.store.EnableProductStore', {
            partnerId: me.partnerId
        });
        me.gridCfg = {
            frame: false,
            viewConfig: {
                enableTextSelection: true
            },
            store: store,
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_create',
                    handler: function () {
                        var store = this.ownerCt.ownerCt.getStore();
                        me.controller.addProductWindow(me.partnerId, me.websiteId, store)
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('delete'),
                    iconCls: 'icon_delete',
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;
                        var selectRecord = grid.getSelectionModel().getSelection();
                        if (selectRecord.length > 0) {
                            Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (btn) {
                                if (btn == 'yes') {
                                    Ext.Array.forEach(selectRecord, function (record) {
                                        Ext.Ajax.request({
                                            url: adminPath + 'api/salers/' + me.partnerId + '/productConfigs/' + record.getId(),
                                            method: 'DELETE',
                                            headers: {
                                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                            },
                                            success: function (response) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                if (responseMessage.success) {
                                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'), function () {
                                                        me.grid.store.load()
                                                    });
                                                } else {
                                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                                }
                                            },
                                            failure: function (response) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                            }
                                        })
                                    })
                                }
                            });
                        }
                    }
                }
            ],
            deleteAction: false,
            editAction: false,
            selType: 'checkboxmodel',
            columns: [
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    sortable: false,
                    resizable: false,
                    width: 50,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actiondelete',
                            tooltip: i18n.getKey('destroy'),
                            handler: function (view, rowIndex, colIndex, grid, event, record, dom) {
                                Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (btn) {
                                    if (btn == 'yes') {
                                        Ext.Ajax.request({
                                            url: adminPath + 'api/salers/' + me.partnerId + '/productConfigs/' + record.getId(),
                                            method: 'DELETE',
                                            headers: {
                                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                            },
                                            success: function (response) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                if (responseMessage.success) {
                                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'), function () {
                                                        me.grid.store.load();
                                                    });
                                                } else {
                                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                                }
                                            },
                                            failure: function (response) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'product',
                    itemId: 'id',
                    sortable: true,
                    renderer: function (value, metadata, record, index, count, store) {
                        metadata.tdAttr = 'data-qtip="' + value['id'] + '"';
                        return value['id'];
                    }
                },
                {
                    text: i18n.getKey('sku'),
                    dataIndex: 'product',
                    width: 200,
                    itemId: 'sku',
                    renderer: function (value, metadata, record, index, count, store) {
                        metadata.tdAttr = 'data-qtip="' + value['sku'] + '"';
                        return value['sku'];
                    }
                },
                {
                    text: i18n.getKey('model'),
                    dataIndex: 'product',
                    width: 200,
                    itemId: 'model',
                    renderer: function (value, metadata, record, index, count, store) {
                        metadata.tdAttr = 'data-qtip="' + value['model'] + '"';
                        return value['model'];
                    }
                },

                {
                    text: i18n.getKey('name'),
                    dataIndex: 'product',
                    width: 200,
                    itemId: 'name',
                    renderer: function (value, metadata, record, index, count, store) {
                        metadata.tdAttr = 'data-qtip="' + value['name'] + '"';
                        return value['name'];
                    }
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    width: 200,
                    itemId: 'status',
                    renderer: function (value, metadata) {
                        value = value == 'OFFLINE' ? i18n.getKey('offline') : i18n.getKey('online');
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'product',
                    width: 200,
                    itemId: 'type',
                    renderer: function (value, metadata, record, index, count, store) {
                        metadata.tdAttr = 'data-qtip="' + value['type'] + '"';
                        return value['type'];
                    }
                },
                {
                    text: i18n.getKey('price'),
                    width: 180,
                    xtype: 'componentcolumn',
                    dataIndex: 'price',
                    renderer: function (value, metadata, record, index, count, store) {
                        return {
                            xtype: 'container',
                            layout: 'hbox',
                            record: record,
                            items: [
                                {
                                    xtype: 'displayfield',
                                    value: value,
                                    itemId: 'display'
                                },
                                {
                                    xtype: 'displayfield',
                                    value: '<a href="#")>' + i18n.getKey('edit') + i18n.getKey('price') + '</a>',
                                    itemId: 'edit',
                                    margin: '0 0 0 15',
                                    listeners: {
                                        render: function (view) {
                                            var record = view.ownerCt.record;
                                            view.getEl().on("click", function (view) {
                                                me.controller.modifyPrice(record, store, me.partnerId);
                                            })
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        };
        me.filterCfg = {
            height: 150,
            defaults: {
                width: 280
            },
            frame: false,
            border: false,
            items: [
                {
                    name: 'product.id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('product') + i18n.getKey('id'),
                    itemId: 'productId',
                    minValue: 1,
                    allowDecimals: false,
                    allowExponential: false,
                    hideTrigger: true
                },
                {
                    name: 'product.name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'product.model',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('model'),
                    itemId: 'model'
                },
                {
                    name: 'product.type',
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'type',
                    xtype: 'combo',
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: 'Sku', value: 'SKU'
                            },
                            {
                                type: 'Configurable', value: 'Configurable'
                            }
                        ]
                    }),
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'

                },
                {
                    name: 'product.sku',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('sku'),
                    itemId: 'sku'
                },
                {
                    name: 'status',
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    xtype: 'combo',
                    isLike: false,
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: i18n.getKey('online'), value: 'ONLINE'
                            },
                            {
                                type: i18n.getKey('offline'), value: 'OFFLINE'
                            }
                        ]
                    }),
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'
                }
            ]
        };
        me.callParent(arguments);
    }
});