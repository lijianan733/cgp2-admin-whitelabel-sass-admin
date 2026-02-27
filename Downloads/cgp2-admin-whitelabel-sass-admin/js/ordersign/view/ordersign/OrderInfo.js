Ext.syncRequire([
    'CGP.ordersign.controller.Controller'
])
Ext.define('CGP.ordersign.view.ordersign.OrderInfo', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.order_info',
    width: '100%',
    border: '1 0 0 0',
    queryData: null,
    layout: {
        type: 'table',
        columns: 2
    },
    defaults: {
        xtype: 'displayfield',
        margin: '5 20 5 40',
        labelWidth: 70,
    },
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.ordersign.controller.Controller');
        var id = me.queryData['id'];
        var orderNumber = me.queryData['orderNumber'];
        me.items = [
            {
                fieldLabel: i18n.getKey('订单号'),
                name: 'orderNumber',
                itemId: 'orderNumber',
                renderer: function (value) {
                    return value ? '<a href="#">' + controller.removeStringStyle(value) + '</a>' : '未查询到信息';
                },
                listeners: {
                    render: function (display) {
                        var me = this;
                        display.getEl().on("click", () => me.getValue() && JSOpen({
                            id: 'orderDetails',
                            url: path + 'partials/orderitemsmultipleaddress/main.html?id=' + id + '&orderNumber=' + orderNumber,
                            title: i18n.getKey('订单详情') + `(订单号:${i18n.getKey(orderNumber)})`,
                            refresh: true
                        }));
                    }
                }
            },
            {
                fieldLabel: i18n.getKey('关联订单号'),
                name: 'bindOrders',
                itemId: 'bindOrderNumber',
                renderer: function (value) {
                    var bindOrderId,orderNumber;
                    var bindOrders = JSON.parse(value);
                    if (bindOrders[0]) {
                        bindOrderId = bindOrders[0]['_id'];
                        orderNumber = bindOrders[0].orderNumber;
                    }
                    return bindOrderId ? '<a href="#">' + orderNumber + '</a>' : (orderNumber || '未查询到信息');
                },
                listeners: {
                    render: function (display) {
                        var me = this;
                        var bindOrders = JSON.parse(me.getValue());

                        function JSOpenWin() {
                            var bindOrderId = bindOrders[0][['_id']];
                            var orderNumber = bindOrders[0].orderNumber;
                            JSOpen({
                                id: 'orderInfo',
                                url: path + 'partials/ordersign/OrderInfo.html?bindOrderId=' + bindOrderId + '&orderNumber=' + orderNumber  + '&id=' + id,
                                title: i18n.getKey('业务网站销售信息') + `(关联订单号:${i18n.getKey(orderNumber)})`,
                                refresh: true
                            })
                        }

                        display.getEl().on("click", () => (bindOrders[0]?.orderNumber) && JSOpenWin());
                    },
                },
            },
            {
                fieldLabel: i18n.getKey('下单日期'),
                name: 'datePurchased',
                renderer: (value) => controller.getTime(value)
            },
            {
                fieldLabel: i18n.getKey('关联订单下单日期'),
                labelWidth: 120,
                name: 'bindOrders',
                renderer: function (value) {
                    var bindOrders = JSON.parse(value);
                    return bindOrders[0] && controller.getTime(bindOrders[0].createdDate);
                }
            },
            {
                fieldLabel: i18n.getKey('下单客户'),
                name: 'customerEmail',
                renderer: (value) => controller.removeStringStyle(value)
            },
            {
                fieldLabel: i18n.getKey('配送方式'),
                name: 'shippingMethod',
                renderer: (value) => controller.removeStringStyle(value)
            },
            {
                fieldLabel: i18n.getKey('deliveryNo'),
                name: 'shipmentInfo',
                renderer: function (value) {
                    var shipmentInfo;
                    value && (shipmentInfo = JSON.parse(value));
                    return shipmentInfo.deliveryNo || '未查询到信息';
                }
            },
            {
                fieldLabel: i18n.getKey('快递方式'),
                name: 'shipmentInfo',
                renderer: function (value) {
                    var shipmentInfo;
                    value && (shipmentInfo = JSON.parse(value));
                    return shipmentInfo.shippingMethodName || '未查询到信息';
                }
            }
        ];
        me.callParent(arguments);
        // 渲染tipText
        var items = me.items.items;
        var tipComp = [
            {
                name: 'orderNumber',
                title: '跳转至订单详情'
            },
            {
                name: 'bindOrderNumber',
                title: '跳转至业务网站销售信息'
            }
        ];
        items.forEach(item => {
            var name = item.getName(),
                data = me.queryData[name];
            (name === 'shipmentInfo' || 'bindOrders') ? item.setValue(JSON.stringify(data) || null) : item.setValue(data);
        });
        tipComp.forEach(item => {
            var comp = me.getComponent(item['name']),
                value = comp.getValue().toString();
            if (!["", "[]", undefined, null].includes(value))
                comp.on('render', view => view.tip = Ext.create('Ext.tip.ToolTip', {
                    target: view.el,
                    trackMouse: false,
                    html: item['title']
                }));
        })
    }
})