Ext.define('CGP.ordersign.view.batchsign.OrderLineItem', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.orderlineitemlist',
    autoScroll: true,
    width: 1200,
    multiSelect: true,
    orderNumber: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.ordersign.controller.Controller');
        var items = [
            {
                xtype: 'rownumberer',
                width: 60,
                tdCls: 'vertical-middle',
                text: i18n.getKey('seqNo'),
            },
            {
                xtype: 'imagecolumn',
                tdCls: 'vertical-middle',
                width: 150,
                dataIndex: 'thumbnailInfo',
                text: i18n.getKey('preview'),
                buildUrl: function (value, metadata, record) {
                    var {status, thumbnail} = value;
                    (['', undefined].includes(thumbnail) && status !== 'FAILURE') && (status = 'NULL')
                    return (status === 'SUCCESS') && projectThumbServer + thumbnail;
                },
                buildPreUrl: function (value, metadata, record) {
                    var {status, thumbnail} = value;
                    (['', undefined].includes(thumbnail) && status !== 'FAILURE') && (status = 'NULL');
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
                    };
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
                    var result, {sku, name} = value;
                    result = [
                        {
                            title: i18n.getKey('productName'),
                            value: name
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
                    ]
                    return JSCreateHTMLTable(result);
                }
            }
        ];
        me.viewConfig = {
            enableTextSelection: true
        };
        me.columns = {
            items: items,
            defaults: {
                tdCls: 'vertical-middle',
                sortable: false,
                menuDisabled: true,
                resizable: true
            }
        };
        me.callParent(arguments);
    },
})
