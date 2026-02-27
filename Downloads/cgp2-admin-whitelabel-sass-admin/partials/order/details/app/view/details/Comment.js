Ext.define('CGP.orderdetails.view.details.Comment', {
    extend: 'Ext.container.Container',

    setValue: function (order) {

        var me = this, html,remark = order.get('remark');
        if (!Ext.isEmpty(remark)) {
            //html = remark.join("<br/>");
            me.update(remark);
        } else {
            me.setVisible(false);
        }
    }
});