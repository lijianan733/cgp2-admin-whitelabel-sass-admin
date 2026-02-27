Ext.define('CGP.orderlineitem.view.status.view.shipment.ShipmentBox', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.shipmentbox',
    requires: [
        'CGP.orderlineitem.view.status.view.shipment.ShipmentBoxInfo',
        'CGP.orderlineitem.view.status.view.shipment.ShipmentBoxGrid'
    ],


    initComponent: function () {
         var me = this,
            record = this.record;


        me.fieldLabel = i18n.getKey('packageInfo');
        me.items = [{
            xtype: 'shipmentboxinfo',
            record: record
        }, {
            xtype: 'shipmentboxgrid',
            record: record
        }];

        me.callParent(arguments);

        me.info = me.down('shipmentboxinfo');
        me.grid = me.down('shipmentboxgrid');
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