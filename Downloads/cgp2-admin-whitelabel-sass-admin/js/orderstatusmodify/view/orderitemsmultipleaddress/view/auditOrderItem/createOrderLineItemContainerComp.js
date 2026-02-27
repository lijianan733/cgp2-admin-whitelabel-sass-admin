/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.Loader.setPath({
    enabled: true,
    "CGP.orderdetails": path + "partials/order/details/app"
});
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.ShipmentInfoItem',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.splitBarTitle',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.auditOrderItem.createOrderLineItemComp'
])
//订单项信息
Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.auditOrderItem.createOrderLineItemContainerComp', {
    extend: 'Ext.form.Panel',
    alias: 'widget.order_line_item_container',
    bodyStyle: 'border-top:0;border-color:white;',
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
    },
    margin: '5 0 50 0',
    store: null,
    isLock: null,
    orderRecord: null,
    initComponent: function () {
        const me = this,
            controller = Ext.create('CGP.orderstatusmodify.view.orderitemsmultipleaddress.controller.Controller');

        me.items = [
            {
                xtype: 'splitBarTitle',
                title: '订单项信息'
            },
            {
                xtype: 'container',
                width: '100%',
                margin: '5 0 5 20',
                layout: 'fit',
                defaultType: 'displayfield',
                itemId: 'container',
                minHeight: 370,
                defaults: {
                    width: '50%',
                    margin: '5 0 5 20',
                },
                items: [
                    {
                        xtype: 'order_line_item',
                        width: '100%',
                        itemId: 'orderItem',
                        pageType: 'auditOrderItem',
                        store: me.store,
                        isLock: me.isLock,
                        orderRecord: me.orderRecord,
                    },
                ]
            },
        ];
        me.callParent();
    },
})