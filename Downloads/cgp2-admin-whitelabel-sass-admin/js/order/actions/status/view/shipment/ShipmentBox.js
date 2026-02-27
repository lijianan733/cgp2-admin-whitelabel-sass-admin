Ext.define('Order.status.view.shipment.ShipmentBox', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.shipmentbox',
    requires: [
        'Order.status.view.shipment.ShipmentBoxInfo',
        'Order.status.view.shipment.ShipmentBoxGridV2'
    ],


    initComponent: function () {
        var me = this,
            record = this.record;

        me.fieldLabel = i18n.getKey('packageInfo');
        //当排除了外派生产的产品后,需装箱产品数量为0,则不需要显示
        me.hidden = record.get('needPackingQty') == 0;
        me.items = [{
            xtype: 'shipmentboxinfo',
            record: record
        }, {
            xtype: 'shipmentboxgridv2',
            record: record
        }];

        me.callParent();

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
    },
    /**
     *当排除了外派生产的产品后,需装箱产品数量为0,则不需要显示
     */
    setVisible: function () {
        var me = this;
        if (me.record.get('needPackingQty') == 0) {
            me.hide();
            return;
        } else {
            me.callParent(arguments)
        }
    }

})