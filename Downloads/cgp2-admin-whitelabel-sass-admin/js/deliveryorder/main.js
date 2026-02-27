Ext.Loader.syncRequire([
    'CGP.deliveryorder.store.ShippingMethodV2',
])
Ext.onReady(function () {
    // var shipmentMethodStore = Ext.create('CGP.deliveryorder.store.ShippingMethodStore');

    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('deliveryOrder'),
        block: 'deliveryorder',
        editPage: 'edit.html',
        tbarCfg: {
            hiddenButtons: ['create', 'read', 'clear', 'delete', 'config', 'help', 'export', 'import'],
        },
        gridCfg: {
            //store.js
            store: Ext.create("CGP.deliveryorder.store.DeliveryOrderStore"),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                align: 'center',
            },
            editAction: false,
            deleteAction: false,
            columns: [
                {
                    sortable: false,
                    text: i18n.getKey('operation'),
                    width: 100,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
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
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                            {
                                                text: i18n.getKey('modifyStatus'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    JSOpen({
                                                        id: 'modifyDeliveryOrderStatus',
                                                        url: path + 'partials/deliveryorder/edit.html?id=' + record.get('id') + '&isReadOnly=false',
                                                        title: i18n.getKey('deliveryOrder') + ' ' + i18n.getKey('modifyStatus') + '(' + record.get('id') + ')',
                                                        refresh: true
                                                    })

                                                }
                                            },
                                            {
                                                hidden: !Ext.Array.contains([103, 102], record.get('status').id),
                                                text: i18n.getKey('打印label'),
                                                handler: function (btn) {
                                                    var controller = Ext.create('CGP.order.controller.Order');
                                                    controller.printLabel(record.get('id'));
                                                }
                                            },
                                            {
                                                hidden: !(Ext.Array.contains([101, 102], record.get('status').id) && record.get('orderDeliveryMethod') == 'ULGS'),
                                                text: i18n.getKey('取消发货单'),
                                                handler: function (btn) {
                                                    Ext.create('CGP.deliveryorder.view.cancelDeliveryOrder', {
                                                        record: record
                                                    }).show();
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('id'),
                    width: 120,
                    dataIndex: 'id',
                    sortable: true,
                    getDisplayName: function (value, mateData, record) {
                        mateData.tdAttr = 'data-qtip=查看发货订单详情';
                        return '<a href="#" style="color: blue;" >' + value + '</a>'
                    },
                    clickHandler: function (value) {
                        JSOpen({
                            id: 'modifyDeliveryOrderStatus',
                            url: path + 'partials/deliveryorder/edit.html?id=' + value + '&isReadOnly=' + 'true',
                            title: i18n.getKey('deliveryOrder') + '(' + value + ')',
                            refresh: true
                        });
                    }
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    itemId: 'status',
                    width: 120,
                    xtype: 'gridcolumn',
                    sortable: false,
                    renderer: function (value) {
                        return i18n.getKey(value.frontendName);
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('走货方式'),
                    dataIndex: 'orderDeliveryMethod',
                    getDisplayName: function (value, metadata, record) {
                        const status = record.get('status')?.id,
                            //已组装(待装箱)状态之前
                            atagcolumn = [40, 100, 117, 300, 116, 113, 44, 118, 42, 37681428, 9358697, 120].includes(status) ? '<a href="#">修改</a>' : '',
                            statusGather = {
                                ULGS: '统一配送',
                                SELF_SUPPORT: '自营配送'
                            };

                        return `${statusGather[value || 'SELF_SUPPORT']} ${atagcolumn}`;
                    },
                    clickHandler: function (value, metadata, record, rowIndex, colIndex, store, view) {
                        const id = record.get('id'),
                            win = Ext.create('Ext.window.Window', {
                                layout: 'fit',
                                modal: true,
                                constrain: true,
                                title: i18n.getKey('修改走货方式'),
                                items: [
                                    {
                                        xtype: 'errorstrickform',
                                        layout: 'vbox',
                                        itemId: 'form',
                                        items: [
                                            {
                                                xtype: 'combo',
                                                editable: false,
                                                allowBlank: false,
                                                margin: '10 25 10 25',
                                                fieldLabel: i18n.getKey('走货方式'),
                                                name: 'orderDeliveryMethod',
                                                itemId: 'orderDeliveryMethod',
                                                value: value,
                                                store: {
                                                    fields: [
                                                        {
                                                            name: 'key',
                                                            type: 'string'
                                                        },
                                                        {
                                                            name: 'value',
                                                            type: 'string'
                                                        }
                                                    ],
                                                    data: [
                                                        {
                                                            key: 'ULGS',
                                                            value: i18n.getKey('统一配送')
                                                        },
                                                        {
                                                            key: 'SELF_SUPPORT',
                                                            value: i18n.getKey('自营配送')
                                                        }
                                                    ]
                                                },
                                                displayField: 'value',
                                                valueField: 'key'
                                            }
                                        ]
                                    }
                                ],
                                bbar: {
                                    xtype: 'bottomtoolbar',
                                    saveBtnCfg: {
                                        handler: function (btn) {
                                            var win = btn.ownerCt.ownerCt,
                                                form = win.getComponent('form'),
                                                value = form.getValues();

                                            if (form.isValid()) {
                                                const url = adminPath + 'api/orders/' + id + '/shipment';

                                                controller.asyncEditQuery(url, value, true, function (require, success, response) {
                                                    if (success) {
                                                        var responseText = Ext.JSON.decode(response.responseText);
                                                        if (responseText.success) {
                                                            win.close();
                                                            store.load();
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    }
                                },
                            });
                        win.show();

                    }
                },
                {
                    text: i18n.getKey('统一发货订单号'),
                    dataIndex: 'shipmentNo',
                    xtype: 'gridcolumn',
                    width: 200,
                    labelWidth: 120,
                    itemId: 'shipmentNo',
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('receiver') + i18n.getKey('info'),
                    width: 300,
                    dataIndex: 'address',
                    autoWidthComponents: true,
                    tooltip: '修改收件人地址',
                    getDisplayName: function (value, metadata, record) {
                        var str = JSBuildAddressInfo(value);
                        var statusId = record.get('status')['id'];
                        metadata.tdAttr = 'data-qtip="' + str + '"';
                        if ([101, 102].includes(statusId)) {
                            str = str + '  <a href="#" style="color: blue">修改</a>';
                        }
                        return str;
                    },
                    clickHandler: function (value, metadata, record, rowIndex, colIndex, store, view) {
                        var controller = Ext.create('CGP.orderstatusmodify.view.orderitemsmultipleaddress.controller.Controller');
                        var deliveryAddress1 = {
                            "shipmentOrderId": record.get('id'),
                            "addressBook": value,
                            "shipMethod": record.get('selectedShipmentMethod')
                        }
                        controller.editReceiverAddress(deliveryAddress1, function () {
                            store.load()
                        });
                    }
                },
                {
                    text: i18n.getKey('cost'),
                    dataIndex: 'shipmentCost',
                    sortable: false,
                    bottomToolbarHeight: 30,
                    renderer: function (value, metadata) {
                        metadata.style = "font-weight:bold";
                        var newValue = value || '';
                        return newValue;
                    }
                },
                {
                    dataIndex: 'selectedShipmentMethod',
                    text: i18n.getKey('发货方式'),
                    width: 160,
                },
                {
                    text: i18n.getKey('生产基地'),
                    dataIndex: 'manufactureCenter',
                    renderer: function (value, metadata, record) {
                        var controller = Ext.create('CGP.shipmentrequirement.controller.Controller'),
                            {text} = controller.getManufactureCenterText(value),
                            result = text + '生产基地'

                        metadata.tdAttr = 'data-qtip="' + result + '"';

                        return result;
                    }
                },
                {
                    dataIndex: 'id',
                    text: i18n.getKey('delivery') + i18n.getKey('item'),
                    minWidth: 150,
                    flex: 1,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + i18n.getKey('check') + i18n.getKey('delivery') + i18n.getKey('item') + '"';
                        return {
                            xtype: 'displayfield',
                            value: JSCreateHyperLink(i18n.getKey('check')),
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                    var ela = Ext.fly(a);
                                    ela.on("click", function () {
                                        Ext.create('CGP.shipmentrequirement.view.CheckDeliveryItemWin', {
                                            recordClazz: record.get('clazz'),
                                            recordId: record.get('id')
                                        }).show();
                                    });
                                }
                            }
                        }
                    }
                },
                {
                    text: i18n.getKey('shippingMethod'),
                    dataIndex: 'shipmentMethod',
                    width: 100,
                    sortable: false
                },
                {
                    text: i18n.getKey('firstTrackingNo'),
                    dataIndex: 'firstTrackingNo',
                    width: 150,
                },
                {
                    text: i18n.getKey('deliveryNo'),
                    dataIndex: 'trackingNo',
                    sortable: false,
                    width: 150,
                },
            ]
        },
        filterCfg: {
            layout: {
                type: 'table',
                columns: 4,
            },
            items: [
                {
                    id: 'idSearchField',
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id',
                },
                {
                    name: 'orderNumber',
                    enforceMaxLength: true,
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('orderNumber'),
                    itemId: 'orderNumber',
                    listeners: {
                        render: function (comp) {
                            var orderNumber = JSGetQueryString('orderNumber');
                            if (orderNumber) {
                                comp.setValue(orderNumber);
                            }
                        }
                    },
                },
                {
                    name: 'items.orderItem._id',
                    enforceMaxLength: true,
                    isLike: false,
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('orderLineItem') + i18n.getKey('id'),
                    itemId: 'oderLineItemId',
                    listeners: {
                        render: function (comp) {
                            var oderLineItemId = JSGetQueryString('oderLineItemId');
                            if (oderLineItemId) {
                                comp.setValue(oderLineItemId);
                            }
                        }
                    },
                },
                {
                    id: 'shippingMethod',
                    name: 'shipmentMethod',
                    xtype: 'combo',
                    triggerAction: 'all',
                    autoScroll: true,
                    haveReset: true,
                    isLike: false,
                    itemId: 'shippingMethod',
                    editable: false,
                    fieldLabel: i18n.getKey('shippingMethod'),
                    displayField: 'code',
                    valueField: 'code',
                    labelAlign: 'right',
                    store: Ext.create('CGP.deliveryorder.store.ShippingMethodV2', {
                        autoLoad: false,
                        params: {
                            websiteId: 11
                        }
                    }),
                    queryMode: 'remote',
                    matchFieldWidth: true,
                    pickerAlign: 'tl-bl'
                },
                {
                    name: 'shipmentNo',
                    enforceMaxLength: true,
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('统一发货订单号'),
                    labelWidth: 120,
                    itemId: 'shipmentNo'
                },
                {
                    fieldLabel: i18n.getKey('order') + i18n.getKey('status'),
                    name: 'status.id',
                    itemId: 'status',
                    xtype: 'combo',
                    editable: false,
                    haveReset: true,
                    displayField: 'frontendName',
                    valueField: 'id',
                    store: new Ext.data.Store({
                        fields: [
                            {
                                name: 'id',
                                type: 'int'
                            },
                            {name: 'name', type: 'string'}, {
                                name: 'frontendName',
                                type: 'string'
                            }
                        ],
                        proxy: {
                            type: 'uxrest',
                            url: adminPath + 'api/shipmentOrderStatus',
                            reader: {
                                type: 'json',
                                root: 'data.content'
                            }
                        },
                        autoLoad: false,
                    })
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('走货方式'),
                    name: 'orderDeliveryMethod',
                    itemId: 'orderDeliveryMethod',
                    editable: false,
                    isLike: false,
                    haveReset: true,
                    store: {
                        fields: [
                            {
                                name: 'key',
                                type: 'string'
                            },
                            {
                                name: 'value',
                                type: 'string'
                            }
                        ],
                        data: [
                            {
                                key: 'ULGS',
                                value: i18n.getKey('统一配送')
                            },
                            {
                                key: 'SELF_SUPPORT',
                                value: i18n.getKey('自营配送')
                            }
                        ]
                    },
                    displayField: 'value',
                    valueField: 'key',
                },
                {
                    name: 'shipmentNo',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('shipmentNo'),
                    itemId: 'shipmentNo'
                },
                {
                    xtype: 'textfield',
                    name: 'address.emailAddress',
                    itemId: 'address.emailAddress',
                    enforceMaxLength: true,
                    fieldLabel: i18n.getKey('收件人邮箱'),
                    listeners: {
                        render: function (comp) {
                            var emailAddress = JSGetQueryString('emailAddress');
                            if (emailAddress) {
                                comp.setValue(emailAddress);
                            }
                        }
                    },
                },
                {
                    xtype: 'textfield',
                    name: 'customerProperty',
                    itemId: 'customerProperty',
                    enforceMaxLength: true,
                    fieldLabel: i18n.getKey('收件人信息'),
                },
                {
                    xtype: 'textfield',
                    name: 'trackingNo',
                    itemId: 'trackingNo',
                    enforceMaxLength: true,
                    isLike: false,
                    fieldLabel: i18n.getKey('邮递单号'),
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('生产基地'),
                    name: 'manufactureCenter',
                    itemId: 'manufactureCenter',
                    isLike: false,
                    editable: false,
                    haveReset: true,
                    displayField: 'key',
                    valueField: 'value',
                    store: {
                        fields: ['key', 'value'],
                        data: [
                            {
                                'key': '东莞生产基地',
                                'value': "PL0001"
                            },
                            {
                                'key': '美国生产基地',
                                'value': "PL0002"
                            },
                            {
                                'key': '越南生产基地',
                                'value': "PL0003"
                            }
                        ]
                    }
                }
            ]
        }
    });
});
