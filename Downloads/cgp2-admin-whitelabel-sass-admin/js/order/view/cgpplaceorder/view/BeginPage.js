/**
 * Created by nan on 2021/12/10
 */

Ext.define("CGP.order.view.cgpplaceorder.view.BeginPage", {
    extend: 'Ext.panel.Panel',
    alias: 'widget.beginpage',
    itemId: "BeginPage",
    layout: 'column',
    description: i18n.getKey('后台下标准订单'),
    style: {
        marginTop: '10px',
        marginLeft: '20px'
    },
    outTab: null,
    initComponent: function () {
        var me = this;
        me.title = me.description;
        me.outTab = me.ownerCt;
        me.items = [
            {
                xtype: "displayfield",
                width: 350,
                fieldLabel: '后台下单',
                value: "<font color='gray'>" + me.description + "</font>"
            },
            {
                xtype: 'button',
                itemId: 'placeOrder',
                width: 100,
                frame: false,
                //disabled: true,
                text: i18n.getKey('placeOrder'),
                style: {
                    marginLeft: '50px'
                },
                handler: function (btn) {
                    var beginPag = btn.ownerCt;
                    var outTab = beginPag.ownerCt;
                    var createOrEdit = 'create';
                    if (createOrEdit == 'create') {
                        Ext.util.Cookies.clear('cgpOrderItemArr');
                    }
                    var orderItemGrid = outTab.getComponent('orderItemGrid');
                    if (Ext.isEmpty(orderItemGrid)) {
                        orderItemGrid = Ext.create('CGP.order.view.cgpplaceorder.view.OrderItemGrid', {
                            outTab: outTab,
                        });
                        outTab.add(orderItemGrid);
                    }
                    outTab.setActiveTab(orderItemGrid);

                }
            }];
        me.callParent()
    },
});
