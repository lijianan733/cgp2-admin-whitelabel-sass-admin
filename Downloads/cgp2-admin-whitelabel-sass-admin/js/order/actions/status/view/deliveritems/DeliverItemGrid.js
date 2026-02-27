Ext.define('Order.status.view.deliveritems.DeliverItemGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.deliveritemgrid',
    dataKeyName: 'internalId',
    customsOrderLineItemStore: null,
    requires: [
        //'Order.status.view.deliveritems.model.ShipmentBox',
        'Order.status.view.deliveritems.store.BoxSizeUnit'
    ],
    initComponent: function () {
        var me = this,
            dataKey = this.dataKeyName,
            record = this.record;
        me.data = {};
        /*me.customsOrderLineItemStore = Ext.create('Order.view.deliveritems.store.DeliverLineItemStore', {
            params: {
                id: me.record.getId(),
                pageSize: 50,
                pageNumber: 1
            }
        });*/


        me.totalQty = record.get('totalQty');
        var shipmentBoxes = record.get('shipmentBoxes');
        if (Ext.isEmpty(shipmentBoxes)) {
            shipmentBoxes = []
        }

        data = me.data;
        /*me.store = Ext.create('Order.view.deliveritems.store.DeliverLineItemStore', {
            params: {
                id: me.record.getId(),
                pageSize: 50,
                pageNumber: 1
            }
        });*/
        me.store = Ext.create('Order.status.view.deliveritems.store.BoxSizeUnit', {
            data: [{
                '_id': '123',
                'clazz': '123456',
                'items': [{orderItem: 123, qty: 2}, {orderItem: 124, qty: 3}],
                'address': {'email': 'test@qq.com', 'call': 12345698591, 'site': 'SZ 哪里哪里'}
            }, {
                '_id': '1234',
                'clazz': '1234567',
                'items': [{orderItem: 123, qty: 3}, {orderItem: 124, qty: 5}],
                'address': {'email': 'test22@qq.com', 'call': 999999, 'site': 'SZ 这里这里'}
            }]
        })
        //init data
        //data[me.store.getAt(0)[dataKey]] = me.store.getAt(0).data;

        me.addEvents(['productqtychange']);
        me.columns = {
            defaults: {
                sortable: false,
                menuDisabled: true,
                tdCls: 'vertical-middle'
            },
            items: [
                {
                    xtype: 'actioncolumn',
                    menuDisabled: true,
                    sortable: false,
                    width: 50,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: i18n.getKey('edit'),
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                var sortNo = record.get('sortNo');
                                var boxQty = Ext.getCmp('boxQty' + sortNo).getValue();
                                console.log(me.store.data);
                                Ext.create('Order.status.view.shipment.AllOrderLineItem', {
                                    orderId: me.record.get('id'),
                                    record: record,
                                    grid: me,
                                    boxQty: boxQty,
                                    customsOrderLineItemStore: me.customsOrderLineItemStore,
                                    operationType: 'editBox',
                                    allShipmentData: me.store.data
                                }).show();

                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actiondelete',
                            tooltip: i18n.getKey('destroy'),
                            handler: function (view, rowIndex, colIndex, item, e, record) {

                                var store = me.getStore();

                                if (store.getCount() == 1) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), '最少保留一条发货项信息！');
                                    return;
                                }
                                delete data[record[dataKey]];
                                store.remove(record);
                                me.fireEvent('productqtychange', me, me.getPackageQty());
                            },
                            isDisabled: function (view, rowIndex, colIndex, item, record) {
                                return !Ext.isEmpty(record.get('storageId'));
                            }
                        }
                    ]
                },
                {
                    dataIndex: 'address',
                    text: i18n.getKey('address'),
                    width: 320,
                    autoWidthComponents: true,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var email = value.email;
                        var call = value.call;
                        var site = value.site;
                        var items = [
                            {
                                title: i18n.getKey('email'),
                                value: email
                            },
                            {
                                title: i18n.getKey('call'),
                                value: call
                            },
                            {
                                title: i18n.getKey('site'),
                                value: site
                            }];
                        return JSCreateHTMLTable(items);
                    }
                },
                {
                    text: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                        + i18n.getKey('orderLineItemId') + '&nbsp;&nbsp;&nbsp;&nbsp;' + i18n.getKey('product') + i18n.getKey('name') + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + i18n.getKey('qty'),
                    dataIndex: 'items',
                    xtype: 'componentcolumn',
                    width: 310,
                    tdCls: 'vertical-middle',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        var customsProductInfos = Ext.create('Order.status.view.deliveritems.view.ItemListComp', {
                            record: record,
                            shipmentBoxGrid: me,
                            customsProductInfo: value

                        });
                        if (Ext.isEmpty(value)) {
                            return '';
                        } else {
                            return customsProductInfos;
                        }

                    }
                }/*,
                {
                    text: i18n.getKey('enabledDate'),
                    dataIndex: 'date',
                    xtype: 'datecolumn',
                    itemId: 'date',
                    renderer: function (date) {
                        return Ext.Date.format(date, 'Y-m-d');
                    }
                },
                {
                    dataIndex: 'cost',
                    tdCls: 'vertical-middle',
                    flex: 1,
                    text: i18n.getKey('cost')
                }*/
            ]
        };

        me.callParent(arguments);
    },

    getValue: function () {
        var me = this;
        var data = [];
        me.store.data.items.forEach(function (item) {
            var itemData = item.data;
            data.push(itemData);
        });
        return data;
    },

    getPackageQty: function () {
        var me = this,
            i = 0;
        var packageQty = 0;
        var items = me.getStore().data.items;
        Ext.Array.each(items, function (item) {
            Ext.Array.each(item.items, function (orderlineitem) {
                packageQty += orderlineitem.qty;
            })

        });
        return packageQty;
    },
    isValid: function () {
        var me = this;
        if (me.getPackageQty() !== me.record.get('totalQty')) {
            Ext.Msg.alert(i18n.getKey('prompt'), '发货要求产品数量需要等于订单产品数量！');
            return false;
        }
        return true;
    }
})
