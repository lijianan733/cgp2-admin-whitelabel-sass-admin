Ext.define('CGP.deliveryorder.view.shipment.AllOrderLineItem', {

    extend: 'Ext.window.Window',
    requires: [
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
        var store = me.customsOrderLineItemStore;
        var productItems = me.record.get('productItems');
        Ext.Array.each(productItems, function (item) {
            if(item.orderItem){
                item.orderItemId = item.orderItem._id;
            }
        });
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
                    Ext.Array.each(productItems, function (item) {
                        if (item.orderItemId == orderLineItemId) {
                            thisBoxQty = item.qty * me.boxQty;
                        }
                    });
                    var boxedQty = 0;
                    var allShipmentDataItems = me.allShipmentData.items;
                    Ext.Array.each(allShipmentDataItems, function (item) {
                        Ext.Array.each(item.get('productItems'), function (boxProductItem) {
                            if(boxProductItem.orderItem){
                                boxProductItem.orderItemId = boxProductItem.orderItem._id;
                            }
                            if (boxProductItem.orderItemId == orderLineItemId) {
                                boxedQty += boxProductItem.qty * item.get('boxQty');
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
                    Ext.Array.each(productItems, function (item) {
                        if (item.orderItemId == orderLineItemId) {
                            thisBoxQty = item.qty * me.boxQty;
                        }
                    });
                    var boxedQty = 0;
                    var allShipmentDataItems = me.allShipmentData.items;
                    Ext.Array.each(allShipmentDataItems, function (item) {
                        Ext.Array.each(item.get('productItems'), function (boxProductItem) {
                            if(boxProductItem.orderItem){
                                boxProductItem.orderItemId = boxProductItem.orderItem._id;
                            }
                            if (boxProductItem.orderItemId == orderLineItemId) {
                                boxedQty += boxProductItem.qty * item.get('boxQty');
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
                Ext.Array.each(productItems, function (item) {
                    if (item.orderItemId == orderLineItemId) {
                        thisBoxQty = item.qty * me.boxQty;
                    }
                });
                var boxedQty = 0;
                var notBox = 0;
                var allShipmentDataItems = me.allShipmentData.items;
                if (Ext.isEmpty(allShipmentDataItems)) {
                    return totalQty;
                }
                Ext.Array.each(allShipmentDataItems, function (item, index) {
                    Ext.Array.each(item.get('productItems'), function (boxProductItem) {
                        if(boxProductItem.orderItem){
                            boxProductItem.orderItemId = boxProductItem.orderItem._id;
                        }
                        if (boxProductItem.orderItemId == orderLineItemId) {
                            boxedQty += boxProductItem.qty * item.get('boxQty');
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
                    dataIndex: 'productDTO',
                    width: 80,
                    tdCls: 'vertical-middle',
                    itemId: 'productDTO',
                    text: i18n.getKey('weight') + 'g',
                    renderer: function (v, m, r) {
                        return v.weight;
                    }
                },
                {
                    width: 80,
                    tdCls: 'vertical-middle',
                    text: '箱数量',
                    renderer: function (v, m, r) {
                        return me.boxQty;
                    }
                },
                {
                    //dataIndex: 'binningQty',
                    dataIndex: 'productDTO',
                    xtype: 'componentcolumn',
                    width: 130,
                    sortable: false,
                    tdCls: 'vertical-middle',
                    text: i18n.getKey('每箱数'),//i18n.getKey('binningQty'),
                    renderer: function (v, m, r, row, col, store, view) {
                       ;
                        var orderLineItemId = r.get('orderLineItemId');
                        var thisBoxQty = null;
                        var unBoxUpCount = view.ownerCt.getUnBoxUpCount(r);
                        Ext.Array.each(productItems, function (item) {
                            if (item.orderItemId == orderLineItemId) {
                                thisBoxQty = item.qty;
                            }
                        });
                        return {
                            xtype: 'fieldcontainer',
                            layout: 'column',
                            columns: 3,
                            fieldDefaults: {
                                labelSeparator: ''
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    width: 60,
                                    minValue: 1,
                                    allowDecimals: false,
                                    allowExponential: false,
                                    checkChangeBuffer: 1000,
                                    maxValue: r.get('qty'),
                                    id: 'expectQty' + orderLineItemId,
                                    fieldLabel: false,
                                    listeners: {
                                        afterrender: function (comp) {
                                            if (thisBoxQty) {
                                                comp.setValue(thisBoxQty);
                                            } else {
                                                if (me.boxQty != 1) {

                                                } else {
                                                    comp.setValue(unBoxUpCount);
                                                }
                                            }
                                        },
                                        change: function (comp, newValue) {
                                            var orderLineItemId = r.get('orderLineItemId');
                                            var thisBoxQty = 0;
                                            var totalQty = r.get('qty');
                                            Ext.Array.each(productItems, function (item) {
                                                if (item.orderItemId == orderLineItemId) {
                                                    thisBoxQty = item.qty * me.boxQty;
                                                }
                                            });
                                            var boxedQty = 0;
                                            var notBox = 0;
                                            var allShipmentDataItems = me.allShipmentData.items;
                                            if (Ext.isEmpty(allShipmentDataItems)) {
                                                return totalQty;
                                            }
                                            Ext.Array.each(allShipmentDataItems, function (item, index) {
                                                Ext.Array.each(item.get('productItems'), function (boxProductItem) {
                                                    if(boxProductItem.orderItem){
                                                        boxProductItem.orderItemId = boxProductItem.orderItem._id;
                                                    }
                                                    if (boxProductItem.orderItemId == orderLineItemId) {
                                                        boxedQty += boxProductItem.qty * item.get('boxQty');
                                                    }
                                                });
                                                if (allShipmentDataItems.length == index + 1) {
                                                    notBox = totalQty - boxedQty + thisBoxQty;
                                                }
                                            });
                                            if (newValue * me.boxQty > notBox) {
                                                comp.setValue(0);
                                            }
                                        }
                                    }
                                }
                            ]
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
                    flex: 1,
                    tdCls: 'vertical-middle',
                    text: i18n.getKey('已装箱数'),
                    renderer: function (v, m, r) {
                        var orderLineItemId = r.get('orderLineItemId');
                        var thisBoxQty = 0;
                        var totalQty = r.get('qty');
                        var allShipmentDataItems = me.allShipmentData.items;
                        Ext.Array.each(productItems, function (item) {
                            if (item.orderItemId == orderLineItemId) {
                                thisBoxQty = item.qty * me.boxQty;
                            }
                        });
                        var boxedQty = 0;
                        Ext.Array.each(allShipmentDataItems, function (item, index) {
                            Ext.Array.each(item.get('productItems'), function (boxProductItem) {
                                if(boxProductItem.orderItem){
                                    boxProductItem.orderItemId = boxProductItem.orderItem._id;
                                }
                                if (boxProductItem.orderItemId == orderLineItemId) {
                                    boxedQty += boxProductItem.qty * item.get('boxQty');
                                }
                            });
                        });
                        return boxedQty - thisBoxQty;
                    }
                },
                {
                    dataIndex: 'qty',
                    flex: 1,
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
                    Ext.Msg.alert('提示', '请选择产品！');
                    return;
                }
                if (me.operationType == 'editBox') {
                    var productItems = [];
                    var productQty = 0;
                    var productWeight = 0;
                    var isAlonePacking = false;
                    Ext.Array.each(selectData, function (item) {
                        var boxProductItem = {};
                        if (item.get('alonePacking') && selectData.length > 1) {
                            isAlonePacking = true;
                            Ext.Msg.alert('提示', '“' + item.get('outName') + '”' + '需要独立装箱！');
                            return false;
                        }
                        boxProductItem.orderItemId = item.get('orderLineItemId');
                        boxProductItem.orderItem = {
                            _id: item.get('orderLineItemId'),
                            clazz: 'com.qpp.cgp.domain.order.OrderLineItem'
                        };
                        boxProductItem.qty = Ext.getCmp('expectQty' + item.get('orderLineItemId')).getValue();
                        boxProductItem.netWeight = boxProductItem.qty * (item.get('productDTO').weight);
                        productWeight += boxProductItem.qty * me.boxQty * (item.get('productDTO').weight);
                        boxProductItem.outName = item.get('outName');
                        boxProductItem.productName = item.get('productDTO').name;
                        boxProductItem.clazz = 'com.qpp.cgp.domain.order.BoxProductItem';

                        /*if(Ext.isEmpty(item.get('outName'))){
                         boxProductItem.outName = item.get('productDTO').name;
                         }*/
                        productQty += boxProductItem.qty * me.boxQty;
                        productItems.push(boxProductItem)
                    });
                    if (isAlonePacking && selectData.length > 1) {
                        return;
                    }
                    var totalWeight = null;
                    for (var i = 0; i < productItems.length; i++) {
                        totalWeight += productItems[i].netWeight * me.boxQty;
                    }
                    me.record.set('productWeight', productWeight);
                    me.record.set('productQty', productQty);
                    me.record.set('productItems', productItems);
                    me.record.set('totalWeight', totalWeight);

                } else if (me.operationType == 'productOneCarton') {
                    var gridStore = me.grid.getStore();
                    var sortNo = 0;
                    if (gridStore.getCount() != 0) {
                        sortNo = gridStore.getAt(gridStore.getCount() - 1).get('sortNo');
                    }

                    Ext.Array.each(selectData, function (item, index) {
                        var boxProductItem = {};
                        var productItems = [];
                        var productQty = 0;
                        boxProductItem.orderItemId = item.get('orderLineItemId');
                        boxProductItem.orderItem = {
                            _id: item.get('orderLineItemId'),
                            clazz: 'com.qpp.cgp.domain.order.OrderLineItem'
                        };
                        boxProductItem.qty = Ext.getCmp('expectQty' + item.get('orderLineItemId')).getValue();
                        boxProductItem.netWeight = boxProductItem.qty * me.boxQty * (item.get('productDTO').weight);
                        boxProductItem.outName = item.get('outName');
                        boxProductItem.productName = item.get('productDTO').name;
                        boxProductItem.clazz = 'com.qpp.cgp.domain.order.BoxProductItem';
                        /*if(Ext.isEmpty(item.get('outName'))){
                         boxProductItem.outName = item.get('productDTO').name;
                         }*/
                        productQty += boxProductItem.qty * me.boxQty;
                        productItems.push(boxProductItem);
                        var boxModel = CGP.deliveryorder.model.ShipmentBox.create({
                            sortNo: sortNo + index + 1,
                            boxQty: 1,
                            productQty: productQty,
                            productItems: productItems,
                            productWeight: boxProductItem.netWeight,
                            totalWeight: boxProductItem.netWeight
                        });
                        gridStore.add(boxModel);
                    })
                }
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
