/**
 * @Description:校验是否可以新建退货申请,当有一条带处理时就不能继续新建
 * 状态有 PendingRefund,Cancelled,Refunded
 * @author nan
 * @date 2025/05/23
 */
Ext.Loader.syncRequire([
    'CGP.custormer_order_refund.model.CustomerOrderRefundModel',
    'CGP.custormer_order_refund.view.RefundItemsGridField',
    'CGP.orderrefund.store.RefundFromStore',
    'CGP.custormer_order_refund.view.RelateQpsonOrderInfoGridField'
])
Ext.define('CGP.custormer_order_refund.view.RefundDetailForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.refund_detail_form',
    autoScroll: true,
    layout: {
        type: 'vbox'
    },
    defaults: {
        width: 450,
        margin: '5 25 3 25',
        msgTarget: 'side',
        labelWidth: 150,
        labelAlign: 'left',
    },
    aimStatus: null,//目标状态
    controller: null,
    customerOrderId: null,
    customerOrderInfo: null,//订单信息
    currencySymbol: '',//货币标识
    priceInfo: null,//价格信息
    allowRefundItemsInfo: null,//可退款订单项
    allOrderItems: null,//customer的订单项列表
    priceInfoStr: '',//订单的价格信息组成的字符串
    tbar: {
        xtype: 'uxedittoolbar',
        btnCreate: {
            hidden: true,
            handler: function () {
            }
        },
        btnCopy: {
            hidden: true,
            handler: function () {
            }
        },
        btnReset: {
            hidden: true,
        },
        btnSave: {
            text: i18n.getKey('创建退款申请'),
            hidden: true,
            handler: function (view) {
                var form = view.ownerCt.ownerCt;
                if (form.isValid()) {
                    JSSetLoading(true);
                    var value = form.getValue();
                    var data = Ext.Object.merge(value, {
                        "currencyCode": form.customerOrderInfo.currency.code,
                    });
                    if (data.state == 'PendingRefund') {
                        form.controller.createRefundApply(data);
                    } else if (data.state == 'Refunded' || data.state == 'Cancelled') {
                        form.controller.changeRefundApplyStatus(data);
                    }
                }
            },
        },
        btnGrid: {
            disabled: false,
            handler: function () {
                JSOpen({
                    id: 'custormer_order_refundpage',
                    url: path + 'partials/custormer_order_refund/main.html',
                    title: i18n.getKey('退款申请'),
                    refresh: true
                });
            }
        },
        btnConfig: {
            disabled: false,
            iconCls: 'icon_refresh',
            text: '刷新',
            handler: function () {
                location.reload();
            }
        },
        btnHelp: {
            handler: function () {
            }
        }
    },
    listeners: {
        afterrender: function () {
            this.refreshData();
        },
        /**
         * 产品总价变了的处理
         * @param grid
         */
        productRefundChange: function (grid) {
            var form = this;
            if (Ext.isEmpty('_id')) {
                return;
            }
            var selections = grid.getSelectionModel().getSelection();
            var productRefundAmount = 0;
            for (var i = 0; i < selections.length; i++) {
                var index = selections[i].index;
                var refundAmount = grid.query('[itemId*=refundAmount_row_' + index + ']')[0];
                productRefundAmount += Number(refundAmount.getValue());
            }
            var productsAmount = form.getComponent('productsAmount');
            productsAmount.setValue(productRefundAmount);
            /* productsAmount.clearInvalid();*/
        },
        /**
         * 产品数量变了的处理
         * @param grid
         */
        productQtyChange: function (grid) {
            var form = this;
            console.log('productQtyChange');
        },
        allRefundAmountChange: function () {
            var me = this;
            me.delayedTask.delay(100);
        }
    },
    setReadOnly: function () {
        var me = this;
        me.items.items.map(function (item) {
            if (item.xtype == 'textfield' || item.xtype == 'textarea' || item.xtype == 'combobox' || item.xtype == 'numberfield') {
                item.setReadOnly(true);
                item.setFieldStyle('background-color: silver');
            } else {
                item.setReadOnly(true);
            }
        });
    },
    addOperator: function (status) {
        var me = this;
        var user = Ext.JSON.decode(Ext.util.Cookies.get('user') || '{}');
        var items = [
            {
                xtype: 'combobox',
                name: 'state',
                itemId: 'operator',
                fieldLabel: i18n.getKey('操作'),
                editable: false,
                displayField: 'displayName',
                valueField: 'key',
                readOnly: true,
                store: Ext.create('CGP.common.store.StateNode', {
                    flowModule: 'refund_request'
                }),
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var rejectReason = field.ownerCt.getComponent('rejectReason');
                        var cancelUser = field.ownerCt.getComponent('cancelUser');
                        var cancelDate = field.ownerCt.getComponent('cancelDate');
                        var refundTranId = field.ownerCt.getComponent('refundTranId');
                        var remark = field.ownerCt.getComponent('remark');
                        var refundUser = field.ownerCt.getComponent('refundUser');
                        var refundDate = field.ownerCt.getComponent('refundDate');
                        rejectReason.setVisible(newValue == 'Cancelled');
                        rejectReason.setDisabled(newValue != 'Cancelled');
                        cancelUser.setVisible(newValue == 'Cancelled');
                        cancelUser.setDisabled(newValue != 'Cancelled');
                        cancelDate.setVisible(newValue == 'Cancelled');
                        cancelDate.setDisabled(newValue != 'Cancelled');

                        refundTranId.setVisible(newValue == 'Refunded');
                        refundTranId.setDisabled(newValue != 'Refunded');
                        remark.setVisible(newValue == 'Refunded');
                        remark.setDisabled(newValue != 'Refunded');
                        refundUser.setVisible(newValue == 'Refunded');
                        refundUser.setDisabled(newValue != 'Refunded');
                        refundDate.setVisible(newValue == 'Refunded');
                        refundDate.setDisabled(newValue != 'Refunded');
                    },
                    afterrender: function () {
                        var me = this;
                        me.setValue(status);
                        me.hide();
                    }
                }
            },
            {
                xtype: 'combobox',
                name: 'aimStatus',
                itemId: 'aimStatus',
                fieldLabel: i18n.getKey('目标状态'),
                editable: false,
                displayField: 'displayName',
                valueField: 'key',
                readOnly: true,
                value: status,
                hidden: JSGetQueryString('action') == 'check',
                tipInfo: '用户操修改以后，订单将会流转到的状态',
                fieldStyle: 'background-color: silver',
                store: Ext.create('CGP.common.store.StateNode', {
                    flowModule: 'refund_request'
                }),
            },
            {
                xtype: 'textarea',
                name: 'remark',
                height: 80,
                hidden: true,
                allowBlank: false,
                disabled: true,
                itemId: 'rejectReason',
                fieldLabel: i18n.getKey('取消原因'),
            },
            {
                xtype: 'displayfield',
                name: 'cancelUser',
                itemId: 'cancelUser',
                value: user.email,
                hidden: true,
                fieldLabel: i18n.getKey('取消人'),
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setValue(data.emailAddress);
                    }
                },
            },
            {
                xtype: 'displayfield',
                name: 'cancelDate',
                itemId: 'cancelDate',
                hidden: true,
                fieldLabel: i18n.getKey('取消时间'),
                value: Ext.Date.format(new Date(), 'Y/m/d H:i'),
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setValue(Ext.Date.format(new Date(data), 'Y/m/d H:i'));
                    }
                },
            },
            {
                xtype: 'textfield',
                name: 'refundTranId',
                itemId: 'refundTranId',
                allowBlank: false,
                vtype: 'alphanum',
                fieldLabel: i18n.getKey('退款交易号'),
            },
            {
                xtype: 'textarea',
                name: 'remark',
                height: 80,
                itemId: 'remark',
                hidden: true,
                fieldLabel: i18n.getKey('备注'),

            },
            {
                xtype: 'displayfield',
                name: 'refundUser',
                itemId: 'refundUser',
                hidden: true,
                value: user.email,
                fieldLabel: i18n.getKey('退款人'),
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setValue(data.emailAddress);
                    }
                },
            },
            {
                xtype: 'displayfield',
                name: 'refundDate',
                itemId: 'refundDate',
                hidden: true,
                fieldLabel: i18n.getKey('退款时间'),
                value: Ext.Date.format(new Date(), 'Y/m/d H:i'),
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setValue(Ext.Date.format(new Date(data), 'Y/m/d H:i'));
                    }
                },
            }
        ];
        me.add(items);
    },
    /**
     * 修改退款总额,修改完总额同时获取关联的qpson订单信息
     * @param jsonData
     * @param callback
     */
    modifyAllRefundAmount: function (jsonData, callback) {
        var form = this;
        JSSetLoading(true);
        setTimeout(function () {
            var productsAmount = form.getComponent('productsAmount').getValue();
            var shippingAmountValue = form.getComponent('shippingAmount').getValue();
            var salesTaxAmountValue = form.getComponent('salesTaxAmount').getValue();
            var importServiceAmount = form.getComponent('importServiceAmount').getValue();
            var allRefundAmount = form.getComponent('allRefundAmount');
            var total = Number(productsAmount + shippingAmountValue + salesTaxAmountValue + importServiceAmount).toFixed(2);
            allRefundAmount.setValue(total);
            form.fireEvent('allRefundAmountChange', total);
            JSSetLoading(false);
        }, 250);
    },
    /**
     * 创建根据qpson订单的延时任务，查询qpson退款信息，只有新建的页面查询，查看页面只用旧数据
     * @param data
     * @param callBack
     */
    createUpdateQPSONOrderInfo: function (data, callBack) {
        var me = this;
        me.delayedTask = null;
        var controller = Ext.create('CGP.custormer_order_refund.controller.Controller');
        var task = new Ext.util.DelayedTask(function () {
            if (!Ext.isEmpty(JSGetQueryString('_id'))) {
                //非新建状态不查询数据
                return;
            } else {
                //前提，输入的数据都通过校验
                var isValid = me.getComponent('refundItems').isValid();
                var isValid1 = me.getComponent('productsAmount').isValid();
                var isValid2 = me.getComponent('shippingAmount').isValid();
                var isValid3 = me.getComponent('salesTaxAmount').isValid();
                var isValid4 = me.getComponent('importServiceAmount').isValid();
                if (isValid && isValid1 && isValid2 && isValid3 && isValid4) {
                    //判断数据是否发生变化，变化就重新计算
                    var currentData = me.getValue();
                    var data = {
                        "refundType": currentData.type,
                        "orderItems": currentData.refundItems?.map(function (item) {
                            return {
                                "id": item.orderItemId,
                                "refundAmount": item.refundAmount,
                                "refundQty": item.refundQty
                            }
                        }),
                        "taxAmount": currentData.salesTaxAmount,
                        "importServiceAmount": currentData.importServiceAmount,
                        "shippingAmount": currentData.shippingAmount,
                        "productAmount": currentData.productsAmount,
                    };
                    console.log(data);
                    var info = controller.getRelateQpsonOrderInfo(me.customerOrderId, data);
                    me.getComponent('document').refreshData(info);
                    me.getComponent('reduceRevenue').setValue(info.reduceRevenue);
                    me.getComponent('revenue').setValue(info.revenue);

                } else {
                    me.getComponent('document').refreshData({
                        orderItems: []
                    });
                    me.getComponent('revenue').setValue(0);
                    me.getComponent('reduceRevenue').setValue(0);
                }
            }
        });
        me.delayedTask = task;
    },
    refreshData: function (callback) {
        var me = this;
        JSSetLoading(true);
        var user = Ext.JSON.decode(Ext.util.Cookies.get('user'));
        var _id = JSGetQueryString('_id');
        //新建
        var btnSave = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('btnSave');
        var initData = {
            paymentAmount: me.priceInfo.paymentAmount,//付款总额
            paymentTranId: me.priceInfo.paymentTranId,//付款流水号
            refundOrderType: me.refundOrderType,
            paymentMethod: me.priceInfo.paymentMethod,
            orderId: me.customerOrderInfo._id,
            customerOrderNumber: me.customerOrderInfo.bindOrderNumber,
            state: 'PendingRefund',
            priceInfoStr: me.priceInfoStr,
            createdUser: user,
            currencyCode: me.customerOrderInfo.currency.code,
            createdDate: new Date().getTime()
        };
        if (_id) {
            //编辑是，aimStatus目标状态
            var url = adminPath + `api/customer/orders/refundRequests/${_id}`;
            JSAjaxRequest(url, "GET", true, null, null, function (require, success, response) {
                JSSetLoading(true);
                if (success) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.success) {
                        var history = me.controller.getRefundApplyHistory(_id);
                        console.log(history);
                        var recordData = responseText.data;
                        recordData = Ext.Object.merge(initData, recordData);
                        var lastStatus = history[history.length - 1];
                        recordData.history = history;
                        recordData.remark = lastStatus.remark;
                        recordData.importServiceAmount = recordData.importServiceAmount || 0;
                        recordData.allRefundAmount = (recordData.productsAmount + recordData.shippingAmount + recordData.salesTaxAmount);
                        recordData.aimStatus = JSGetQueryString('aimStatus');
                        //退部分产品的申请，重新数据
                        var refundItems = [];
                        me.allOrderItems.map(function (orderItem) {
                            var itemData = {
                                "_id": orderItem.id,
                                "productInstanceId": orderItem.productInstanceId,
                                "productId": orderItem.productId,
                                "productDescription": orderItem.productDescription,
                                "price": orderItem.unitPriceValue,
                                "amount": orderItem.amount,
                                "priceStr": orderItem.price,
                                "amountStr": orderItem.amount,
                                "productWeight": orderItem.productWeight,
                                "productSumWeight": orderItem.totalWeight,
                                "qty": orderItem.qty,
                                "productName": orderItem.productName,
                                "productSku": orderItem.productSku,
                                "thumbnail": orderItem.productInstanceThumbnail,
                                "refundQty": 0,
                                "canRefundedQty": orderItem.qty,
                                "qtyRefunded": 0,
                                "canRefundedPrice": orderItem.amountValue,
                                "amountRefunded": 0,
                            };
                            refundItems.push(itemData);
                        });
                        if (recordData.type == 'Product') {
                            refundItems = recordData.refundItems.map(function (refundItem) {
                                var result = null;
                                refundItems.map(function (orderItem) {
                                    var itemId = orderItem._id;
                                    if (itemId == refundItem.orderItem._id) {
                                        result = Ext.Object.merge(orderItem, {
                                            "refundQty": refundItem.refundQty,
                                            "qtyRefunded": refundItem.refundQty,
                                            "amountRefunded": refundItem.refundAmount,
                                        });
                                    }
                                });
                                return result;
                            });
                        }
                        recordData.refundItems = refundItems;
                        console.log(recordData);

                        //其他处理
                        //查看状态下只读
                        if (JSGetQueryString('action') == 'check') {
                            //查看状态
                            if (JSGetQueryString('aimStatus') == 'Cancelled' || JSGetQueryString('aimStatus') == 'Refunded') {
                                me.addOperator(JSGetQueryString('aimStatus'));
                            }
                            me.setValue(recordData);
                            btnSave.hide();
                            me.setReadOnly();
                        } else {

                            //取消和退款
                            btnSave.show();
                            me.setValue(recordData);
                            me.setReadOnly();
                            if (JSGetQueryString('aimStatus') == 'Cancelled') {
                                btnSave.setText('取消申请');
                                me.addOperator(JSGetQueryString('aimStatus'));
                            } else if (JSGetQueryString('aimStatus') == 'Refunded') {
                                btnSave.setText('确定退款');
                                me.addOperator(JSGetQueryString('aimStatus'));
                            }
                        }
                    }
                }
            });
        } else {
            //新建
            //订单价格相关信息
            btnSave.show();
            var data = initData;
            me.setValue(data);
            JSSetLoading(false);
        }
    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.custormer_order_refund.controller.Controller');
        var currencyCode = me.customerOrderInfo.currency.code;
        var createOrEdit = JSGetQueryString('_id') ? 'edit' : 'create';
        //根据订单信息生产付款信息
        me.addEvents(['productRefundChange', 'productQtyChange', 'allRefundAmountChange']);//监听产品退款金额的变化
        me.items = [
            {
                xtype: 'hiddenfield',
                fieldLabel: i18n.getKey('_id'),
                name: '_id',
                itemId: '_id',
            },
            {
                xtype: 'displayfield',
                name: 'requestNo',
                itemId: 'requestNo',
                hidden: true,
                fieldLabel: i18n.getKey('退款申请单号'),
                diySetValue: function (data) {
                    if (data) {
                        this.setValue(data);
                        this.show();
                    }
                }
            },
            {
                xtype: 'displayfield',
                name: 'orderId',
                itemId: 'orderId',
                fieldLabel: i18n.getKey('Customer订单Id'),
            },
            {
                xtype: 'displayfield',
                name: 'customerOrderNumber',
                itemId: 'customerOrderNumber',
                fieldLabel: i18n.getKey('Customer订单号'),
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'paymentMethod',
                itemId: 'paymentMethod',
                fieldLabel: i18n.getKey('订单付款方式'),
                defaults: {},
                layout: {
                    type: 'hbox',
                },
                items: [
                    {
                        xtype: 'displayfield',
                        flex: 1,
                        readOnly: true,
                        name: 'paymentMethod',
                        itemId: 'paymentMethod',
                        editable: false,
                        displayField: 'display',
                        valueField: 'value',
                        store: {
                            fields: [
                                'value', 'display'
                            ],
                            data: [
                                {
                                    value: 'PayPal',
                                    display: i18n.getKey('PayPal')
                                },
                                {
                                    value: 'Braintree',
                                    display: i18n.getKey('Chargeback–Braintree')
                                },
                                {
                                    value: 'Others',
                                    display: i18n.getKey('Others')
                                }
                            ]
                        },
                    },
                    {
                        xtype: 'button',
                        margin: '0px 0px 0px 5px',
                        width: 100,
                        text: i18n.getKey('打开付款网站'),
                        handler: function (btn) {
                            var fieldSet = btn.ownerCt;
                            var paymentMethod = fieldSet.getComponent('paymentMethod');
                            var str = paymentMethod.getValue().toLowerCase();
                            if (str == 'PayPal'.toLowerCase()) {
                                window.open('https://www.paypal.com');
                            } else if (str == 'Braintree'.toLowerCase()) {
                                window.open('https://www.braintreepayments.com');
                            }
                        }
                    }
                ],
                setReadOnly: function () {
                    var me = this;
                },
                diySetValue: function (data) {
                    var paymentMethod = this.getComponent('paymentMethod');
                    paymentMethod.setValue(data);
                },
                diyGetValue: function () {
                    var paymentMethod = this.getComponent('paymentMethod');
                    return paymentMethod.getValue();
                }
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('退款订单类型'),
                name: 'refundOrderType',
                itemId: 'refundOrderType',
                editable: false,
                displayField: 'display',
                valueField: 'value',
                value: 'CustomerOrder',
                tipInfo: JSUbbToHtml('WhiteLabelOrder：WhiteLabel订单退款\n' + 'SalesOrder：销售订单退款\n' + 'CustomerOrder：Customer订单退款\n'),
                store: {
                    fields: ['value', 'display'],
                    data: [
                        //其他的就是外部的
                        {
                            value: 'WhiteLabelOrder',
                            display: 'WhiteLabelOrder'
                        },
                        //partner类型是内部就是SalesOrder
                        {
                            value: 'SalesOrder',
                            display: 'SalesOrder'
                        },
                        {
                            value: 'CustomerOrder',
                            display: 'CustomerOrder'
                        },
                    ]
                },
            },
            {
                xtype: 'displayfield',
                width: 750,
                name: 'priceInfoStr',
                itemId: 'priceInfoStr',
                value: me.priceInfoStr,
                fieldLabel: i18n.getKey('实付金额'),
            },
            {
                xtype: 'hiddenfield',
                name: 'paymentAmount',
                itemId: 'paymentAmount',
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('用户付款交易号'),
                name: 'paymentTranId',
                allowBlank: false,
                itemId: 'paymentTranId',
                vtype: 'alphanum'
            },
            {
                //网站配置中的配置
                xtype: 'combobox',
                fieldLabel: i18n.getKey('退款申请来源'),
                name: 'from',
                itemId: 'from',
                editable: false,
                allowBlank: false,
                displayField: 'display',
                valueField: 'value',
                store: Ext.create('CGP.orderrefund.store.RefundFromStore', {}),
            },
            {
                xtype: 'combobox',
                fieldLabel: i18n.getKey('退款类型'),
                name: 'type',
                itemId: 'type',
                editable: false,
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
                mapping: {
                    'common': [],
                    'FullOrder': ['refundItems']
                },
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        var customerOrderInfo = form.customerOrderInfo;
                        var refundItems = form.getComponent('refundItems');
                        var productsAmount = form.getComponent('productsAmount');
                        var shippingAmount = form.getComponent('shippingAmount');
                        var salesTaxAmount = form.getComponent('salesTaxAmount');
                        var allRefundAmount = form.getComponent('allRefundAmount');
                        var importServiceAmount = form.getComponent('importServiceAmount');
                        var arr = [refundItems, productsAmount, shippingAmount, salesTaxAmount, allRefundAmount, importServiceAmount];
                        if (newValue == 'FullOrder') {
                            //直接填入订单数据，全为禁用
                            arr.map(function (item) {
                                item.setReadOnly(true);
                                item.setFieldStyle('background-color: silver');
                            });
                            refundItems.setVisible(false);
                            productsAmount.setValue(customerOrderInfo.refundAbleProductsPrice);
                            shippingAmount.setValue(customerOrderInfo.refundAbleShippingPrice);
                            salesTaxAmount.setValue(customerOrderInfo.refundAblePaidSalesTax);
                            importServiceAmount.setValue(customerOrderInfo.refundAbleImportService);
                            allRefundAmount.setValue(customerOrderInfo.refundedTotalPrice);
                        } else if (newValue == 'Product') {
                            arr.map(function (item) {
                                item.setReadOnly(true);
                                item.setFieldStyle('background-color: silver');
                            });
                            productsAmount.setValue(0);
                            refundItems.setVisible(true);
                            refundItems.setReadOnly(false);
                            salesTaxAmount.setReadOnly(false);
                            salesTaxAmount.setFieldStyle('background-color: white');
                            shippingAmount.setFieldStyle('background-color: white');
                            shippingAmount.setReadOnly(false);
                        } else if (newValue == 'ShippingFee') {
                            refundItems.setVisible(false);
                            productsAmount.setValue(0);
                            shippingAmount.setValue(customerOrderInfo.refundAbleShippingPrice);
                            salesTaxAmount.setValue(0);
                            allRefundAmount.setValue(customerOrderInfo.refundAbleShippingPrice);
                            arr.map(function (item) {
                                if (item.itemId == 'shippingAmount') {
                                    item.setReadOnly(false);
                                    item.setFieldStyle('background-color: white');
                                } else {
                                    item.setReadOnly(true);
                                    item.setFieldStyle('background-color: silver');
                                }
                            });
                        } else if (newValue == 'SalesTax') {
                            refundItems.setVisible(false);
                            productsAmount.setValue(0);
                            shippingAmount.setValue(0);
                            salesTaxAmount.setValue(customerOrderInfo.refundAblePaidSalesTax);
                            allRefundAmount.setValue(customerOrderInfo.refundAblePaidSalesTax);
                            arr.map(function (item) {
                                if (item.itemId == 'salesTaxAmount') {
                                    item.setReadOnly(false);
                                    item.setFieldStyle('background-color: white');
                                } else {
                                    item.setReadOnly(true);
                                    item.setFieldStyle('background-color: silver');
                                }
                            });
                        } else if (newValue == 'ImportService') {
                            refundItems.setVisible(false);
                            productsAmount.setValue(0);
                            importServiceAmount.setValue(customerOrderInfo.refundAbleImportService);
                            arr.map(function (item) {
                                if (item.itemId == 'importServiceAmount') {
                                    item.setReadOnly(false);
                                    item.setFieldStyle('background-color: white');
                                } else {
                                    item.setReadOnly(true);
                                    item.setFieldStyle('background-color: silver');
                                }
                            });
                        } else if (newValue == 'Other') {
                            refundItems.setVisible(false);
                            productsAmount.setFieldStyle('background-color: white');
                            productsAmount.setReadOnly(false);
                            allRefundAmount.setFieldStyle('background-color: silver');
                            allRefundAmount.setReadOnly(true);
                            shippingAmount.setFieldStyle('background-color: white');
                            shippingAmount.setReadOnly(false);
                            salesTaxAmount.setFieldStyle('background-color: white');
                            salesTaxAmount.setReadOnly(false);
                            importServiceAmount.setFieldStyle('background-color: white');
                            importServiceAmount.setReadOnly(false);
                        }
                    },
                    afterrender: function (field) {
                        //新建时
                        if (Ext.isEmpty(JSGetQueryString('_id'))) {
                            setTimeout(function () {
                                field.setValue('FullOrder');
                            }, 500);
                        }
                    }
                }
            },
            {
                xtype: 'refund_items_gridfield',
                currencyCode: currencyCode,
                allowRefundItems: Ext.clone(me.allowRefundItemsInfo?.orderLineItems),
                width: 1350,
                name: 'refundItems',
                itemId: 'refundItems',
                valueType: 'idRef',
                hidden: true,
                isFormField: true,
            },
            {
                xtype: 'hiddenfield',
                name: 'currencyCode',
                itemId: 'currencyCode',
                value: currencyCode,
            },
            {
                xtype: 'numberfield',
                name: 'productsAmount',
                itemId: 'productsAmount',
                readOnly: true,
                allowBlank: false,
                minValue: 0,
                maxValue: createOrEdit == 'create' ? me.customerOrderInfo.refundAbleProductsPrice : null,
                fieldStyle: 'background-color: silver',
                tipInfo: '该项的最大值为可退产品总金额<br>当退部分产品计算出来的价格大于总价时,请自行调整订单项里面退款总额数值',
                fieldLabel: i18n.getKey('退产品金额') + '(' + me.currencySymbol + ')',
                vtype: 'maxValue',
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        form.modifyAllRefundAmount();
                    }
                }
            },
            {
                xtype: 'numberfield',
                name: 'shippingAmount',
                itemId: 'shippingAmount',
                readOnly: true,
                allowBlank: false,
                minValue: 0,
                maxValue: createOrEdit == 'create' ? me.customerOrderInfo.refundAbleShippingPrice : null,
                fieldStyle: 'background-color: silver',
                fieldLabel: i18n.getKey('退产品运费') + '(' + me.currencySymbol + ')',
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        form.modifyAllRefundAmount();
                    }
                },
            },
            {
                xtype: 'numberfield',
                name: 'salesTaxAmount',
                itemId: 'salesTaxAmount',
                readOnly: true,
                allowBlank: false,
                minValue: 0,
                fieldStyle: 'background-color: silver',
                maxValue: createOrEdit == 'create' ? me.customerOrderInfo.refundAblePaidSalesTax : null,
                fieldLabel: i18n.getKey('退销售税') + '(' + me.currencySymbol + ')',
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        form.modifyAllRefundAmount();
                    }
                }
            },
            {
                xtype: 'numberfield',
                name: 'importServiceAmount',
                itemId: 'importServiceAmount',
                readOnly: true,
                allowBlank: false,
                minValue: 0,
                value: 0,
                fieldStyle: 'background-color: silver',
                maxValue: createOrEdit == 'create' ? me.customerOrderInfo.refundAbleImportService : null,
                fieldLabel: i18n.getKey('退Import Service') + '(' + me.currencySymbol + ')',
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        form.modifyAllRefundAmount();
                    }
                }
            },
            {
                xtype: 'numberfield',
                name: 'allRefundAmount',
                itemId: 'allRefundAmount',
                readOnly: true,
                allowBlank: false,
                minValue: 0,
                fieldStyle: 'background-color: silver',
                fieldLabel: i18n.getKey('退款总金额') + '(' + me.currencySymbol + ')',

            },
            {
                xtype: 'relate_qpson_order_info_gridfield',
                width: 1200,
                name: 'document',
                itemId: 'document',
                currencyCode: currencyCode,
                fieldLabel: i18n.getKey('关联的QPSON订单信息'),

            },
            {
                xtype: 'numberfield',
                readOnly: true,
                name: 'reduceRevenue',
                itemId: 'reduceRevenue',
                fieldStyle: 'background-color: silver',
                fieldLabel: i18n.getKey('减少的盈余') + '(' + me.currencySymbol + ')',
            },
            {
                xtype: 'numberfield',
                readOnly: true,
                name: 'revenue',
                itemId: 'revenue',
                fieldStyle: 'background-color: silver',
                fieldLabel: i18n.getKey('剩下的盈余') + '(' + me.currencySymbol + ')',
            },
            {
                xtype: 'textarea',
                name: 'reason',
                height: 80,
                allowBlank: false,
                itemId: 'reason',
                fieldLabel: i18n.getKey('退款原因'),
            },
            {
                xtype: 'combobox',
                name: 'state',
                itemId: 'state',
                fieldLabel: i18n.getKey('当前状态'),
                editable: false,
                displayField: 'displayName',
                valueField: 'key',
                readOnly: true,
                fieldStyle: 'background-color: silver',
                store: Ext.create('CGP.common.store.StateNode', {
                    flowModule: 'refund_request'
                }),
            },

            {
                xtype: 'displayfield',
                name: 'createdUser',
                itemId: 'createdUser',
                fieldLabel: i18n.getKey('退款申请人'),
                diySetValue: function (data) {
                    var me = this;
                    me.date = data;
                    if (data) {
                        me.setValue(data.emailAddress || data.email);
                    }
                },
            },
            {
                xtype: 'displayfield',
                name: 'createdDate',
                itemId: 'createdDate',
                fieldLabel: i18n.getKey('申请时间'),
                hidden: Ext.isEmpty(JSGetQueryString('_id')),
                date: null,
                diyGetValue: function () {
                    return this.date;
                },
                diySetValue: function (data) {
                    var me = this;
                    me.date = data;
                    if (data) {
                        me.setValue(Ext.Date.format(new Date(Number(data)), 'Y/m/d H:i'));
                    }
                },
            },
        ];
        //创建延时任务
        me.createUpdateQPSONOrderInfo();
        me.callParent(arguments);
    }
}, function () {
    //文件加载后执行
    Ext.apply(Ext.form.VTypes, {
        maxValue: function (value, field) {//验证方法名
            if (value > field.maxValue) {
                field.setValue(field.maxValue);
                setTimeout(function () {
                    field.clearInvalid();
                }, 100);
            }
            return true;
        },
        maxValueText: '超过最大值'
    });
});