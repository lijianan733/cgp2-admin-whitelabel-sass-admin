/**
 * @Description:
 * @author nan
 * @date 2025.05.22
 */
Ext.define('CGP.custormer_order_refund.controller.Controller', {
    /**
     * 获取订单信息
     */
    getCustomerOrderInfo: function (customerOrderId) {
        var url = '';
        url = adminPath + 'api/background/store/orders/v1?page=1&start=0&limit=20' +
            '&filter=[{"name":"_id","value":"' + customerOrderId + '","type":"string"}]';
        var result = null;
        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data.content[0];
                }
            }
        });
        return result;
    },
    /**
     * 同步请求customer订单项数据
     * @param customerOrderId
     */
    getOrderItems: function (customerOrderId) {
        var result = [];
        var url = adminPath + `api/background/store/orders/${customerOrderId}/items/v1?page=1&start=0&limit=20`;
        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data.content;
                }
            }
        });
        return result;
    },
    /**
     *  获取到代处理的退款申请列表
     * @param customerOrderId
     */
    getRefundApplies: function (customerOrderId) {
        var url = adminPath + 'api/customer/orders/refundRequests' +
            '?page=1&start=0&limit=25' +
            `&filter=[{"name":"order._id","value":"${customerOrderId}","type":"number"}]`;
        var result = [];
        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data.content;
                    result = result.filter(function (item) {
                        if (item.state == "Cancelled") {
                            return false;
                        } else {
                            return true;
                        }
                    });
                }
            }
        });
        return result;
    },
    /**
     *
     * @param customerOrderInfo 销售订单信息
     * @param refundApply 退款申请信息
     * @returns {string}
     */
    buildPriceInfo: function (customerOrderInfo, priceInfo) {
        var accountInfo = {
            /*
                  "paymentAmount": 330,
                  "shippingPrice": 130,
                  "productsPrice": 200,
                  "paddingPrice": 10,
                  "paddingDesc": "偏远地区附加费",
                  "tax": 10,
                  "paidSaleTax": 1,
                  "discountAmount": 20,
                  "totalRefundedAmount": 0,
                  "canRefundProductsPrice": 178,
                  "canRefundSaleTax": 9,
                  "canRefundShippingPrice": 110
              */
        };
        /*    var url = adminPath + `api/customer/orders/${customerOrderId}/amountInfo`;
            JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
                if (success) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (success) {
                        console.log(responseText.data)
                        accountInfo = responseText.data;
                    }
                }
            });*/
        accountInfo = priceInfo;
        //总价
        var totalPrice = accountInfo.paymentAmount;
        //产品总零售价
        var productsPrice = accountInfo.productsPrice
        //总运费
        var shippingPrice = accountInfo.shippingPrice;
        //额外费用
        var paddingPrice = 0;
        //税金
        var tax = accountInfo.tax;
        //折扣金额
        var discountAmount = accountInfo.discountAmount;
        //现金券
        var rewardCredit = customerOrderInfo.rewardCredit || 0;
        //银行转账优惠金额
        var bankTransferDiscount = 0;
        //已收美国销售税金
        var paidSalesTax = 0;

        //已退总金额
        var refundedTotalPrice = 0;
        refundedTotalPrice = accountInfo.totalRefundedAmount;
        //已退产品总金额
        var refundedProductsPrice = 0;
        //已退销售税
        var refundedPaidSalesTax = 0;
        //已退运费总金额
        var refundedShippingPrice = 0;

        //可退产品总金额
        var refundAbleProductsPrice = 0;//产品总价-已退产品总额-折扣-现金券-银行转账优惠
        refundAbleProductsPrice = accountInfo.canRefundProductsPrice;
        //可退銷售稅
        var refundAblePaidSalesTax = 0;
        refundAblePaidSalesTax = accountInfo.canRefundSaleTax;

        //可退运费总金额
        var refundAbleShippingPrice = 0;
        refundAbleShippingPrice = accountInfo.canRefundShippingPrice;

        //盈余
        var revenue = 0;
        revenue = accountInfo.revenue;
        //importServiceAmount
        var importServiceAmount = 0;
        importServiceAmount = accountInfo.importServiceAmount;
        //可退importService
        var canRefundImportService = accountInfo.canRefundImportService;
        //可退款数据
        customerOrderInfo.refundedTotalPrice = accountInfo.totalRefundedAmount;
        customerOrderInfo.refundAbleProductsPrice = accountInfo.canRefundProductsPrice;
        customerOrderInfo.refundAblePaidSalesTax = accountInfo.canRefundSaleTax;
        customerOrderInfo.refundAbleImportService = accountInfo.canRefundImportService;
        customerOrderInfo.refundAbleShippingPrice = accountInfo.canRefundShippingPrice;
        customerOrderInfo.refundAbleRevenue = 0;
        var currencyCode = customerOrderInfo?.currency?.code;
        var convert = function (value) {
            return Number(value).toLocaleString('zh', {
                style: 'currency',
                currency: currencyCode
            });
        };


        return `${convert(totalPrice)}  ( 产品总价 ${convert(productsPrice)}; 总运费 ${convert(shippingPrice)} ;` +
            `  附加费用 ${convert(paddingPrice)}; `+
            `  稅金 ${convert(tax)}(含销售税 ${convert(paidSalesTax)}); ` +
            `  折扣 ${discountAmount}(含银行转账优惠金额 ${bankTransferDiscount}); ` +
            `  ImportService ${convert(importServiceAmount)}; `+
            `  盈余 ${convert(revenue)}; ` +
            `  <font color="red">已退</font>总金额 ${convert(refundedTotalPrice)}; `+
            `  <font color="green">可退</font>产品总金额 ${convert(refundAbleProductsPrice)}; ` +
            `  <font color="green">可退</font>运费总额 ${convert(refundAbleShippingPrice)}; ` +
            `  <font color="green">可退</font>销售税 ${convert(refundAblePaidSalesTax)}; `+
            `  <font color="green">可退</font>ImportService ${convert(canRefundImportService)}); `;

    },
    /**
     * 获取可退款订单项
     */
    getAllowRefundItems: function (customerOrderId) {
        var info = [];
        var url = adminPath + `api/customer/orders/${customerOrderId}/refund/infos`;
        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (success) {
                    info = responseText?.data;
                }
            }
        });
        return info;
    },
    /**
     * 创建退款申请
     */
    createRefundApply: function (data) {
        var url = adminPath + 'api/customer/orders/refundRequests';
        JSAjaxRequest(url, 'POST', true, data, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '创建退款申请成功', function () {
                        var data = responseText.data;
                        JSOpen({
                            id: 'custormer_order_refundpage',
                            url: path + 'partials/custormer_order_refund/main.html' +
                                '?requestNo=' + data.requestNo,
                            title: '退款申请',
                            refresh: true
                        });
                        top.Ext.getCmp('tabs').getComponent('customer_orderrefund_edit')?.close();
                    });
                }
            }
            JSSetLoading(false);
        });
    },
    /**
     * 改变退款申请状态
     */
    changeRefundApplyStatus: function (data) {
        var url = adminPath + 'api/partner/flowInstances/entity/' + data._id + '/stateInstances';
        var jsonData = {
            "actionKey": data.state,
            "data": {
                refundTranId: data.refundTranId,
                clazz: "com.qpp.cgp.domain.entity.data.RefundRequestUpdateData"
            },
            "remark": data.remark
        };
        var msg = '';
        if (jsonData.actionKey == 'Refunded') {
            msg = '退款成功';
        } else if (jsonData.actionKey == 'Cancelled') {
            msg = '取消退款申请成功';
        }
        JSAjaxRequest(url, 'POST', true, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), msg, function () {
                        JSOpen({
                            id: 'custormer_order_refundpage',
                            url: path + 'partials/custormer_order_refund/main.html' +
                                '?requestNo=' + data.requestNo,
                            title: '退款申请',
                            refresh: true
                        });
                        top.Ext.getCmp('tabs').getComponent('customer_orderrefund_edit')?.close();
                    });
                }
            }
            JSSetLoading(false);
        });
    },
    /**
     * 获取货币信息
     * @returns {*[]}
     */
    getCurrencyInfo: function () {
        var url = adminPath + 'api/currencies?page=1&start=0&limit=25&filter=[{"name":"website.id","value":11,"type":"number"}]';
        var result = [];
        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data.content;
                }
            }
        });
        return result;
    },
    getCurrencyNote: function (currencyStore, customerOrderInfo) {
        var currencyCode = customerOrderInfo.currency;
        return currencyCode?.symbolLeft;
    },
    /**
     * 获取订单的操作历史
     */
    getRefundApplyHistory: function (applyId) {
        var url = adminPath + 'api/partner/flowInstances/entity/' + applyId + '/stateInstances';
        var result = [];
        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
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
     * 是否允许新建退款申请
     */
    isAllowCreate: function (_id, allowRefundItems, customerOrderInfo,) {
        var controller = this;
        if (Ext.isEmpty(_id)) {
            //新建

            /*        //订单状态为指定状态不能新建
                    //不可以创建申请的状态 40 41 42 43 44 100
                    var orderStatusId = customerOrderInfo.status.id;
                    if (Ext.Array.contains([40, 41, 42, 43, 44, 100, 36585000], Number(orderStatusId))) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('该订单状态不允许创建退款申请.'), function () {
                            JSOpen({
                                id: 'custormer_order_refundpage',
                                url: path + 'partials/custormer_order_refund/main.html',
                                title: i18n.getKey('refundApply'),
                                refresh: true
                            });
                            top.Ext.getCmp('tabs').getComponent('customer_orderrefund_edit')?.close();
                        });
                        throw new Error();
                    }*/
            //PopUp类型的订单才能退款
            if (customerOrderInfo?.storeInfo?.platformCode != 'PopUp') {
                Ext.Msg.alert('提示', '只有PopUp平台的订单可以申请退款.');
                throw new Error();
            }
            //有待处理的退款申请时,不能新建
            var gotoEditPage = function (msg) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey(msg), function () {
                    JSOpen({
                        id: 'custormer_order_refundpage',
                        url: path + 'partials/custormer_order_refund/main.html' +
                            '?order._id=' + customerOrderInfo._id,
                        title: i18n.getKey('退款申请'),
                        refresh: true
                    });
                    top.Ext.getCmp('tabs').getComponent('customer_orderrefund_edit')?.close();
                });
            }
            //获取已存在的退款申请
            var refundApplies = controller.getRefundApplies(customerOrderInfo._id);
            if (refundApplies.length > 0) {
                var isValid = true;
                refundApplies.map(function (item) {
                    if (item.state == 'PendingRefund') {
                        isValid = false;
                    }
                });
                if (isValid == false) {
                    gotoEditPage('该订单有待处理的退款申请,请先处理已有退款申请.');
                    throw new Error();
                }
            }
            //可退产品总金额 $0; 可退销售税 $0 ; 可退运费总额 $0 ;可退importService时不能创建退款申请
            //可退产品总金额refundAbleProductsPrice
            //可退銷售稅refundAblePaidSalesTax
            //可退运费总金额refundAbleShippingPrice
            //可退importService金额refundAbleImportService
            if (customerOrderInfo.refundAbleProductsPrice <= 0 &&
                customerOrderInfo.refundAblePaidSalesTax <= 0 &&
                customerOrderInfo.refundAbleShippingPrice <= 0) {
                gotoEditPage('该订单已无可退款项,请查看退款申请.');
                throw new Error();
            }
            if (customerOrderInfo.isSuccessPay == false) {
                gotoEditPage('该订单没完成付款流程,无法申请退款.');
                throw new Error();
            }
        }
    },
    /**
     * 获取到关联的qpson订单信息
     */
    getRelateQpsonOrderInfo: function (customerOrderId, data, callBack) {
        //判断是否是相同数据
        var url = adminPath + `api/customer/orders/${customerOrderId}/amount/calculate`;
        var jsonData = data;
        var result = '';
        JSAjaxRequest(url, "POST", false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data;
                }
            }
        });
        callBack ? callBack(result) : null;
        return result;
    },
    getPriceInfo: function (customerOrderId) {
        var result = {};
        var url = adminPath + `api/customer/orders/${customerOrderId}/amountInfo`;
        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data;
                }
            }
        }, true);
        return result;
    },
})