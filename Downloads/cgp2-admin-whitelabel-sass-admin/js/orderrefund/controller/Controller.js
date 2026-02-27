/**
 * @Description:
 * @author nan
 * @date 2022/12/5
 */
Ext.define('CGP.orderrefund.controller.Controller', {
    /**
     * 获取订单信息
     */
    getOrderInfo: function (orderNo, orderId) {
        var url = '';
        if (orderNo) {
            url = adminPath + 'api/ordersV2?page=1&start=0&limit=20' +
                '&filter=[{"name":"orderNumber","value":"%' + orderNo + '%","type":"string"}]';
        } else if (orderId) {
            url = adminPath + 'api/ordersV2?page=1&start=0&limit=20' +
                '&filter=[{"name":"_id","value":"' + orderId + '","type":"string"}]';
        }
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
     * 同步请求订单数据
     * @param orderId
     */
    getOrderItems: function (orderId) {
        var url = adminPath + 'api/orders/' + orderId + '/lineItemsV2';
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
     *  获取到已经申请的退货申请,去除掉状态为已取消的
     * @param orderId
     */
    getRefundApplies: function (orderId) {
        var url = adminPath + 'api/orders/' + orderId + '/refundRequests';
        var result = [];
        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data || [];
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
     * 获取订单的交易相关数据
     * @param orderId
     * @returns {*[]}
     */
    getSaleOrderInfo: function (orderId, refundOrderType = 'SalesOrder', orderInfo) {
        if (refundOrderType == 'SalesOrder') {
            var url = adminPath + 'api/orders/' + orderId + '/salesOrders';
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
        } else if (refundOrderType == 'WhiteLabelOrder') {
            //获取订单，和订单项数据组成对应结构
            var url = adminPath + 'api/orders/' + orderId + '/generateRefundRequestDto';
            var result = [];
            JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
                if (success) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.success) {
                        result = responseText.data;
                    }
                }
            });
            orderInfo.lineItems = result.orderLineItems;
            orderInfo = Ext.Object.merge(orderInfo, result);
            return orderInfo;
        }
    },
    /**
     *
     * @param saleOrderInfo 销售订单信息
     * @param refundApply 退款申请信息
     * @returns {string}
     */
    buildPriceInfo: function (saleOrderInfo, refundApplies, currencySymbol) {
        var orderId = JSGetQueryString('orderId');
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
        var url = adminPath + 'api/orders/' + orderId + '/amountInfo?refundOrderType=' + JSGetQueryString('refundOrderType');
        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (success) {
                    console.log(responseText.data)
                    accountInfo = responseText.data;
                }
            }
        });
        //总价
        var totalPrice = accountInfo.paymentAmount;
        //产品总零售价
        var productsPrice = accountInfo.productsPrice
        //总运费
        var shippingPrice = accountInfo.shippingPrice;
        //额外费用
        var paddingPrice = accountInfo.paddingPrice;
        //税金
        var tax = accountInfo.tax;
        //折扣金额
        var discountAmount = accountInfo.discountAmount;
        //现金券
        var rewardCredit = saleOrderInfo.rewardCredit || 0;
        //银行转账优惠金额
        var bankTransferDiscount = saleOrderInfo.bankTransferDiscount || 0;
        //已收美国销售税金
        var paidSalesTax = saleOrderInfo.paidSalesTax || 0;

        //已退总金额
        var refundedTotalPrice = 0;
        //已退产品总金额
        var refundedProductsPrice = 0;
        //已退销售税
        var refundedPaidSalesTax = 0;
        //已退运费总金额
        var refundedShippingPrice = 0;

        //可退产品总金额
        var refundAbleProductsPrice = 0;//产品总价-已退产品总额-折扣-现金券-银行转账优惠
        //可退銷售稅
        var refundAblePaidSalesTax = 0;
        //可退运费总金额
        var refundAbleShippingPrice = 0;


        /*     refundApplies.map(function (item) {
                 //只有退款的状态申请进行统计
                 if (item.state == 'Refunded') {
                     refundedProductsPrice += item.productsAmount;
                     refundedShippingPrice += item.shippingAmount;
                     refundedPaidSalesTax += item.salesTaxAmount;
                 }
             });
             refundedTotalPrice += (refundedProductsPrice + refundedShippingPrice + refundedPaidSalesTax);
             refundAbleProductsPrice = productsPrice - refundedProductsPrice - discountAmount;
             refundAblePaidSalesTax = paidSalesTax - refundedPaidSalesTax;
             refundAbleShippingPrice = shippingPrice - refundedShippingPrice;*/

        //可退金額信息為總-去已經退款申請-待處理申請
        refundedTotalPrice = accountInfo.totalRefundedAmount;
        refundAbleProductsPrice = accountInfo.canRefundProductsPrice;
        refundAblePaidSalesTax = accountInfo.canRefundSaleTax;
        refundAbleShippingPrice = accountInfo.canRefundShippingPrice;
        saleOrderInfo.refundedTotalPrice = refundedTotalPrice;
        saleOrderInfo.refundAbleProductsPrice = refundAbleProductsPrice;
        saleOrderInfo.refundAblePaidSalesTax = refundAblePaidSalesTax;
        saleOrderInfo.refundAbleShippingPrice = refundAbleShippingPrice;
        var currencyCode = saleOrderInfo.currencyCode || saleOrderInfo.baseCurrencyCode;
        var convert = function (value) {
            return Number(value).toLocaleString('zh', {
                style: 'currency',
                currency: currencyCode
            });
        };


        return `${convert(totalPrice)} ( 产品总价 ${convert(productsPrice)}; 总运费 ${convert(shippingPrice)} ;` +
            ` 附加费用 ${convert(paddingPrice)} ; 稅金 ${convert(tax)}(含销售税 ${convert(paidSalesTax)}) ;` +
            ` 折扣 ${discountAmount}(含银行转账优惠金额 ${bankTransferDiscount};)` +
            `已退总金额 ${convert(refundedTotalPrice)}; 可退产品总金额 ${convert(refundAbleProductsPrice)}; ` +
            `可退销售税 ${convert(refundAblePaidSalesTax)} ; 可退运费总额 ${convert(refundAbleShippingPrice)} );`;
    },
    /**
     * 新建时和编辑时的逻辑不同
     * @param orderItems 所有订单项
     * @param refundApplies 所欲退款申请
     * @param allowRefundItems 待退款的订单项
     * @returns {*}
     */
    buildOrderItem: function (orderItems, saleOrderItems, allowRefundItems, refundItems) {
        orderItems.map(function (item) {
            item.totalproductPrice = 0;
            item.productPrice = 0;
            item.totalQty = 0;
            item.allowRefundQty = 0;
            item.refundAmount = 0;
            item.refundQty = 0;
        });
        orderItems.map(function (item) {
            var itemId = item.id;
            for (var i = 0; i < saleOrderItems.length; i++) {
                //whiteLabel订单用id，saleOrder用orderItemId
                var orderItemId = (saleOrderItems[i].orderItemId || saleOrderItems[i].id);
                if (orderItemId == itemId) {
                    var price = (saleOrderItems[i].retailPrice || saleOrderItems[i].price);
                    //总价
                    item.totalproductPrice = Number((saleOrderItems[i].qty * price).toFixed(2));
                    //单价
                    item.productPrice = price;
                    //产品总数
                    item.totalQty = saleOrderItems[i].qty;
                }
            }
        });
        orderItems.map(function (item) {
            var itemId = item.id;
            for (var i = 0; i < allowRefundItems.length; i++) {
                var orderItemId = allowRefundItems[i].saleOrderItemId;
                if (orderItemId == itemId) {
                    //可退产品数
                    item.allowRefundQty = allowRefundItems[i].qty;
                }
            }
        });
        if (refundItems) {
            orderItems.map(function (item) {
                var itemId = item.id;
                for (var i = 0; i < refundItems.length; i++) {
                    var orderItemId = refundItems[i].orderItem._id;
                    if (orderItemId == itemId) {
                        //已退总额
                        item.refundAmount = refundItems[i].refundAmount;
                        //已退数量
                        item.refundQty = refundItems[i].refundQty
                    }
                }
            });
        }
        console.log(orderItems);
        return orderItems;

    },
    /**
     * 获取可退款订单项
     */
    getAllowRefundItems: function (orderId) {
        var info = [];
        var url = adminPath + 'api/orders/' + orderId + '/refundRequests/lineItems' +
            '?refundOrderType=' + JSGetQueryString('refundOrderType');
        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (success) {
                    info = responseText.data;
                }
            }
        });
        return info;
    },
    /**
     * 创建退款申请
     */
    createRefundApply: function (data) {
        var url = adminPath + 'api/refundRequests';
        JSAjaxRequest(url, 'POST', true, data, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '创建退款申请成功', function () {
                        var data = responseText.data;
                        JSOpen({
                            id: 'orderrefundpage',
                            url: path + 'partials/orderrefund/main.html' +
                                '?requestNo=' + data.requestNo,
                            title: '退款申请',
                            refresh: true
                        });
                        top.Ext.getCmp('tabs').getComponent('orderrefund_edit')?.close();
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
                            id: 'orderrefundpage',
                            url: path + 'partials/orderrefund/main.html' +
                                '?requestNo=' + data.requestNo,
                            title: '退款申请',
                            refresh: true
                        });
                        top.Ext.getCmp('tabs').getComponent('orderrefund_edit')?.close();
                    });
                }
            }
            JSSetLoading(false);
        });
    },
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
    getCurrencyNote: function (currencyStore, orderInfo) {
        var currencyCode = orderInfo.currencyCode || orderInfo.baseCurrencyCode;
        var record = currencyStore.findRecord('code', currencyCode);
        return record.get('symbolLeft');
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
     * 校验订单是否可以退款
     */
    validOrderAllowRefund: function (orderId) {

    },
    /**
     * 是否允许新建退款申请
     */
    isAllowCreate: function (_id, allowRefundItems, refundApplies, saleOrderInfo, orderInfo) {
        if (Ext.isEmpty(_id)) {

    /*        //订单状态为指定状态不能新建
            //不可以创建申请的状态 40 41 42 43 44 100
            var orderStatusId = orderInfo.status.id;
            if (Ext.Array.contains([40, 41, 42, 43, 44, 100, 36585000], Number(orderStatusId))) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('该订单状态不允许创建退款申请.'), function () {
                    JSOpen({
                        id: 'orderrefundpage',
                        url: path + 'partials/orderrefund/main.html',
                        title: i18n.getKey('refundApply'),
                        refresh: true
                    });
                    top.Ext.getCmp('tabs').getComponent('orderrefund_edit')?.close();
                });
                throw new Error();
            }*/
            //有待处理的退款申请时,不能新建
            if (refundApplies.length > 0) {
                var isValid = true;
                refundApplies.map(function (item) {
                    if (item.state == 'PendingRefund') {
                        isValid = false;
                    }
                })
                if (isValid == false) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('该订单有待处理的退款申请,请先处理已有退款申请.'), function () {
                        JSOpen({
                            id: 'orderrefundpage',
                            url: path + 'partials/orderrefund/main.html' +
                                '?orderNumber=' + saleOrderInfo.orderNumber +
                                '&state=',
                            title: i18n.getKey('refundApply'),
                            refresh: true
                        });
                        top.Ext.getCmp('tabs').getComponent('orderrefund_edit')?.close();
                    });
                    throw new Error();
                }
            }
            //可退产品总金额 $0; 可退销售税 $0 ; 可退运费总额 $0时不能创建退款申请
            //可退产品总金额refundAbleProductsPrice
            //可退銷售稅refundAblePaidSalesTax
            //可退运费总金额refundAbleShippingPrice
            if (saleOrderInfo.refundAbleProductsPrice <= 0 &&
                saleOrderInfo.refundAblePaidSalesTax <= 0 &&
                saleOrderInfo.refundAbleShippingPrice <= 0) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('该订单已无可退款项,请查看退款申请.'), function () {
                    JSOpen({
                        id: 'orderrefundpage',
                        url: path + 'partials/orderrefund/main.html?salesOrderNo=' + saleOrderInfo.orderNumber,
                        title: i18n.getKey('refundApply'),
                        refresh: true
                    });
                    top.Ext.getCmp('tabs').getComponent('orderrefund_edit')?.close();
                });
                throw new Error();
            }

            if (orderInfo.isSuccessPay == false) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('该订单没完成付款流程,无法申请退款.'), function () {
                    JSOpen({
                        id: 'orderrefundpage',
                        url: path + 'partials/orderrefund/main.html',
                        title: i18n.getKey('refundApply'),
                        refresh: true
                    });
                    top.Ext.getCmp('tabs').getComponent('orderrefund_edit')?.close();
                });
                throw new Error();
            }
        }
    },
    /**
     * 导出excel表格，以流的格式返回
     * @param grid
     */
    exportExcel: function (grid) {
        var query = grid.filter.getQuery();
        var filter = [];
        filter = Ext.encode(query);
        var url = adminPath + 'api/refundRequests/export';
        var x = new XMLHttpRequest();
        x.open("POST", url, true);
        x.setRequestHeader('Content-Type', 'application/json');
        x.setRequestHeader('Access-Control-Allow-Origin', '*');
        x.setRequestHeader('Authorization', 'Bearer ' + Ext.util.Cookies.get('token'));
        x.responseType = 'blob';
        x.onload = function (e) {
            console.log(x.response.type);
            const blob = new Blob([x.response], {type: x.response.type});
            var url = window.URL.createObjectURL(blob)
            var a = document.createElement('a');
            a.href = url
            a.download = '退款申请'
            a.click()
        }
        x.send(Ext.encode({
            "filter": filter,
        }));
    },

})