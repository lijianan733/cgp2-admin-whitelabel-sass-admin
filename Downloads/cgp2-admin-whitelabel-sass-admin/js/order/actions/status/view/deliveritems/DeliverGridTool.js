Ext.define('Order.status.view.deliveritems.DeliverGridTool', {
    extend: 'Ext.container.Container',
    alias: 'widget.delivergridtool',
    requires: [
        'Order.status.model.ShipmentBox'
    ],


    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        labelAlign: 'right'
    },

    initComponent: function () {
        var me = this,
            record = this.record;

        me.items = [{
            xtype: 'displayfield',
            fieldLabel: i18n.getKey('productQty'),
            value: record.get('totalQty'),
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
            text: i18n.getKey('add') + i18n.getKey('发货项'),
            handler: function () {
                var boxGrid = me.ownerCt.grid;
                var gridStore = boxGrid.getStore();

            },
            itemId: 'addButton'
        }/*, {
            xtype: 'button',
            margin: '0 0 0 30',
            text: i18n.getKey('所有产品统一'),
            handler: function () {
                var boxGrid = me.ownerCt.grid;
                var gridStore = boxGrid.getStore();
                var sortNo = 0;
                if (gridStore.getCount() != 0) {
                    sortNo = gridStore.getAt(gridStore.getCount() - 1).get('sortNo');
                }
                var boxModel = Order.status.model.ShipmentBox.create({
                    sortNo: sortNo + 1,
                    boxQty: 1
                });
                Ext.create('Order.status.view.shipment.AllOrderLineItem', {
                    orderId: me.record.get('id'),
                    record: boxModel,
                    grid: boxGrid,
                    boxQty: 1,
                    operationType: 'productOneCarton',
                    allShipmentData: gridStore.data
                }).show();
            },
            itemId: 'productBinning'
        }*/];

        me.callParent(arguments);
        me.packageQtyField = me.getComponent('packageQty');
        me.notPackageQtyField = me.getComponent('notPackageQty');

    },
    setPackageQty: function (qty) {
        var me = this,
            record = this.record;
        me.packageQtyField.setValue(qty);
        me.notPackageQtyField.setValue(record.get('needPackingQty') - qty);
    }
})
