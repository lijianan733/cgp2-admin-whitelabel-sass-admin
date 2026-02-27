/**
 * @Description:校验是否可以新建退货申请,当有一条带处理时就不能继续新建
 * 状态有 PendingRefund,Cancelled,Refunded
 * @author nan
 * @date 2022/12/7
 */
Ext.Loader.syncRequire([
    'Ext.ux.toolbar.Edit',
    'CGP.orderrefund.model.OrderItemModel',
    'CGP.orderrefund.model.OrderRefundModel',
    'CGP.orderrefund.view.RefundItemsGridField'
])
Ext.define('CGP.orderrefund.view.DetailForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.detailform',
    model: 'CGP.zone.model.Zone',
    remoteCfg: false,
    autoScroll: true,
    layout: {
        type: 'vbox'
    },
    defaults: {
        width: 350,
        margin: '5 25 0 25',
        msgTarget: 'side',
        labelAlign: 'right'
    },
    aimStatus: null,//目标转态
    controller: null,
    orderId: null,
    orderNo: '',
    orderInfo: null,//订单信息
    currencySymbol: '',//货币标识
    allOrderItems: null,//订单所有的订单项
    saleOrderInfo: null,//销售订单信息
    refundApplies: null,//该订单的所有退款申请
    allowRefundItems: null,//可退款订单项
    priceInfo: null,//价格相关信息
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
            handler: function (view) {
                var form = view.ownerCt.ownerCt;
                if (form.isValid()) {
                    JSSetLoading(true);
                    var value = form.getValue();
                    var data = Ext.Object.merge(value, {
                        "currencyCode": form.saleOrderInfo.currencyCode || form.saleOrderInfo.baseCurrencyCode,
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
                    id: 'orderrefundpage',
                    url: path + 'partials/orderrefund/main.html',
                    refresh: true
                });
            }
        },
        btnConfig: {
            disabled: true,
            handler: function () {
            }
        },
        btnHelp: {
            handler: function () {
            }
        }
    },
    listeners: {
        afterrender: function () {
            var me = this;
            JSSetLoading(true);
            var user = Ext.JSON.decode(Ext.util.Cookies.get('user'));
            var priceInfo = me.priceInfo;
            var _id = JSGetQueryString('_id');
            //新建
            if (_id) {
                //编辑是，aimStatus目标状态
                CGP.orderrefund.model.OrderRefundModel.load(_id, {
                    scope: this,
                    failure: function (record, operation) {
                        //do something if the load failed
                    },
                    success: function (record, operation) {
                        var history = me.controller.getRefundApplyHistory(_id);
                        console.log(history);
                        var recordData = record.getData();
                        var lastStatus = history[history.length - 1];
                        recordData.priceInfo = priceInfo;
                        recordData.history = history;
                        recordData.remark = lastStatus.remark;
                        recordData.allRefundAmount = (recordData.productsAmount + recordData.shippingAmount + recordData.salesTaxAmount);
                        recordData.state = JSGetQueryString('aimStatus');
                        //退部分产品的申请，重新数据
                        if (recordData.type == 'Product') {
                            recordData.refundItems = me.controller.buildOrderItem(me.allOrderItems, me.saleOrderInfo.lineItems, me.allowRefundItems, recordData.refundItems);
                        }
                        console.log(recordData);
                        var btnSave = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('btnSave');
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
                    },
                    callback: function (record, operation) {
                        JSSetLoading(false);
                    }
                });
            } else {
                //新建
                //订单价格相关信息
                var data = {
                    paymentAmount: me.saleOrderInfo.paymentAmount,//付款总额
                    paymentTranId: me.saleOrderInfo.paymentTranId,//付款流水号
                    refundOrderType: me.refundOrderType,///
                    paymentMethod: me.saleOrderInfo.paymentMethod,
                    salesOrderNo: me.orderNo,
                    priceInfo: priceInfo,
                    orderId: me.orderId,
                    state: 'PendingRefund',
                    createdUser: user.email,
                    createdDate: Ext.Date.format(new Date(), 'Y/m/d H:i')
                };
                me.setValue(data);
                JSSetLoading(false);
            }
        },
        /**
         * 产品总价变了的处理
         * @param grid
         */
        productRefundChange: function (grid) {
            var form = this;
           ;
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
            var saleOrderInfo = form.saleOrderInfo;
            console.log('productQtyChange');
            JSSetLoading(true);
            setTimeout(function () {
                var selections = grid.getSelectionModel().getSelection();
                var items = [];
                for (var i = 0; i < selections.length; i++) {
                    var index = selections[i].index;
                    var qty = grid.query('[itemId*=refundQty_row_' + index + ']')[0];
                    var productId = selections[i].get('product').id;
                    var productPrice = selections[i].get('productPrice');
                    if (qty.getValue() > 0) {
                        items.push({
                            productPrice: productPrice,
                            qty: qty.getValue(),
                            productId: productId,
                        });
                    }
                }
                var shippingAmountField = form.getComponent('shippingAmount');
                if (items.length > 0 && JSGetQueryString('refundOrderType') == 'SalesOrder') {
                    var weight = form.calculateWeight(items);
                    var totalQty = 0;
                    var totalPrice = 0;
                    items.map(function (item) {
                        totalQty += item.qty;
                        totalPrice += Number(item.productPrice);
                    });
                    var shipInfo = {
                        countryCode: saleOrderInfo.shippingCountry,//国家代码
                        locationNo: null,//
                        locationType: saleOrderInfo.locationType,// 地址类型
                        shipZipCode: saleOrderInfo.shippingPostCode,//邮政编号
                        shippingMethodCode: saleOrderInfo.deliveryCode,//快递方式代码
                        stateCode: saleOrderInfo.shippingState,// 州代码
                        weight: weight,//产品总重量
                        price: totalPrice, //产品总价格
                        qty: totalQty,//产品总数量
                    };
                    var shippingAmount = form.calculateShippingAmount(shipInfo);
                    //现在默认货币都相同
                    shippingAmountField.setValue(shippingAmount.charges);
                } else {
                    shippingAmountField.setValue(0);
                }
                JSSetLoading(false);
            }, 100);
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
                        rejectReason.setVisible(newValue == 'Cancelled');
                        cancelUser.setVisible(newValue == 'Cancelled');
                        cancelDate.setVisible(newValue == 'Cancelled');
                        rejectReason.setDisabled(newValue != 'Cancelled');
                        cancelUser.setDisabled(newValue != 'Cancelled');
                        cancelDate.setDisabled(newValue != 'Cancelled');
                        var refundTranId = field.ownerCt.getComponent('refundTranId');
                        var remark = field.ownerCt.getComponent('remark');
                        var refundUser = field.ownerCt.getComponent('refundUser');
                        var refundDate = field.ownerCt.getComponent('refundDate');
                        refundTranId.setVisible(newValue == 'Refunded');
                        remark.setVisible(newValue == 'Refunded');
                        refundUser.setVisible(newValue == 'Refunded');
                        refundDate.setVisible(newValue == 'Refunded');
                        refundTranId.setDisabled(newValue != 'Refunded');
                        remark.setDisabled(newValue != 'Refunded');
                        refundUser.setDisabled(newValue != 'Refunded');
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
                        me.setValue(data);
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
                        me.setValue(data);
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
     * 产品计重
     */
    calculateWeight: function (data) {
        var url = adminPath + 'api/product/weight/calculate';
        var result = 0;
        console.log(data);
        var jsonData = {
            "productQtyList": data
        };
        JSAjaxRequest(url, 'POST', false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data;
                }
            }
        });
        return result;
    },
    /**
     * 计算当前所需运费,
     * items 为{productId，qty}信息数组
     */
    calculateShippingAmount: function (jsonData, callback) {
        var url = adminPath + 'api/shipping/calculate';
        var result = 0;
        JSAjaxRequest(url, 'POST', false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data;
                }
            }
        });
        return result;
    },
    initComponent: function () {
        var me = this;
        Ext.apply(Ext.form.VTypes, {
            maxValue: function (value, field) {//验证方法名
               ;
                if (value > field.maxValue) {
                    field.setValue(field.maxValue);
                    field.clearInvalid();
                }
                return true;
            },
            maxValueText: '超过最大值'
        });
        var currencyCode = me.saleOrderInfo.currencyCode || me.saleOrderInfo.baseCurrencyCode;
        var createOrEdit = JSGetQueryString('_id') ? 'edit' : 'create';
        //根据订单信息生产付款信息
        me.addEvents(['productRefundChange', 'productQtyChange']);//监听产品退款金额的变化\
        me.items = [
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('orderNumber'),
                name: 'orderNumber',
                itemId: 'orderNumber',
                hidden: true,
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.show();
                        me.setValue(data);
                    } else {
                        me.hide();
                    }
                }
            },
            {
                xtype: 'hiddenfield',
                fieldLabel: i18n.getKey('orderId'),
                name: 'orderId',
                itemId: 'orderId',
            },
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
                value: 'xxxxxx',
                diySetValue: function (data) {
                    if (data) {
                        this.setValue(data);
                        this.show();
                    }
                }
            },
            {
                xtype: 'displayfield',
                name: 'salesOrderNo',
                itemId: 'salesOrderNo',
                fieldLabel: i18n.getKey('关联订单号'),
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
                value: 'SalesOrder',
                tipInfo: JSUbbToHtml('WhiteLabelOrder：WhiteLabel订单退款\n' + 'SalesOrder：销售订单退款'),
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
                    ]
                },
            },
            {
                xtype: 'displayfield',
                width: 650,
                name: 'priceInfo',
                itemId: 'priceInfo',
                fieldLabel: i18n.getKey('实付金额'),
            },
            {
                xtype: 'hiddenfield',
                name: 'paymentAmount',
                itemId: 'paymentAmount',
                fieldLabel: i18n.getKey('实付金额'),
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
                        var saleOrderInfo = form.saleOrderInfo;
                        var refundItems = form.getComponent('refundItems');
                        var productsAmount = form.getComponent('productsAmount');
                        var shippingAmount = form.getComponent('shippingAmount');
                        var salesTaxAmount = form.getComponent('salesTaxAmount');
                        var allRefundAmount = form.getComponent('allRefundAmount');
                        var arr = [refundItems, productsAmount, shippingAmount, salesTaxAmount, allRefundAmount];
                        if (newValue == 'FullOrder') {
                            //直接填入订单数据，全为禁用
                            refundItems.setVisible(false);
                            arr.map(function (item) {
                                item.setReadOnly(true);
                                item.setFieldStyle('background-color: silver');
                            });
                            productsAmount.setValue(saleOrderInfo.refundAbleProductsPrice);
                            shippingAmount.setValue(saleOrderInfo.refundAbleShippingPrice);
                            salesTaxAmount.setValue(saleOrderInfo.refundAblePaidSalesTax);
                            allRefundAmount.setValue(
                                saleOrderInfo.refundAbleProductsPrice +
                                saleOrderInfo.refundAbleShippingPrice +
                                saleOrderInfo.refundAblePaidSalesTax
                            );
                        } else if (newValue == 'Product') {
                            refundItems.setVisible(true);
                            productsAmount.setReadOnly(true);
                            refundItems.setReadOnly(false);
                            productsAmount.setFieldStyle('background-color: silver');
                            allRefundAmount.setFieldStyle('background-color: silver');
                            salesTaxAmount.setFieldStyle('background-color: white');
                            shippingAmount.setFieldStyle('background-color: white');
                            shippingAmount.setReadOnly(false);
                            allRefundAmount.setReadOnly(true);
                            salesTaxAmount.setReadOnly(false);
                        } else if (newValue == 'ShippingFee') {
                            refundItems.setVisible(false);
                            productsAmount.setValue(0);
                            shippingAmount.setValue(saleOrderInfo.refundAbleShippingPrice);
                            salesTaxAmount.setValue(0);
                            allRefundAmount.setValue(saleOrderInfo.refundAbleShippingPrice);
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
                            salesTaxAmount.setValue(saleOrderInfo.refundAblePaidSalesTax);
                            allRefundAmount.setValue(saleOrderInfo.refundAblePaidSalesTax);
                            arr.map(function (item) {
                                if (item.itemId == 'salesTaxAmount') {
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
                allOrderItems:me.allOrderItems,
                width: 1500,
                name: 'refundItems',
                itemId: 'refundItems',
                valueType: 'idRef',
                hidden: true,
                labelAlign: 'right',
                isFormField: true,

            },
            {
                xtype: 'numberfield',
                name: 'productsAmount',
                itemId: 'productsAmount',
                readOnly: true,
                allowBlank: false,
                minValue: 0,
                maxValue: createOrEdit == 'create' ? me.saleOrderInfo.refundAbleProductsPrice : null,
                fieldStyle: 'background-color: silver',
                tipInfo: '该项的最大值为可退产品总金额<br>当退部分产品计算出来的价格大于总价时,请自行调整订单项里面退款总额数值',
                fieldLabel: i18n.getKey('退产品金额') + '(' + me.currencySymbol + ')',
                vtype: 'maxValue',
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        var productsAmount = form.getComponent('productsAmount').getValue();
                        var shippingAmountValue = form.getComponent('shippingAmount').getValue();
                        var salesTaxAmountValue = form.getComponent('salesTaxAmount').getValue();
                        var allRefundAmount = form.getComponent('allRefundAmount');
                        allRefundAmount.setValue(productsAmount + shippingAmountValue + salesTaxAmountValue);
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
                maxValue: createOrEdit == 'create' ? me.saleOrderInfo.refundAbleShippingPrice : null,
                fieldStyle: 'background-color: silver',
                fieldLabel: i18n.getKey('退产品运费') + '(' + me.currencySymbol + ')',
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        var productsAmount = form.getComponent('productsAmount').getValue();
                        var shippingAmountValue = form.getComponent('shippingAmount').getValue();
                        var salesTaxAmountValue = form.getComponent('salesTaxAmount').getValue();
                        var allRefundAmount = form.getComponent('allRefundAmount');
                        allRefundAmount.setValue(productsAmount + shippingAmountValue + salesTaxAmountValue);
                    }
                },
                tipInfo: '退部分产品时，该项自动计算得出的数值是通过当前后台根据产品和数量相关信息计算得出',
            },
            {
                xtype: 'numberfield',
                name: 'salesTaxAmount',
                itemId: 'salesTaxAmount',
                readOnly: true,
                allowBlank: false,
                minValue: 0,
                fieldStyle: 'background-color: silver',
                maxValue: createOrEdit == 'create' ? me.saleOrderInfo.refundAblePaidSalesTax : null,
                fieldLabel: i18n.getKey('退销售税') + '(' + me.currencySymbol + ')',
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        var productsAmount = form.getComponent('productsAmount').getValue();
                        var shippingAmountValue = form.getComponent('shippingAmount').getValue();
                        var salesTaxAmountValue = form.getComponent('salesTaxAmount').getValue();
                        var allRefundAmount = form.getComponent('allRefundAmount');
                        allRefundAmount.setValue(productsAmount + shippingAmountValue + salesTaxAmountValue);
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
                fieldLabel: i18n.getKey('status'),
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
            },
            {
                xtype: 'displayfield',
                name: 'createdDate',
                itemId: 'createdDate',
                fieldLabel: i18n.getKey('申请时间'),
                hidden: Ext.isEmpty(JSGetQueryString('_id')),
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setValue(Ext.Date.format(new Date(data), 'Y/m/d H:i'));
                    }
                },
            },
        ];
        me.callParent(arguments);
    }
})