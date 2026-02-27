Ext.syncRequire([
    'CGP.ordersign.controller.Controller',
    'CGP.ordersign.store.SalesOrderItemStore'
])
Ext.define('CGP.ordersign.view.ordersign.SalesOrderItem', {
    extend: 'CGP.common.typesettingschedule.view.OptionalConfigContainer',
    alias: 'widget.sales_order_item',
    width: '100%',
    status: 'FINISHED',
    margin: '10 0 0 0',
    orderId: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.ordersign.controller.Controller');
        var store = Ext.create('CGP.ordersign.store.SalesOrderItemStore', {
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/orders/' + me.orderId + '/lineItemsV2',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
        });
        me.containerItems = [
            {
                xtype: 'grid',
                itemId: 'grid',
                store: store,
                width: 850,
                maxHeight: 700,
                autoScroll: true,
                margin: '10 5 10 25',
                viewConfig: {
                    enableTextSelection: true
                },
                columns: [
                    {
                        width: 80,
                        tdCls: 'vertical-middle',
                        dataIndex: 'seqNo',
                        text: i18n.getKey('seqNo'),
                    },
                    {
                        xtype: 'imagecolumn',
                        tdCls: 'vertical-middle',
                        width: 150,
                        dataIndex: 'thumbnailInfo',
                        text: i18n.getKey('preview'),
                        buildUrl: function (value, metadata, record) {
                            var status = value['status'];
                            var thumbnail = value['thumbnail'];
                            if (['', undefined].includes(thumbnail) && status !== 'FAILURE') {
                                status = 'NULL'
                            }
                            if (status === 'SUCCESS') {
                                return projectThumbServer + thumbnail;
                            }
                        },
                        buildPreUrl: function (value, metadata, record) {
                            var status = value['status'];
                            var thumbnail = value['thumbnail'];
                            if (['', undefined].includes(thumbnail) && status !== 'FAILURE') {
                                status = 'NULL'
                            }
                            var statusGather = {
                                SUCCESS: function () {
                                    metadata.tdAttr = 'data-qtip=查看图片';
                                    return projectThumbServer + thumbnail;
                                },
                                FAILURE: function () {
                                    metadata.tdAttr = 'data-qtip=图片生成失败';
                                    return path + 'js/order/view/orderlineitem/image/FAILURE.jpg'
                                },
                                WAITING: function () {
                                    metadata.tdAttr = 'data-qtip=图片生成中';
                                    return path + 'js/order/view/orderlineitem/image/WAITING.gif'
                                },
                                NULL: function () {
                                    metadata.tdAttr = 'data-qtip=图片为空';
                                    return path + 'js/order/view/orderlineitem/image/NULL.jpg'
                                }
                            }
                            return statusGather[status]();
                        },
                        buildTitle: function (value, metadata, record) {
                            var seqNo = record.get('seqNo');
                            return i18n.getKey('check') + ` < ${me.orderNumber}-${seqNo} > ` + i18n.getKey('预览图');
                        },
                    },
                    {
                        width: 350,
                        dataIndex: 'product',
                        text: i18n.getKey('productInfo') + '  ||  ' + i18n.getKey('material'),
                        renderer: function (value, metadata, record) {
                            var result;
                            var sku = value['sku'];
                            var productName = value['name'];
                            result = [
                                {
                                    title: i18n.getKey('productName'),
                                    value: productName
                                },
                                {
                                    title: i18n.getKey('sku'),
                                    value: sku
                                },
                            ]
                            return JSCreateHTMLTable(result);
                        }
                    },
                    {
                        flex: 1,
                        width: 200,
                        dataIndex: 'priceStr',
                        text: i18n.getKey('orderItemInfo'),
                        renderer: function (value, metadata, record) {
                            var result,
                                qty = record.get('qty'),
                                price = controller.getFixedString(value),
                                amount = controller.getFixedString(record.get('amountStr'));
                            result = [
                                {
                                    title: i18n.getKey('Unit Price'),
                                    value: price
                                },
                                {
                                    title: i18n.getKey('qty'),
                                    value: qty
                                },
                                {
                                    title: i18n.getKey('totalPrice'),
                                    value: amount
                                }
                            ];
                            return JSCreateHTMLTable(result);
                        }
                    }
                ],
            }
        ]
        me.callParent();
    }
})