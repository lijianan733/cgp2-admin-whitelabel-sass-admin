Ext.define('CGP.order.view.delivery.ListField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.deliveryfield',
    requires: [
        'CGP.order.view.delivery.List'
    ],

    /*height: 300,
    autoScroll: true,*/
    initComponent: function () {
        var me = this;


        me.fieldLabel = false;
        me.items = [{
            xtype: 'deliverylist',
            orderIds: this.orderIds
        }];

        me.callParent(arguments);
        me.grid = me.down('grid');
    },

    getValue: function () {
        var me = this,
            grid = this.grid;
        var data = [];
        grid.store.each(function (r) {
            var d = r.getData();
            d.deliveryDate = r.get('deliveryDate').getTime();
            data.push(d);
        });
        return data;
    }
})