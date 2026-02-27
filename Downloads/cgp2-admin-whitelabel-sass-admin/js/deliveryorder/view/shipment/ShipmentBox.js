Ext.define('CGP.deliveryorder.view.shipment.ShipmentBox', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.shipmentbox',
    requires: [
        'CGP.deliveryorder.view.shipment.ShipmentBoxInfo',
        'CGP.deliveryorder.view.shipment.ShipmentBoxGridV2'
    ],

    readOnly: false,

    initComponent: function () {
         var me = this,
            record = this.record;


        me.fieldLabel = i18n.getKey('packageInfo');
        me.items = [{
            xtype: 'shipmentboxinfo',
            record: record,
            readOnly: me.readOnly

        }, {
            xtype: 'shipmentboxgridv2',
            record: record,
            readOnly: me.readOnly

        }];

        me.callParent(arguments);

        me.info = me.down('shipmentboxinfo');
        me.grid = me.down('shipmentboxgridv2');
        me.grid.on('productqtychange', function (grid, qty) {
            me.info.setPackageQty(qty);
        });
        me.grid.fireEvent('productqtychange', me.grid, me.grid.getPackageQty());
    },

    getValue: function () {
        return this.grid.getValue();
    },

    getPackageQty: function () {
        return this.grid.getPackageQty();
    },
    isValid: function () {
        return this.grid.isValid();
    }

})