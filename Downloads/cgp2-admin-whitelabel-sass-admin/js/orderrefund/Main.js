/**
 * @Description: 状态有Refunded,Cancelled,PendingRefund
 * @author nan
 * @date 2022/12/5
 */
Ext.Loader.syncRequire([
    'CGP.common.commoncomp.QueryGrid',
    'CGP.orderrefund.model.OrderRefundModel',
    'CGP.order.store.Order',
    'CGP.customer.store.CustomerStore',
    'CGP.orderrefund.store.RefundFromStore'
])
Ext.onReady(function () {
    var controller = Ext.create('CGP.orderrefund.controller.Controller');
    var store = Ext.create('CGP.orderrefund.store.OrderRefundStore', {});
    var customerStore = Ext.create("CGP.customer.store.CustomerStore");
    //货币信息
    var currencyStore = Ext.create('CGP.currency.store.Currency', {
        proxy: {
            type: 'memory',
        },
        data: controller.getCurrencyInfo()
    });
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('refundApply'),
        block: 'orderrefund',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                text: i18n.getKey('新建退款申请'),
                width: 120,
                handler: function () {
                    var win = Ext.create('Ext.window.Window', {
                        title: '新建退款申请',
                        modal: true,
                        constrain: true,
                        layout: {
                            type: 'vbox',
                            align: 'center',
                            pack: 'center'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                margin: '10 25',
                                itemId: 'orderNo',
                                fieldLabel: i18n.getKey('订单号')
                            }
                        ],
                        bbar: {
                            xtype: 'bottomtoolbar',
                            saveBtnCfg: {
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    var orderNo = win.getComponent('orderNo');
                                    if (orderNo.isValid()) {
                                        var orderNoValue = orderNo.getValue();
                                        var orderInfo = controller.getOrderInfo(orderNoValue);
                                        if (orderInfo) {
                                            JSOpen({
                                                id: 'orderrefund_edit',
                                                url: path + 'partials/orderrefund/edit.html' +
                                                    '?orderId=' + orderInfo.id +
                                                    '&refundOrderType=' + (orderInfo.partner.partnerType == 'INTERNAL' ? 'SalesOrder' : 'WhiteLabelOrder'),
                                                title: i18n.getKey('create') + i18n.getKey('refundApply'),
                                                refresh: true
                                            });
                                        } else {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('查询不到对应订单信息'));
                                        }
                                    }
                                }
                            }
                        }
                    });
                    win.show();
                }
            },
            btnDelete: {
                hidden: true,
            },
            btnExport: {
                text: i18n.getKey('导出Excel'),
                hidden: false,
                width: 100,
                disabled: false,
                handler: function (btn) {
                    var grid = btn.ownerCt.ownerCt.ownerCt;
                    controller.exportExcel(grid);
                }
            }
        },
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            editAction: false,//是否启用delete的按钮
            deleteAction: true,//是否启用delete的按钮
            columns: [
                {
                    text: i18n.getKey('退款单号'),
                    dataIndex: 'requestNo',
                    sortable: true,
                    width: 150
                },
                {
                    text: i18n.getKey('operation'),
                    sortable: false,
                    width: 105,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var _id = record.get('_id');
                        var salesOrderNo = record.get('salesOrderNo');
                        var state = record.get('state');
                        var refundOrderType = record.get('refundOrderType');
                        return {
                            xtype: 'fieldcontainer',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    value: '<a href="#" style="color: blue;text-decoration: none">查看详情</a>',
                                    listeners: {
                                        afterrender: function (display) {
                                            display.getEl().on("click", function () {
                                                JSOpen({
                                                    id: 'orderrefund_edit',
                                                    url: path + 'partials/orderrefund/edit.html' +
                                                        '?_id=' + record.get(record.idProperty) +
                                                        '&orderId=' + record.get('order')._id +
                                                        '&aimStatus=' + state +
                                                        '&refundOrderType=' + refundOrderType +
                                                        '&action=check',
                                                    title: '退款申请详情',
                                                    refresh: true
                                                });
                                            });
                                        }
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    hidden: state != 'PendingRefund',
                                    value: '<a href="#" style="color: blue;text-decoration: none">取消申请</a>',
                                    listeners: {
                                        afterrender: function (display) {
                                            display.getEl().on("click", function () {
                                                JSOpen({
                                                    id: 'orderrefund_edit',
                                                    url: path + 'partials/orderrefund/edit.html' +
                                                        '?_id=' + record.get(record.idProperty) +
                                                        '&orderId=' + record.get('order')._id +
                                                        '&refundOrderType=' + refundOrderType +
                                                        '&aimStatus=Cancelled',
                                                    title: '取消退款申请',
                                                    refresh: true
                                                });
                                            });
                                        }
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    value: '<a href="#" style="color: blue;text-decoration: none">退款</a>',
                                    hidden: state != 'PendingRefund',
                                    listeners: {
                                        afterrender: function (display) {
                                            display.getEl().on("click", function () {
                                                JSOpen({
                                                    id: 'orderrefund_edit',
                                                    url: path + 'partials/orderrefund/edit.html' +
                                                        '?_id=' + record.get(record.idProperty) +
                                                        '&orderId=' + record.get('order')._id +
                                                        '&refundOrderType=' + refundOrderType +
                                                        '&aimStatus=Refunded',
                                                    title: '退款',
                                                    refresh: true
                                                });
                                            });
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('订单号'),
                    dataIndex: 'orderNumber',
                    width: 150,
                    getDisplayName: function (value, metadata, record) {
                        return '<a href="#" style="color: blue;text-decoration: none">' + value + '</a>'
                    },
                    clickHandler: function (value, metaData, record) {
                        JSOpen({
                            id: 'page',
                            url: path + "partials/order/order.html?orderNumber=" + value,
                            title: '订单 所有订单',
                            refresh: true
                        });
                    }
                },

                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('关联单号'),
                    dataIndex: 'salesOrderNo',
                    width: 150,
                    getDisplayName: function (value, metadata, record) {
                        return '<a href="#" style="color: blue;text-decoration: none">' + value + '</a>'
                    },
                    clickHandler: function (value, metaData, record) {
                        var orderNumber = record.get('orderNumber');
                        var bindOrderId = record.get('bindOrder')._id;
                        var orderId = record.get('orderId');
                        JSOpen({
                            id: 'orderInfo',
                            url: path + 'partials/ordersign/OrderInfo.html?bindOrderId=' + bindOrderId + '&orderNumber=' + orderNumber + '&id=' + orderId,
                            title: i18n.getKey('业务网站销售信息') + `(关联订单号:${i18n.getKey(orderNumber)})`,
                            refresh: true
                        })
                    }
                },
                {
                    text: i18n.getKey('状态'),
                    dataIndex: 'state',
                    width: 150,
                    renderer: function (value, metadata, record) {
                        if (value == 'Refunded') {
                            return '<font color="green">' + i18n.getKey(value) + '</font>';
                        } else if (value == 'Cancelled') {
                            return '<font color="orange">' + i18n.getKey(value) + '</font>';
                        } else if (value == 'PendingRefund') {
                            return '<font color="red">' + i18n.getKey(value) + '</font>';
                        }
                    }
                },
                {
                    text: i18n.getKey('退款申请来源'),
                    dataIndex: 'from',
                    width: 200
                },
                {
                    text: i18n.getKey('付款方式'),
                    dataIndex: 'paymentMethod',
                },
                {
                    text: i18n.getKey('订单付款交易号'),
                    dataIndex: 'paymentTranId',
                    width: 150
                },
                {
                    text: i18n.getKey('退款类型'),
                    dataIndex: 'type',
                    width: 180,
                    renderer: function (value, metaData, record) {
                        var map = {
                            FullOrder: '客户要求取消整个订单',
                            Product: '客户要求取消部分产品',
                            ShippingFee: '退运费',
                            SalesTax: '退销售税',
                            Other: '其他',
                        };
                        return map[value];
                    }
                },
                {
                    text: i18n.getKey('货币'),
                    dataIndex: 'currencyCode',
                },
                {
                    text: i18n.getKey('订单实付金额'),
                    dataIndex: 'paymentAmount',
                    renderer: function (value, metaData, record) {
                        var currency = record.get('currencyCode');
                        return Number(value).toLocaleString('zh', {style: 'currency', currency: currency});
                    }
                },
                {
                    text: i18n.getKey('退款金额'),
                    dataIndex: 'salesOrderNo',
                    renderer: function (value, metaData, record) {
                        var currency = record.get('currencyCode');
                        var refundNum = record.get('productsAmount') + record.get('shippingAmount') + record.get('salesTaxAmount');
                        return Number(refundNum).toLocaleString('zh', {style: 'currency', currency: currency});
                    }
                },
                {
                    text: i18n.getKey('退款交易号'),
                    dataIndex: 'refundTranId',
                    width: 180
                },
                {
                    text: i18n.getKey('退款原因'),
                    width: 150,
                    dataIndex: 'reason',
                    renderer: function (value, metadata, record) {
                        return JSAutoWordWrapStr(value);
                    }
                },
                {
                    text: i18n.getKey('创建申请时间'),
                    dataIndex: 'createdDate',
                    width: 150,
                    renderer: function (value, metadata, record) {
                        value = Ext.Date.format(new Date(value), 'Y/m/d H:i');
                        return value;
                    }
                },
                {
                    text: i18n.getKey('退款申请人'),
                    width: 150,
                    dataIndex: 'createdUser',
                },
                {
                    text: i18n.getKey('处理信息'),
                    minWidth: 250,
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        var status = record.get('state');
                        var items = [];
                        if (status == 'Cancelled') {
                            var cancelDate = record.get('cancelDate');
                            cancelDate = Ext.Date.format(new Date(cancelDate), 'Y/m/d H:i');
                            var cancelUser = record.get('cancelUser');
                            items.push({
                                    title: '取消申请人',
                                    value: cancelUser
                                },
                                {
                                    title: '取消时间',
                                    value: cancelDate
                                });
                        } else if (status == 'Refunded') {
                            var refundDate = record.get('refundDate');
                            refundDate = Ext.Date.format(new Date(refundDate), 'Y/m/d H:i');
                            var refundUser = record.get('refundUser');
                            items.push({
                                    title: '退款人',
                                    value: refundUser
                                },
                                {
                                    title: '退款时间',
                                    value: refundDate
                                });
                        }
                        return JSCreateHTMLTable(items);
                    }
                }]
        },
        filterCfg: {
            layout: {
                type: 'table',
                columns: 4
            },
            items: [
                {
                    name: 'requestNo',
                    xtype: 'textfield',
                    hideTrigger: true,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('退款单号'),
                    itemId: 'requestNo'
                },
                {
                    name: 'orderNumber',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('订单号'),
                    itemId: 'orderNumber'
                },
                {
                    name: 'salesOrderNo',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('关联单号'),
                    itemId: 'salesOrderNo'
                },
                {
                    xtype: 'combobox',
                    name: 'state',
                    itemId: 'state',
                    fieldLabel: i18n.getKey('status'),
                    displayField: 'displayName',
                    valueField: 'key',
                    editable: false,
                    haveReset: true,
                    isLike: false,
                    store: Ext.create('CGP.common.store.StateNode', {
                        flowModule: 'refund_request'
                    })
                },
                {
                    xtype: 'gridcombo',
                    itemId: 'createdBy',
                    name: 'createdBy',
                    displayField: 'email',
                    valueField: 'id',
                    fieldLabel: i18n.getKey('申请人'),
                    matchFieldWidth: false,
                    editable: false,
                    haveReset: true,
                    store: customerStore,
                    filterCfg: {
                        items: [
                            {
                                xtype: 'numberfield',
                                hideTrigger: true,
                                autoStripChars: true,
                                allowExponential: false,
                                allowDecimals: false,
                                name: 'id',
                                fieldLabel: i18n.getKey('id'),
                                itemId: 'id'
                            },
                            {
                                name: 'firstName',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('firstName'),
                                itemId: 'firstName'
                            },
                            {
                                name: 'lastName',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('lastName'),
                                itemId: 'lastName'
                            },
                            {
                                name: 'emailAddress',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('email'),
                                itemId: 'email'
                            },
                            {
                                name: 'website',
                                xtype: 'websitecombo',
                                itemId: 'websiteCombo',
                                value: null,
                            },
                        ]
                    },
                    gridCfg: {
                        autoScroll: true,
                        width: 900,
                        height: 450,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: 'id',
                                width: 100,
                                sortable: true
                            },
                            {
                                text: i18n.getKey('email'),
                                dataIndex: 'email',
                                sortable: false,
                                minWidth: 170,
                                renderer: function (value, metadata) {
                                    metadata.style = "font-weight:bold";
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('website'),
                                dataIndex: 'website',
                                sortable: false,
                                minWidth: 150,
                                renderer: function (record) {
                                    return record.name;
                                }
                            },
                            {
                                text: i18n.getKey('type'),
                                dataIndex: 'type',
                                sortable: false,
                                width: 80,
                                renderer: function (value, metadata) {
                                    if (value == "MEMBER") {
                                        return i18n.getKey('member');
                                    } else if (value == "ADMIN") {
                                        return i18n.getKey('admin');
                                    }
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('firstName'),
                                dataIndex: 'firstName',
                                sortable: false,
                                minWidth: 100
                            },
                            {
                                text: i18n.getKey('lastName'),
                                dataIndex: 'lastName',
                                sortable: false,
                                minWidth: 100,
                                flex: 1
                            },
                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: customerStore
                        }
                    },
                },
                {
                    //网站配置中的配置
                    xtype: 'combobox',
                    fieldLabel: i18n.getKey('退款申请来源'),
                    name: 'from',
                    itemId: 'from',
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    isLike: false,
                    haveReset: true,
                    store: Ext.create('CGP.orderrefund.store.RefundFromStore'),
                },
                {
                    xtype: 'datefield',
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'createdDate',
                    itemId: 'createdDate',
                    scope: true,
                    fieldLabel: i18n.getKey('申请时间'),
                    width: 360,
                    format: 'Y/m/d'
                },
                {
                    //网站配置中的配置
                    xtype: 'combobox',
                    fieldLabel: i18n.getKey('退款订单类型'),
                    name: 'refundOrderType',
                    itemId: 'refundOrderType',
                    editable: false,
                    isLike: false,
                    displayField: 'display',
                    valueField: 'value',
                    haveReset: true,
                    store: {
                        xtype: 'store',
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                value: 'WhiteLabelOrder',
                                display: 'WhiteLabelOrder'
                            },
                            {
                                value: 'SalesOrder',
                                display: 'SalesOrder'
                            }
                        ]
                    },
                },
                {
                    xtype: 'combobox',
                    fieldLabel: i18n.getKey('退款类型'),
                    name: 'type',
                    itemId: 'type',
                    editable: false,
                    isLike: false,
                    displayField: 'display',
                    valueField: 'value',
                    store: {
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'FullOrder',
                                display: '客户要求取消整个订单'
                            },
                            {
                                value: 'Product',
                                display: '客户要求取消部分产品'
                            },
                            {
                                value: 'ShippingFee',
                                display: i18n.getKey('退运费')
                            },
                            {
                                value: 'SalesTax',
                                display: i18n.getKey('退销售税')
                            },
                            {
                                value: 'Other',
                                display: i18n.getKey('其他')
                            }
                        ]
                    },
                }
            ]
        }
    });
});