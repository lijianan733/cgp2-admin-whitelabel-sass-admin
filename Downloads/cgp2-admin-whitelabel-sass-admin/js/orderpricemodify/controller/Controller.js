/**
 * @Description:
 * @author nan
 * @date 2024/8/22
 */

Ext.define('CGP.orderpricemodify.controller.Controller', {
    modifyPrice: function (orderId, type, bottomForm, form) {
        var url = '';
        if (type == 'item') {
            //修改发货项的
            var jsonData = [];
            form.items.items.map(function (item) {
                var itemSummary = item.getComponent('itemSummary').getValue();
                var store = item.getComponent('orderItems')._grid.store;
                var orderItems = [];
                store.proxy.data.map(function (orderItem) {
                    orderItems.push({
                        _id: orderItem._id,
                        qty: orderItem.qty,
                        price: orderItem.price
                    });
                });
                jsonData.push({
                    "orderItems": orderItems,
                    "priceInfo": itemSummary,
                    "shipmentRequirementId": item.shipmentRequirementId
                });
            });
            url = adminPath + `api/shipmentRequirements/orderItems/price/info`;
        } else if (type == 'total') {
            //修改总的
            url = adminPath + `api/orders/${orderId}/amount`;
            var totalAmountDiscount = bottomForm.getComponent('totalAmountDiscount');
            var paddingPrice = bottomForm.getComponent('paddingPrice');
            var discountAmount = bottomForm.getComponent('discountAmount');
            jsonData = {
                'orderId': orderId,
                "discountAmount": parseFloat(Number(Number(totalAmountDiscount.getValue()) + Number(discountAmount.getValue())).toFixed(2)),
                "paddingPrice": paddingPrice.getValue()
            };
        }
        JSAjaxRequest(url, 'PUT', true, jsonData, '修改订单金额成功', function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    Ext.Msg.alert('提示', '修改订单金额成功', function () {
                        location.reload();
                    });

                }
            }
        }, true);
    },
    getPriceInfo: function (orderId) {
        var result = {};
        var url = adminPath + `api/orders/${orderId}/price/info`;
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
    getSkuProductInfo: function (type, orderId, shipmentRequirementId) {
        var url = '';
        var result = [];
        if (type == 'deliveryOrder') {
            url = adminPath + `api/shipmentRequirements/${shipmentRequirementId}/sku/Info`;

        } else if (type == 'saleOrder') {
            url = adminPath + `api/orders/${orderId}/sku/Info`;
        }
        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data;
                }
            }
        }, true);
        return result;
    }

})