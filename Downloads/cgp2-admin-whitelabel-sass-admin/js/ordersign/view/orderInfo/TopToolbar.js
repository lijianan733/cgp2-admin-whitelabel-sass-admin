Ext.syncRequire([
    'CGP.ordersign.controller.Controller',
])
Ext.define('CGP.ordersign.view.orderInfo.TopToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.top_toolbar',
    width: '100%',
    border: false,
    orderId: null,
    queryResult: null,
    orderNumber: null,
    bindOrderId: null,
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.ordersign.controller.Controller');
        me.items = [
            {
                xtype: 'button',
                itemId: 'save',
                margin: '0 0 0 30',
                iconCls: 'icon_save',
                text: i18n.getKey('save'),
                handler: function (btn) {
                    var result = {},
                        panel = btn.ownerCt.ownerCt.ownerCt,
                        items = panel.items.items,
                        method = me.queryResult ? 'PUT' : 'POST',
                        url = adminPath + 'api/partner/salesOrders/' + me.bindOrderId;

                    // 获取表单数据
                    items.forEach(item => item.diyGetValue() && (result = Ext.Object.merge(result, item.diyGetValue())))
                    result['bindOrderId'] = (me.orderId).toString();
                    result['orderId'] = me.bindOrderId;
                    controller.JSOrderInfoRequest(url, method, Ext.Object.merge(me.queryResult, result));
                }
            },
            {
                xtype: 'button',
                itemId: 'return',
                iconCls: 'icon_arrow_undo',
                margin: '0 0 0 15',
                text: i18n.getKey('return'),
                handler: function () {
                    window.parent.Ext.getCmp('tabs').remove('orderInfo') //id
                }
            }
        ]
        me.callParent();
    },
    diyGetValue: Ext.emptyFn
})