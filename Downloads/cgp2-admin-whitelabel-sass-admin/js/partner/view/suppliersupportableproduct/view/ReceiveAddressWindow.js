/**
 * Created by nan on 2018/4/19.
 */
Ext.define('CGP.partner.view.suppliersupportableproduct.view.ReceiveAddressWindow', {
    extend: 'Ext.window.Window',
    title: i18n.getKey('shippingMethod') + i18n.getKey('config'),
    height: 160,
    width: 400,
    modal: true,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        var enableAddressStore = Ext.create('CGP.partner.view.suppliersupportableproduct.store.EnableAddressStore', {
            params: {
                filter: '[{"name":"websiteId","value":' + me.websiteId + ',"type":"number"}]'
            }, listeners: {
                load: function (store) {
                    if (me.method == 'PUT') {
                        var form = me.getComponent('form');
                        var deliveryMethodType = form.getComponent('deliveryMethodType');
                        deliveryMethodType.setValue(me.record.get('deliveryMethodType'));
                        var receiveAddressId = form.getComponent('receiveAddressId');
                        if (!receiveAddressId.rendered) {
                            receiveAddressId.on('afterrender', function () {
                                receiveAddressId.setSubmitValue(me.record.get('receiveAddressId'));
                            })
                        } else {
                            receiveAddressId.setSubmitValue(me.record.get('receiveAddressId'));
                        }
                    }
                }
            }
        });
        me.items = {
            xtype: 'form',
            itemId: 'form',
            border: false,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    name: 'deliveryMethodType',
                    xtype: 'combo',
                    itemId: 'deliveryMethodType',
                    editable: false,
                    allowBlank: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: i18n.getKey('使用默认地址'), value: 'default'
                            },
                            {
                                type: i18n.getKey('使用指定地址'), value: 'assign'
                            }
                        ]
                    }),
                    fieldLabel: i18n.getKey('配送方式'),
                    displayField: 'type',
                    valueField: 'value'
                },
                {
                    xtype: 'gridcombo',
                    itemId: 'receiveAddressId',
                    editable: false,
                    fieldLabel: i18n.getKey('指定地址'),
                    allowBlank: false,
                    name: 'receiveAddressId',
                    displayField: 'name',
                    valueField: '_id',
                    matchFieldWidth: false,
                    multiSelect: false,
                    store: enableAddressStore,
                    gridCfg: {
                        store: enableAddressStore,
                        height: 300,
                        width: 600,
                        selType: 'rowmodel',
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 100,
                                dataIndex: '_id'
                            },
                            {
                                text: i18n.getKey('name'),
                                width: 100,
                                dataIndex: 'name'
                            },
                            {
                                text: i18n.getKey('telephone'),
                                width: 100,
                                dataIndex: 'address',
                                renderer: function (value, attr, record) {
                                    return value.telephone
                                }
                            },
                            {
                                text: i18n.getKey('country'),
                                width: 100,
                                dataIndex: 'address',
                                renderer: function (value, attr, record) {
                                    return value.countryName
                                }
                            },
                            {
                                text: i18n.getKey('address') + 1,
                                width: 100,
                                dataIndex: 'address',
                                renderer: function (value, attr, record) {
                                    return value.streetAddress1
                                }
                            },
                            {
                                text: i18n.getKey('address') + 2,
                                width: 100,
                                dataIndex: 'address',
                                renderer: function (value, attr, record) {
                                    return value.streetAddress2
                                }
                            },
                            {
                                text: i18n.getKey('receiver'),
                                width: 100,
                                dataIndex: 'address',
                                renderer: function (value, attr, record) {
                                    return value.firstName + value.lastName
                                }
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: enableAddressStore,
                            displayInfo: true,
                            emptyMsg: i18n.getKey('noData')
                        })

                    }
                }
            ]

        };
        me.bbar = ['->', {
            text: i18n.getKey('save'),
            itemId: 'okBtn',
            iconCls: 'icon_agree',
            handler: function (btn) {
                var controller = Ext.create('CGP.partner.view.suppliersupportableproduct.controller.Controller')
                controller.saveReceiveAddress(btn, me);
            }
        }, {
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function (btn) {
                me.close();
            }
        }]
        me.callParent(arguments)
    }
})