Ext.define('CGP.deliveryorder.view.shipment.ShipmentBoxInfo', {
    extend: 'Ext.container.Container',
    alias: 'widget.shipmentboxinfo',
    requires: [
        'CGP.deliveryorder.model.ShipmentBox'
    ],


    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        labelAlign: 'right'
    },
    readOnly: false,
    initComponent: function () {
        var me = this,
            record = this.record;
        var customsOrderLineItems = me.getCustomsOrderLineItems();
        me.customsOrderLineItemStore = Ext.create('Ext.data.Store', {
            fields: [{
                name: 'orderLineItemId',
                type: 'int'
            }, {
                name: 'alonePacking',
                type: 'boolean'
            }, {
                name: 'outName',
                type: 'string'
            }, {
                name: 'sizeDesc',
                type: 'string'
            }, {
                name: 'productDTO',
                type: 'object'
            }, {
                name: 'qty',
                type: 'int'
            }, {
                name: 'unBoxUpCount',
                type: 'int'
            }, {
                name: 'clazz',
                type: 'string',
                defaultValue: 'com.qpp.cgp.domain.shipment.ShipmentBoxProductItem'
            }],
            proxy: 'memory',
            data: customsOrderLineItems
        });
        me.items = [{
            xtype: 'displayfield',
            fieldLabel: i18n.getKey('productQty'),
            value: record.get('needPackingQty'),
            renderer: function (v) {
                return '<font color="red" style="font-weight:bold;font-size:17px">' + v + '</font>'
            }
        }, {
            xtype: 'displayfield',
            fieldLabel: i18n.getKey('已') + i18n.getKey('packageQty'),
            value: 0,
            margin: '0 0 0 30',
            itemId: 'packageQty',
            renderer: function (v) {
                return '<font color="red" style="font-weight:bold;font-size:17px">' + v + '</font>'
            }
        }, {
            xtype: 'displayfield',
            fieldLabel: i18n.getKey('notPackageQty'),
            value: record.get('needPackingQty'),
            margin: '0 0 0 30',
            itemId: 'notPackageQty',
            renderer: function (v) {
                return '<font color="red" style="font-weight:bold;font-size:17px">' + v + '</font>'
            }
        }, {
            xtype: 'button',
            margin: '0 0 0 30',
            disabled: me.readOnly,
            text: i18n.getKey('add') + i18n.getKey('装箱'),
            handler: function () {
                var boxGrid = me.ownerCt.grid;
                var gridStore = boxGrid.getStore();
                var sortNo = 0;
                if (gridStore.getCount() != 0) {
                    sortNo = gridStore.getAt(gridStore.getCount() - 1).get('sortNo');
                }
                /*var boxModel = Ext.ModelManager.getModel('CGP.deliveryorder.model.ShipmentBox',{
                    sortNo: sortNo
                });*/
                var boxModel = CGP.deliveryorder.model.ShipmentBox.create({
                    sortNo: sortNo + 1,
                    boxQty: 1
                });
                gridStore.add(boxModel);
            },
            itemId: 'addButton'
        }, {
            xtype: 'button',
            margin: '0 0 0 30',
            disabled: me.readOnly,
            text: i18n.getKey('产品单独装一箱'),
            handler: function () {
                var boxGrid = me.ownerCt.grid;
                var gridStore = boxGrid.getStore();
                var sortNo = 0;
                if (gridStore.getCount() != 0) {
                    sortNo = gridStore.getAt(gridStore.getCount() - 1).get('sortNo');
                }
                var boxModel = CGP.deliveryorder.model.ShipmentBox.create({
                    sortNo: sortNo + 1,
                    boxQty: 1
                });
                Ext.create('CGP.deliveryorder.view.shipment.AllOrderLineItem', {
                    orderId: me.record.get('id'),
                    record: boxModel,
                    grid: boxGrid,
                    customsOrderLineItemStore: me.customsOrderLineItemStore,
                    boxQty: 1,
                    operationType: 'productOneCarton',
                    allShipmentData: gridStore.data
                }).show();
            },
            itemId: 'productBinning'
        }];

        me.callParent(arguments);
        me.packageQtyField = me.getComponent('packageQty');
        me.notPackageQtyField = me.getComponent('notPackageQty');

    },
    setPackageQty: function (qty) {
        var me = this,
            record = this.record;
        me.packageQtyField.setValue(qty);
        me.notPackageQtyField.setValue(record.get('needPackingQty') - qty);
    },
    getCustomsOrderLineItems: function () {
        var me = this;
        var resultArr = [];
        var items = me.record.get('items');
        Ext.Array.each(items, function (item) {
            var result = {
                orderLineItemId: item.orderItem._id,
                qty: item.qty,
                productDTO: {
                    name: item.orderItem.productName,
                    weight: item.orderItem.productWeight
                },
                alonePacking: item.orderItem.alonePacking
            };
            resultArr.push(result);
        })
        return resultArr;
    }
})
