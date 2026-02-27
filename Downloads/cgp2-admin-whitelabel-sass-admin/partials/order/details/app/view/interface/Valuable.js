Ext.define('CGP.orderdetails.view.interface.Valuable', {

    setValue: function (order) {
        var me = this;
        me.order = order;
        if (me.setEditable) {
            me.setEditable(order);
        }
        me.items.each(function (item) {
            item.setValue(order.get(item.name));
        });
    },
    getValue: function () {
        var me = this;
        if (me.sync)
            me.sync();
        var value = {};
        me.items.each(function (item) {
            value[item.name] = item.getValue();
        });
        return value;
    }

})