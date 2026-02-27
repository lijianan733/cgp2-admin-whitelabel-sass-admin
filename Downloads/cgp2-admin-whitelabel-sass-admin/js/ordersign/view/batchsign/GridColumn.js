Ext.syncRequire([
    'CGP.ordersign.controller.Controller'
])
Ext.define('CGP.ordersign.view.batchsign.GridColumn', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.grid_column',
    width: '100%',
    selType: 'checkboxmodel',
    columnDefaults: {
        autoSizeColumn: true,
        tdCls: 'vertical-middle'

    },
    plugins: [
        {
            ptype: 'rowexpander',
            rowBodyTpl: new Ext.XTemplate(
                '<div><div id="order-line-item-{id}"  style="float:left;"></div>'
            )
        },
        Ext.create('Ext.ux.grid.plugin.MultipleSort', {
            width: 1000,
            heigth: 90,
            default: {
                width: 70,
                height: 24
            },
            items: [
                {
                    xtype: 'tbtext',
                    width: 50,
                    text: i18n.getKey('sorter') + ":",
                    reorderable: false
                },
                {
                    text: i18n.getKey('datePurchased'),
                    sortData: {
                        property: 'datePurchased',
                        direction: 'DESC'
                    }
                },
                {
                    text: i18n.getKey('orderNumber'),
                    sortData: {
                        property: 'orderNumber'
                    }
                }
            ]
        })
    ],
    viewConfig: {
        enableTextSelection: true,
        listeners: {
            expandBody: function (rowNode, record) {
                var controller = Ext.create('CGP.ordersign.controller.Controller');
                controller.expandBody(record);
            }
        },
    },
    listeners: {
        afterload: function (p) {
            p.filter.getComponent('orderNumber').on('change', function (comp, newValue, oldValue) {
                newValue.length === 12 && p.grid.getStore().loadPage(1);
            });
            controller.afterPageLoad(p, gridColumns);
        }
    },
    allowScroll: true,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.ordersign.controller.Controller');
        me.columns = [
            {
                xtype: 'rownumberer',
                tdCls: 'vertical-middle',
                text: i18n.getKey('seqNo'),
                width: 60
            },
            {
                xtype: 'atagcolumn',
                text: i18n.getKey('orderNumber'),
                dataIndex: 'orderNumber',
                width: 180,
                getDisplayName: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip=跳转至订单详情';
                    return '<a href="#" style="text-decoration: none">' + value + '</a>';
                },
                clickHandler: function (value, metadata, record) {
                    var id = record.get('id');
                    JSOpen({
                        id: 'orderDetails',
                        url: path + 'partials/orderitemsmultipleaddress/main.html?id=' + id + '&orderNumber=' + value,
                        title: i18n.getKey('订单详情') + `(订单号:${i18n.getKey(value)})`,
                        refresh: true
                    })
                },
            },
            {
                xtype: 'atagcolumn',
                text: i18n.getKey('bindOrderNumbers'),
                dataIndex: 'bindOrders',
                width: 200,
                getDisplayName: function (value, metadata, record) {
                    var bindOrderId = value[0]['_id'];
                    var orderNumber = value[0].orderNumber ? value[0].orderNumber : '';
                    metadata.tdAttr = 'data-qtip=跳转至业务网站销售信息';
                    return bindOrderId ? '<a href="#" style="text-decoration: none">' + orderNumber + '</a>' : orderNumber;
                },
                clickHandler: function (value, metadata, record) {
                    var id = record.get('id');
                    var bindOrderId = value[0]['_id'];
                    var bindOrderNumber = value[0].orderNumber;
                    bindOrderNumber && JSOpenWin();
                    function JSOpenWin() {
                        var orderNumber = value[0].orderNumber ? value[0].orderNumber : '';
                        JSOpen({
                            id: 'orderInfo',
                            url: path + 'partials/ordersign/OrderInfo.html?bindOrderId=' + bindOrderId + '&orderNumber=' + orderNumber + '&id=' + id,
                            title: i18n.getKey('业务网站销售信息') + `(关联订单号:${i18n.getKey(orderNumber)})`,
                            refresh: true
                        })
                    }
                }
            },
            {

                text: i18n.getKey('placeOrder') + i18n.getKey('customer'),
                dataIndex: 'customerEmail',
                width: 180
            },
            {
                text: i18n.getKey('datePurchased'),
                dataIndex: 'datePurchased',
                width: 200,
                renderer: (value) => controller.getTime(value)
            },
            {
                text: i18n.getKey('bindOrders') + i18n.getKey('datePurchased'),
                dataIndex: 'bindOrders',
                width: 200,
                renderer: (value) => controller.getTime(value[0].createdDate)
            },
            {
                text: i18n.getKey('shippingMethod'),
                width: 120,
                dataIndex: 'shippingMethod',
            },
            {
                text: i18n.getKey('shippingMethodName'),
                width: 120,
                dataIndex: 'shipmentInfo',
                renderer: (value) => value?.shippingMethodName
            },
            {
                text: i18n.getKey('deliveryNo'),
                flex: 1,
                dataIndex: 'shipmentInfo',
                renderer: (value) => value?.deliveryNo
            }
        ];
        me.bbar = {
            xtype: 'pagingtoolbar',
            store: me.store,
            displayInfo: true, // 是否 ? 示， 分 ? 信息
            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
            emptyText: i18n.getKey('noDat')
        }
        me.listeners = {
            afterrender: () => me.getSelectionModel().selectAll(true)
        }
        me.callParent(arguments);
    }
})