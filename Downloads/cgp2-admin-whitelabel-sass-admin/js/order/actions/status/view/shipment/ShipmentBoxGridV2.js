Ext.define('Order.status.view.shipment.ShipmentBoxGridV2', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.shipmentboxgridv2',
    requires: [
        'Order.status.model.ShipmentBox',
        'Order.status.store.ShipmentBox'
    ],
    dataKeyName: 'internalId',
    customsOrderLineItemStore: null,
    initComponent: function () {
        var me = this,
            dataKey = this.dataKeyName,
            record = this.record;
        me.data = {};
        me.customsOrderLineItemStore = Ext.create('Order.status.store.CustomsOrderLineItem', {
            params: {
                id: me.record.getId(),
                pageSize: 50,
                pageNumber: 1
            }
        });

        me.totalQty = record.get('needPackingQty');
        var shipmentBoxes = record.get('shipmentBoxes');
        if (Ext.isEmpty(shipmentBoxes)) {
            shipmentBoxes = []
        }

        data = me.data;
        me.store = Ext.create('Order.status.store.ShipmentBox', {

            data: shipmentBoxes
        });
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
                                    Ext.Msg.alert(i18n.getKey('prompt'), '最少保留一条装箱信息！');
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
                    autoSizeColumn: false,
                    dataIndex: 'sortNo',
                    text: '',
                    itemId: 'rownumberer',
                    width: 20,
                    tdCls: 'vertical-middle'
                },
                {
                    text: i18n.getKey('boxSize') + '(CM)',
                    xtype: 'componentcolumn',
                    width: 180,
                    renderer: function (v, m, r) {
                        return {
                            xtype: 'fieldcontainer',
                            layout: 'column',
                            fieldDefaults: {
                                labelSeparator: ''
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'boxLength',
                                    hideTrigger: true,
                                    value: r.get('boxLength'),
                                    width: 40,
                                    checkChangeBuffer: 1000,
                                    minValue: 1,
                                    allowDecimals: false,
                                    allowExponential: false,//这个有bug只有该配置为false才能生效
                                    listeners: {
                                        blur: function (me) {
                                            r.set('boxLength', me.getValue());
                                        }
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    value: 'X',
                                    width: 15
                                },
                                {
                                    xtype: 'numberfield',
                                    minValue: 1,
                                    allowDecimals: false,
                                    allowExponential: false,//这个有bug只有该配置为false才能生效
                                    name: 'boxWidth',
                                    hideTrigger: true,
                                    value: r.get('boxWidth'),
                                    width: 40,
                                    listeners: {
                                        blur: function (me) {
                                            r.set('boxWidth', me.getValue());
                                        }
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    value: 'X',
                                    width: 15
                                },
                                {
                                    xtype: 'numberfield',
                                    minValue: 1,
                                    allowDecimals: false,
                                    allowExponential: false,//这个有bug只有该配置为false才能生效
                                    name: 'boxHeight',
                                    hideTrigger: true,
                                    value: r.get('boxHeight'),
                                    width: 40,
                                    listeners: {
                                        blur: function (me) {
                                            r.set('boxHeight', me.getValue());
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    dataIndex: 'boxQty',
                    xtype: 'componentcolumn',
                    text: i18n.getKey('boxQty'),
                    width: 70,
                    renderer: function (v, m, r) {
                        var sortNo = r.get('sortNo');
                        return {
                            name: 'boxQty',
                            xtype: 'numberfield',
                            //allowExponential: false,
                            id: 'boxQty' + sortNo,
                            checkChangeBuffer: 1000,
                            minValue: 1,
                            allowDecimals: false,
                            allowExponential: false,//这个有bug只有该配置为false才能生效
                            allowBlank: false,
                            value: v,
                            record: r,
                            boxQtyChangeOverCount: function (value, field) {
                                var customsOrderLineItemStore = field.customsOrderLineItemStore;
                                var record = field.record;
                                var isValid = true;
                                var maxBoxCount = 1;
                                var localBoxStore = record.store;
                                var recordIndex = localBoxStore.indexOf(record);
                                var neetValidProductIds = {};//这个选项中包含的产品，每个产品对应一个单独的orderItemId，不要问为啥是这个名称，我也不知道
                                for (var i = 0; i < record.get('boxProductItems').length; i++) {
                                    var orderItemId = record.get('boxProductItems')[i].orderItemId;
                                    neetValidProductIds[orderItemId] = {
                                        totalCount: 0,//该需装箱产品总数，
                                        packCount: 0,//已装箱产品数量,
                                        qty: record.get('boxProductItems')[i].qty,//数量/箱
                                        changedPackCount: value * record.get('boxProductItems')[i].qty//当前改变后的装箱数量
                                    };
                                    for (var j = 0; j < customsOrderLineItemStore.data.items.length; j++) {
                                        var item = customsOrderLineItemStore.data.items[j]
                                        if (orderItemId == item.get('orderLineItemId')) {
                                            neetValidProductIds[orderItemId].totalCount = item.get('qty');
                                        }
                                    }
                                }
                                for (var i = 0; i < localBoxStore.data.items.length; i++) {
                                    var item = localBoxStore.data.items[i];
                                    if (recordIndex != i) {//其他记录
                                        for (var j = 0; j < item.get('boxProductItems').length; j++) {
                                            var data = item.get('boxProductItems')[j];
                                            if (neetValidProductIds[data.orderItemId]) {//该记录有这产品
                                                neetValidProductIds[data.orderItemId].packCount += item.get('boxQty') * data.qty;
                                            }
                                        }
                                    }
                                }
                                for (var i in neetValidProductIds) {
                                    if (neetValidProductIds[i].totalCount < neetValidProductIds[i].packCount + neetValidProductIds[i].changedPackCount) {

                                        isValid = false;
                                    }

                                }
                                if (isValid == false) {
                                    field.setValue(maxBoxCount);
                                }
                                return isValid;
                            },
                            customsOrderLineItemStore: me.customsOrderLineItemStore,
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    var isValid = field.boxQtyChangeOverCount(newValue, field);
                                    if (isValid == false) {
                                        return;
                                    }
                                    var boxProductItems = r.get('boxProductItems');
                                    var totalWeight = 0;
                                    var productQty = 0;
                                    for (var i = 0; i < boxProductItems.length; i++) {
                                        if (boxProductItems[i].weight) {

                                        } else {
                                            boxProductItems[i]['weight'] = boxProductItems[i].netWeight / boxProductItems[i].qty;
                                        }
                                        var item = boxProductItems[i];
                                        item.netWeight = item.qty * item.weight;
                                        totalWeight += item.netWeight * newValue;
                                        productQty += newValue * item.qty;
                                    }
                                    r.set('boxQty', newValue);
                                    r.set('totalWeight', totalWeight);
                                    r.set('productQty', productQty);
                                    me.fireEvent('productqtychange', me, me.getPackageQty());
                                }
                            }
                        }
                    }
                },
                {
                    text: '<div style="display: inline-block; width: 150px;text-align: center">' + i18n.getKey('tradeName') + '</div>' +
                        '<div style="display: inline-block;width: 80px">' + i18n.getKey('qty') + '/' + i18n.getKey('boxful') + '</div>' +
                        '<div style="display: inline-block;width: 80px">' + i18n.getKey('totalNetWeight') + '(G)</div>',
                    dataIndex: 'boxProductItems',
                    xtype: 'componentcolumn',
                    width: 310,
                    tdCls: 'vertical-middle',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        var customsProductInfos = Ext.create('Order.status.view.shipment.CustomsProductInfoForm', {
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
                },
                {
                    dataIndex: 'totalWeight',
                    xtype: 'componentcolumn',
                    tdCls: 'vertical-middle',
                    flex: 1,
                    text: i18n.getKey('totalGrossWeight') + '(G)',
                    renderer: function (value, m, r) {
                       ;
                        return {
                            name: 'totalWeight',
                            xtype: 'numberfield',
                            allowExponential: false,
                            allowBlank: false,
                            width: 45,
                            value: value,
                            hideTrigger: true,
                            listeners: {
                                blur: function (me) {
                                    r.set('totalWeight', me.getValue());
                                }
                            }
                        }
                    }
                }
            ]
        };

        me.callParent(arguments);
    },

    getValue: function () {
        var me = this;
        var data = [];
        me.store.data.items.forEach(function (item) {
            var itemData = item.data;
            itemData.productWeight = 0;
            Ext.Array.each(itemData.boxProductItems, function (boxProductItem) {
                itemData.productWeight += itemData.boxQty * boxProductItem.netWeight;
            })
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
            packageQty += item.get('productQty');
        });
        return packageQty;
    },
    isValid: function () {
        var me = this;
        if (me.getPackageQty() !== me.record.get('needPackingQty')) {
            Ext.Msg.alert(i18n.getKey('prompt'), '所有产品必须完成装箱');
            return false;
        }
        return true;
    }
})
