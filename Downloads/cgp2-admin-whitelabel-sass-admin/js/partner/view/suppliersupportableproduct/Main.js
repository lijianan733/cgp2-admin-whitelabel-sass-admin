/**
 * Created by nan on 2018/3/26.
 */
Ext.onReady(function () {
    var partnerId = JSGetQueryString('partnerId');
    var websiteId = JSGetQueryString('websiteId');
    var store = Ext.create('CGP.partner.view.suppliersupportableproduct.store.SupportableProductStore', {
        partnerId: partnerId
    });

    var controller = Ext.create('CGP.partner.view.suppliersupportableproduct.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('check') + i18n.getKey('suppliersupportableproduct'),
        block: 'partner/partnersuppliersupportableproduct',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                text: i18n.getKey('add'),
                handler: function (view) {
                    var win = Ext.create('CGP.partner.view.suppliersupportableproduct.view.SelectEnaddableProductWindow', {
                        page: page,
                        partnerId: partnerId,
                        controller: controller
                    });
                    win.show();
                }
            }
        },
        gridCfg: {
            store: store,
            frame: false,
            editAction: false,//是否启用edit的按钮
            deleteAction: true,//是否启用delete的按钮
            selType: 'checkboxmodel',
            columnDefaults: {
                autoSizeColumn: true
            },
            editActionHandler: function (grid, rowIndex, colIndex, view, event, record, dom) {
                controller.modifyPrice(record, store, partnerId);
            },
            columns: [
                {
                    text: i18n.getKey('product') + i18n.getKey('id'),
                    dataIndex: 'product',
                    itemId: 'id',
                    sortable: true,
                    renderer: function (value, metadata, record, index, count, store) {
                        metadata.tdAttr = 'data-qtip="' + value['id'] + '"';
                        return value['id'];
                    }
                },
                {
                    sortable: false,
                    text: i18n.getKey('operation'),
                    width: 100,
                    autoSizeColumn: false,
                    dataIndex: 'product',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, index, count, store) {
                        var productId = value['id'];
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            style: 'padding:0',
                            default: {
                                width: 100
                            },
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: [
                                        {
                                            text: i18n.getKey('shippingMethod') + i18n.getKey('config'),
                                            handler: function (view) {
                                                controller.manageDeliveryMethodConfig(partnerId, productId, websiteId);
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
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
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    width: 200,
                    itemId: 'status',
                    renderer: function (value, metadata, record, index, count, store) {
                        value = value == 'UNPRODUCIBILITY' ? i18n.getKey('unProducibility') : i18n.getKey('producibility');
                        metadata.tdAttr = 'data-qtip="' + value['sku'] + '"';
                        return value;

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
                                                controller.modifyPrice(record, store, partnerId);
                                            })
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    name: 'product.id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('product') + i18n.getKey('id'),
                    itemId: 'productId'
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
                                type: i18n.getKey('unProducibility'), value: 'UNPRODUCIBILITY'
                            },
                            {
                                type: i18n.getKey('producibility'), value: 'PRODUCIBILITY'
                            }
                        ]
                    }),
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'
                }
            ]
        }
    });
})