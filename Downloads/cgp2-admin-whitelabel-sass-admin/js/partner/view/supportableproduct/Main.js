/**
 * Created by nan on 2018/3/26.
 */
Ext.onReady(function () {
    var partnerId = JSGetQueryString('partnerId');
    var websiteId = JSGetQueryString('websiteId');
    var store = Ext.create('CGP.partner.view.supportableproduct.store.SupportableProductStore', {
        partnerId: partnerId
    });

    var controller = Ext.create('CGP.partner.view.supportableproduct.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('check') + i18n.getKey('supportableproduct'),
        block: 'partner/partnersupportableproduct',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function (view) {
                    var win = Ext.create('CGP.partner.view.supportableproduct.view.SelectEnaddableProductWindow', {
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
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    itemId: 'id',
                    sortable: true
                },
                {
                    sortable: false,
                    text: i18n.getKey('operation'),
                    width: 100,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var productId = record.get('id');
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
                    dataIndex: 'model',
                    width: 200,
                    itemId: 'model'
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 200,
                    itemId: 'name'
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    width: 200,
                    itemId: 'type'
                }
            ]
        },
        // 搜索框
        filterCfg: {
            defaults: {
                margin: '10 10 10 10'
            },
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                }
            ]
        }
    });
})