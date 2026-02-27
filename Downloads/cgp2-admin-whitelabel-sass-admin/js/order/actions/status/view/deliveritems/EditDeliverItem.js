Ext.define('Order.actions.status.view.deliveritems.EditDeliverItem', {

    extend: 'Ext.window.Window',
    requires: [
        'Order.status.store.CustomsOrderLineItem',
        'Ext.ux.grid.Panel'
    ],
    width: 850,
    height: 600,
    //autoScroll: true,
    layout: 'fit',
    modal: true,
    title: '装箱产品',
    operationType: '',//编辑单个装箱信息(editBox)、产品装一箱(productOneCarton)
    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.order.store.OrderLineItem', {
            params: {
                id: me.orderId,
                pageSize: 50,
                pageNumber: 1
            }
        });
        var ShipmentItems = me.record.get('items');
        var gridPanel = Ext.create('Ext.ux.grid.Panel', {
            store: store,
            itemId: 'grid',
            pagingBar: false,
            selModel: {
                selType: 'checkboxmodel',
                mode: 'SIMPLE',
                //checkOnly: true,
                renderer: function (v, p, record) {
                    var orderLineItemId = record.get('orderLineItemId');
                    var thisBoxQty = 0;
                    var totalQty = record.get('qty');
                    Ext.Array.each(ShipmentItems, function (item) {
                        if (item.orderItemId == orderLineItemId) {
                            thisBoxQty = item.qty;
                        }
                    });
                    var boxedQty = 0;
                    var allShipmentDataItems = me.allShipmentData.items;
                    Ext.Array.each(allShipmentDataItems, function (item) {
                        Ext.Array.each(item.get('boxProductItems'), function (boxProductItem) {
                            if (boxProductItem.orderItemId == orderLineItemId) {
                                boxedQty += boxProductItem.qty;
                            }
                        })
                    });
                    if (totalQty - boxedQty + thisBoxQty != 0) {
                        return '<div class="x-grid-row-checker"> </div>';
                    } else {
                        return '';
                    }
                }
            },
            listeners: {
                beforeselect: function (grid, record, index, eOpts) {
                    var orderLineItemId = record.get('orderLineItemId');
                    var thisBoxQty = 0;
                    var totalQty = record.get('qty');
                    Ext.Array.each(ShipmentItems, function (item) {
                        if (item.orderItemId == orderLineItemId) {
                            thisBoxQty = item.qty;
                        }
                    });
                    var boxedQty = 0;
                    var allShipmentDataItems = me.allShipmentData.items;
                    Ext.Array.each(allShipmentDataItems, function (item) {
                        Ext.Array.each(item.get('boxProductItems'), function (boxProductItem) {
                            if (boxProductItem.orderItemId == orderLineItemId) {
                                boxedQty += boxProductItem.qty;
                            }
                        })
                    });
                    if (totalQty - boxedQty + thisBoxQty == 0) {
                        return false;
                    }
                }

            },
            editAction: false,
            deleteAction: false,
            defaults: {
                tdCls: 'vertical-middle'
            },
            /**
             * 获取到未装箱的数量
             * @param record
             * @returns {*}
             */
            getUnBoxUpCount: function (record) {
                var orderLineItemId = record.get('orderLineItemId');
                var thisBoxQty = 0;
                var totalQty = record.get('qty');
                Ext.Array.each(me.record.get('items'), function (item) {
                    if (item.orderItem == orderLineItemId) {
                        thisBoxQty = item.qty;
                    }
                });
                var boxedQty = 0;
                var notBox = 0;
                var allShipmentDataItems = me.allShipmentData.items;
                if (Ext.isEmpty(allShipmentDataItems)) {
                    return totalQty;
                }
                Ext.Array.each(allShipmentDataItems, function (item, index) {
                    Ext.Array.each(item.get('items'), function (boxProductItem) {
                        if (boxProductItem.orderItem == orderLineItemId) {
                            boxedQty += boxProductItem.qty;
                        }
                    });
                    if (allShipmentDataItems.length == index + 1) {
                        notBox = totalQty - boxedQty + thisBoxQty;
                    }
                });
                return notBox;
            },
            columns: [
                {
                    xtype: 'rownumberer',
                    //autoSizeColumn: false,
                    itemId: 'rownumberer',
                    width: 20,
                    /*resizable: true,
                     menuDisabled: true,*/
                    tdCls: 'vertical-middle'
                },
                {
                    dataIndex: 'outName',
                    width: 200,
                    itemIDd: 'outName',
                    tdCls: 'vertical-middle',
                    text: i18n.getKey('product') + i18n.getKey('info'),
                    renderer: function (v, m, r) {
                        var product = r.get('productDTO');
                        var size = r.get('sizeDesc');
                        if (!Ext.isEmpty(v)) {
                            return v + '\n' + size;
                        } else {
                            return product.name;
                        }
                    }
                },
                {
                    dataIndex: 'weight1',
                    width: 80,
                    tdCls: 'vertical-middle',
                    text: i18n.getKey('未装箱数'),
                    renderer: function (v, m, r, row, col, store, view) {
                        return view.ownerCt.getUnBoxUpCount(r);
                    }
                },
                {
                    dataIndex: 'qty',
                    width: 80,
                    tdCls: 'vertical-middle',
                    text: i18n.getKey('已装箱数'),
                    renderer: function (v, m, r) {
                        var orderLineItemId = r.get('orderLineItemId');
                        var thisBoxQty = 0;
                        var totalQty = r.get('qty');
                        var allShipmentDataItems = me.allShipmentData.items;
                        Ext.Array.each(me.record.get('items'), function (item) {
                            if (item.orderItemId == orderLineItemId) {
                                thisBoxQty = item.qty;
                            }
                        });
                        var boxedQty = 0;
                        Ext.Array.each(allShipmentDataItems, function (item, index) {
                            Ext.Array.each(item.get('items'), function (boxProductItem) {
                                if (boxProductItem.orderItemId == orderLineItemId) {
                                    boxedQty += boxProductItem.qty;
                                }
                            });
                        });
                        return boxedQty - thisBoxQty;
                    }
                },
                {
                    dataIndex: 'qty',
                    width: 80,
                    tdCls: 'vertical-middle',
                    text: i18n.getKey('总数')
                }
            ]


        });
        me.items = [gridPanel];
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('confirm'),
            iconCls: 'icon_agree',
            handler: function () {
                var selectData = gridPanel.getSelectionModel().getSelection();
                if (Ext.isEmpty(selectData)) {
                    Ext.Msg.alert('提示', '请选择订单项！');
                    return;
                }
                var boxProductItems = [];
                var productQty = 0;
                var isAlonePacking = false;
                Ext.Array.each(selectData, function (item) {
                    var boxProductItem = {};
                    boxProductItem.orderItem = item.get('orderLineItemId');
                    boxProductItem.qty = Ext.getCmp('expectQty' + item.get('orderLineItemId')).getValue();
                    boxProductItem.clazz = 'com.qpp.cgp.domain.order.BoxProductItem';

                    /*if(Ext.isEmpty(item.get('outName'))){
                     boxProductItem.outName = item.get('productDTO').name;
                     }*/
                    boxProductItems.push(boxProductItem)
                });
                if (isAlonePacking && selectData.length > 1) {
                    return;
                }
                me.record.set('productQty', productQty);
                me.record.set('items', boxProductItems);
                me.grid.fireEvent('productqtychange', me.grid, me.grid.getPackageQty());
                me.close();
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function () {
                me.close();
            }
        }];
        me.callParent(arguments);
    }
});
