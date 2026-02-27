/**
 * @Description:
 * 状态有Refunded,Cancelled,PendingRefund
 * 只有platformCode为 PopUp的订单现在可以退款
 * @author nan
 * @date 2025.05.22
 */
Ext.Loader.syncRequire([
    'CGP.common.commoncomp.QueryGrid',
    'CGP.order.store.Order',
    'CGP.customer.store.CustomerStore',
    'CGP.custormer_order_refund.store.CustomerOrderRefundStore',
    'CGP.customerordermanagement.view.CustomerOrderSelector'
])
Ext.onReady(function () {
    var controller = Ext.create('CGP.custormer_order_refund.controller.Controller');
    var store = Ext.create('CGP.custormer_order_refund.store.CustomerOrderRefundStore', {});
    var customerStore = Ext.create("CGP.customer.store.CustomerStore");
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('Customer订单退款申请'),
        block: 'custormer_order_refund',
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
                        width: 500,
                        layout: 'fit',
                        items: [
                            {
                                xtype: 'errorstrickform',
                                layout: 'vbox',
                                itemId: 'form',
                                defaults: {
                                    width: '100%'
                                },
                                items: [
                                    {
                                        xtype: 'customer_order_selector',
                                        margin: '10 25',
                                        itemId: 'orderNo',
                                        name: 'orderNo',
                                        allowBlank: false,
                                        fieldLabel: i18n.getKey('Customer订单')
                                    }
                                ]
                            }],
                        bbar: {
                            xtype: 'bottomtoolbar',
                            saveBtnCfg: {
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    var form = win.getComponent('form')
                                    if (form.isValid()) {
                                        var orderNo = win.down('[itemId=orderNo]').getArrayValue();
                                        JSOpen({
                                            id: 'customer_orderrefund_edit',
                                            url: path + 'partials/custormer_order_refund/edit.html' +
                                                '?customerOrderId=' + orderNo +
                                                '&refundOrderType=' + 'CustomerOrder',
                                            title: i18n.getKey('create') + i18n.getKey('refundApply'),
                                            refresh: true
                                        });
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
                hidden: true,
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
                                            /*
                                            https://dev-sz-qpson-nginx.qppdev.com/qpson-admin/partials/orderrefund/edit.html
                                            ?_id=98881321&customerOrderId=98625316&aimStatus=Refunded&refundOrderType=WhiteLabelOrder&action=check
                                            */
                                            display.getEl().on("click", function () {
                                                JSOpen({
                                                    id: 'customer_orderrefund_edit',
                                                    url: path + 'partials/custormer_order_refund/edit.html' +
                                                        '?_id=' + record.get(record.idProperty) +
                                                        '&customerOrderId=' + record.get('order')._id +
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
                                                    id: 'customer_orderrefund_edit',
                                                    url: path + 'partials/custormer_order_refund/edit.html' +
                                                        '?_id=' + record.get(record.idProperty) +
                                                        '&customerOrderId=' + record.get('order')._id +
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
                                                    id: 'customer_orderrefund_edit',
                                                    url: path + 'partials/custormer_order_refund/edit.html' +
                                                        '?_id=' + record.get(record.idProperty) +
                                                        '&customerOrderId=' + record.get('order')._id +
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
                    text: i18n.getKey('状态'),
                    dataIndex: 'state',
                    renderer: function (value, metadata, record) {
                        if (value == 'Refunded') {
                            return '<font color="green">' + i18n.getKey(value) + '</font>';
                        } else if (value == 'Cancelled') {
                            return '<font color="orange">' + i18n.getKey(value) + '</font>';
                        } else if (value == 'PendingRefund') {
                            return '<font color="red">' + i18n.getKey(value) + '</font>';
                        } else {
                            return value;
                        }
                    }
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
                    dataIndex: 'allRefundAmount',
                    renderer: function (value, metaData, record) {
                        var currency = record.get('currencyCode');
                        var refundTotal = record.get('allRefundAmount');
                        return Number(refundTotal).toLocaleString('zh', {style: 'currency', currency: currency});
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('Customer订单'),
                    dataIndex: 'order',
                    width: 150,
                    sortable:false,
                    getDisplayName: function (value, metadata, record) {
                        var customerOrderNumber = record.get('customerOrderNumber');
                        var arr = [
                            {
                                title: '编号',
                                value: `<a href="#" style="color: blue;text-decoration: none">${value._id}</a>`
                            },
                            {
                                title: '订单号',
                                value: customerOrderNumber
                            }
                        ]
                        return JSCreateHTMLTable(arr);
                    },
                    clickHandler: function (value, metaData, record) {
                        JSOpen({
                            id: 'page',
                            url: path + "partials/customerordermanagement/main.html?_id=" + value._id,
                            title: 'Customer订单',
                            refresh: true
                        });
                    }
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
                    text: i18n.getKey('退款申请来源'),
                    dataIndex: 'from',
                    width: 150
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
                            ImportService: '退ImportService',
                            Other: '其他',
                        };
                        return map[value];
                    }
                },

                {
                    text: i18n.getKey('退款交易号'),
                    dataIndex: 'refundTranId',
                    width: 180
                },

                {
                    text: i18n.getKey('创建申请时间'),
                    dataIndex: 'createdDate',
                    width: 150,
                    renderer: function (value, metadata, record) {
                        value = Ext.Date.format(new Date(Number(value)), 'Y/m/d H:i');
                        return value;
                    }
                },
                {
                    text: i18n.getKey('退款申请人'),
                    width: 150,
                    dataIndex: 'createdUser',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        return JSCreateHTMLTable([
                            {
                                title: i18n.getKey('id'),
                                value: value.id,
                            },
                            {
                                title: i18n.getKey('firstName'),
                                value: value.firstName,
                            }, 
                            {
                                title: i18n.getKey('lastName'),
                                value: value.lastName,
                            },
                            {
                                title: i18n.getKey('邮箱'),
                                value: value.emailAddress,
                            }
                        ]);
                    }
                },
                {
                    text: i18n.getKey('处理信息'),
                    minWidth: 250,
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        var status = record.get('state');
                        var items = [];
                        if (status === 'Cancelled') {
                            var cancelDate = record.get('cancelDate');
                            cancelDate = Ext.Date.format(new Date(Number(cancelDate)), 'Y/m/d H:i');
                            var cancelUser = record.get('cancelUser');
                            items.push({
                                    title: '取消申请人',
                                    value: cancelUser.emailAddress
                                },
                                {
                                    title: '取消时间',
                                    value: cancelDate
                                });
                        } else if (status === 'Refunded') {
                            var refundDate = record.get('refundDate');
                            refundDate = Ext.Date.format(new Date(Number(refundDate)), 'Y/m/d H:i');
                            var refundUser = record.get('refundUser');
                            items.push({
                                    title: '退款人',
                                    value: refundUser.emailAddress
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
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('Customer订单编号'),
                    itemId: 'order._id',
                    name: 'order._id',
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('Customer订单号'),
                    itemId: 'customerOrderNumber',
                    name: 'customerOrderNumber',
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
                                value: 'ImportService',
                                display: i18n.getKey('退ImportService')
                            },
                            {
                                value: 'Other',
                                display: i18n.getKey('其他')
                            }
                        ]
                    },
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
                    itemId: 'createdUser.',
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
                    xtype: 'datefield',
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'createdDate',
                    itemId: 'createdDate',
                    scope: true,
                    fieldLabel: i18n.getKey('创建申请时间'),
                    width: 360,
                    format: 'Y/m/d'
                },
            ]
        }
    });
});