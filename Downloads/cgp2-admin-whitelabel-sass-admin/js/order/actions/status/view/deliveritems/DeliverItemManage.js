Ext.define('Order.status.view.deliveritems.DeliverItemManage', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.deliveritemcomp',
    requires: [
        'Order.status.view.deliveritems.DeliverGridTool',
        'Order.status.view.deliveritems.DeliverItemGrid'
    ],


    initComponent: function () {
        var me = this,
            record = this.record;


        me.fieldLabel = i18n.getKey('packageInfo');
        me.items = [{
            xtype: 'delivergridtool',
            record: record
        }, {
            xtype: 'deliveritemgrid',
            record: record
        }];

        me.callParent(arguments);

        me.info = me.down('delivergridtool');
        me.grid = me.down('deliveritemgrid');
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