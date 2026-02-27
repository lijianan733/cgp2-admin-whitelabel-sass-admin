/**
 * @Description:
 * @author nan
 * @date 2024/8/30
 */
Ext.Loader.syncRequire([
    'CGP.orderpricemodify.view.AddressFieldSet',
    'CGP.orderpricemodify.config.Config'
])
Ext.onReady(function () {
    var type = 'history';//item,total修改订单项还是直接修改总价
    var orderId = JSGetQueryString('orderId');//item,total修改订单项还是直接修改总价
    var currencySymbol = JSGetQueryString('currencySymbol');//item,total修改订单项还是直接修改总价
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'errorstrickform',
            itemId: 'form',
            name: 'form',
            type: type,
            defaults: {
                margin: '5 25',
                align: 'center',
                width: '95%'
            },
            layout: {
                type: 'auto',
                align: 'center',
                pack: 'center'
            },
            bodyStyle: {
                borderColor: 'silver'
            },
            items: [],
            bbar: {
                xtype: 'errorstrickform',
                itemId: 'orderSummary',
                name: 'orderSummary',
                layout: 'column',
                defaults: {
                    columnWidth: 0.25,
                    margin: '5 25',
                },
                bodyStyle: {
                    borderColor: 'silver'
                },
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: '产品金额' + `(${currencySymbol})`,
                        itemId: 'productsAmount',
                        name: 'productsAmount'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'importService' + `(${currencySymbol})`,
                        itemId: 'importService',
                        name: 'importService'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '总折扣' + `(${currencySymbol})`,
                        itemId: 'discountAmount',
                        name: 'discountAmount'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '总运费' + `(${currencySymbol})`,
                        itemId: 'shippingPrice',
                        name: 'shippingPrice'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '总税费' + `(${currencySymbol})`,
                        itemId: 'tax',
                        name: 'tax'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '总附加费用' + `(${currencySymbol})`,
                        itemId: 'paddingPrice',
                        name: 'paddingPrice'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '总金额' + `(${currencySymbol})`,
                        itemId: 'totalAmount',
                        name: 'totalAmount'
                    },
                ],
                bbar: {
                    items: [
                        {
                            text: '返回列表',
                            iconCls: 'icon_grid',
                            handler: function () {
                                JSOpen({
                                    id: 'page',
                                    url: path + '/partials/order/order.html?statusId=101'
                                });
                            }
                        },
                        {
                            text: '刷新',
                            iconCls: 'icon_refresh',
                            handler: function () {
                                location.reload();
                            }
                        }
                    ]
                }
            },
            /**
             * 构建展示用的数据
             */
            buildDisplayData: function (data) {
                var createStr = function (data) {
                    var tpl = new Ext.XTemplate(
                        '<font color="red" style="font-weight: bold">{oldValue} ➔ {newValue}</font>'
                    );
                    if (data) {
                        if (Ext.isEmpty(data.newValue)) {
                            return data.oldValue;
                        } else {
                            return tpl.apply(data);
                        }
                    }
                };
                var items = [];
                data.shipmentRequirementModifyDatas.map(function (item) {
                    var orderItems = [];
                    item.orderItems.map(function (orderItem) {
                        orderItems.push({
                            _id: orderItem._id,
                            productDescription: orderItem.productDescription,
                            productWeight: orderItem.weight,
                            qty: createStr(orderItem.qtyModifyInfo),
                            price: createStr(orderItem.priceModifyInfo),
                            cost: orderItem.cost,
                            amount: createStr(orderItem.amountModifyInfo),
                            currency: orderItem.currency,
                            seqNo: orderItem.seqNo,
                            product: {
                                name: orderItem.productName,
                                model: orderItem.productModel,
                                sku: orderItem.productSku,
                            },
                            thumbnailInfo: orderItem.thumbnailInfo,
                            retailPrice: orderItem.retailPrice
                        });
                    });
                    items.push({
                        addressDetail: {
                            billingAddress: item.billingAddress,
                            deliveryAddress: item.deliveryAddress,
                        },
                        shipmentRequirementId: item.shipmentRequirementId,
                        orderItems: orderItems,
                        priceInfo: {
                            importService: createStr(item?.importService),
                            productsAmount: createStr(item.productsAmountModifyInfo),
                            shippingPrice: createStr(item.shippingPriceModifyInfo),
                            tax: createStr(item.taxModifyInfo),
                            discountAmount: createStr(item.discountAmountModifyInfo),
                            paddingPrice: createStr(item.paddingPriceModifyInfo),
                            paddingDesc: createStr(item.paddingDescModifyInfo),
                            totalAmount: createStr(item.totalAmountModifyInfo),
                        }
                    });
                });
                var result = {
                    items: items,
                    summary: {
                        importService: createStr(data.orderModifyData.importService),
                        productsAmount: createStr(data.orderModifyData.productsAmountModifyInfo),
                        shippingPrice: createStr(data.orderModifyData.shippingPriceModifyInfo),
                        tax: createStr(data.orderModifyData.taxModifyInfo),
                        discountAmount: createStr(data.orderModifyData.discountAmountModifyInfo),
                        paddingPrice: createStr(data.orderModifyData.paddingPriceModifyInfo),
                        totalAmount: createStr(data.orderModifyData.totalAmountModifyInfo)
                    },
                    user: data.user
                };
                return result;
            },
            refreshData: function () {
                var form = this;
                JSSetLoading(true);
                setTimeout(function () {
                    var history = {};
                    var url = adminPath + `api/orderPriceAndQtyModifiedHistories/${JSGetQueryString('id')}`;
                    JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
                        if (success) {
                            var responseText = Ext.JSON.decode(response.responseText);
                            if (responseText.success) {
                                history = responseText.data;
                            }
                        }
                    }, true);
                    var data = form.buildDisplayData(history);
                    var comps = [];
                    //发货项价格信息
                    if (data && data.items.length > 0) {
                        data.items.map(function (item, index) {
                            comps.push({
                                xtype: 'address_fieldset',
                                rawData: item,
                                type: 'total',//跟改总价一样，不能编辑
                                orderType: JSGetQueryString('orderType'),
                                currencySymbol: currencySymbol,
                                title: `<font style="font-weight: bold" color="green">${'发货要求(' + (index + 1) + ')'}</font>`
                            });
                        });
                    }
                    form.add(comps);
                    //整个订单统计汇总信息
                    var orderSummary = form.getComponent('orderSummary');
                    orderSummary.setValue(data.summary);
                    JSSetLoading(false);
                    /**
                     * 接受子组件事件reCalculateProductPrice
                     */
                    form.items.items.map(function (item) {
                        if (item) {
                            //接受子组件的事件
                            form.relayEvents(item, ['reCalculateProductPrice']);
                        }
                    });
                });
            },
            listeners: {
                afterrender: function () {
                    var form = this;
                    form.refreshData();
                },
            }
        }]
    });
});