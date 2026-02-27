/**
 * Created by nan on 2020/9/25.
 */
Ext.define('CGP.partner.view.enableproductmanage.controller.Controller', {
    /**
     * 价格规则管理
     */
    manageProductPriceRule: function () {

    },
    /**
     * 获取到该partner指定可用产品的所有计价策略列表
     * @param partnerId
     * @param productId
     */
    getPartnerProductPricingConfig: function (partnerId, productId, dataUrl) {
        var PriceRuleConfig = [];

        Ext.Ajax.request({
            url: encodeURI(adminPath + dataUrl + '?page=1&limit=23&filter=' +
                Ext.JSON.encode([
                    {"name": "productId", "value": productId, "type": "string"}
                    , {"name": "partnerId", "value": partnerId, "type": "string"}
                ])),
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    PriceRuleConfig = responseMessage.data.content[0];

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        })
        return PriceRuleConfig;
    },
    /**
     * 获取到该partner指定可用产品配置的成本策略
     * @param partnerId
     * @param productId
     */
    getPartnerProductCostingConfig: function (partnerId, productId) {
        var PriceRuleConfig = [];

        Ext.Ajax.request({
            url: encodeURI(adminPath + 'api/partnercostingconfigs?page=1&limit=23&filter=' +
                Ext.JSON.encode([
                    {"name": "productId", "value": productId, "type": "string"}
                    , {"name": "partnerId", "value": partnerId, "type": "string"}
                ])),
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    PriceRuleConfig = responseMessage.data.content[0];

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        })
        return PriceRuleConfig;
    },
    /**
     * 获取到该产品计价策略列表
     * @param productId
     */
    getProductPriceRuleConfig: function (productId, getWhiteLabelStrategiesUrl, configType) {
        var PriceRuleConfig = [];
        var filter = [{
            name: 'productId',
            type: configType == 'sellPriceStrategy' ? 'number' : 'string',
            value: productId
        }];

        Ext.Ajax.request({
            url: encodeURI(adminPath + getWhiteLabelStrategiesUrl + '?filter=' + Ext.JSON.encode(filter) + '&page=1&limit=25'),
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success ) {
                    if (responseMessage.data && !Ext.isEmpty(responseMessage.data.content))
                        var config = responseMessage.data.content[0]
                        PriceRuleConfig = config.strategies;

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        })
        return PriceRuleConfig;
    },
    /**
     * 获取到指定产品的成本配置
     * @param productId
     * @returns {{}}
     */
    getProductCostingConfig: function (productId) {
        var url = adminPath + 'api/productcontingconfigs?page=1&limit=23&filter=' + Ext.JSON.encode([{
            "name": "configurableProductId",
            "value": productId,
            "type": "string"
        }])
        var result = JSAjaxRequest(
            url,
            'GET',
            false
        );
        if (result) {
            return result[0];
        } else {
            return null;
        }
    },
    /**
     * 保存计价规则
     * @param data
     * @param tab
     */
    savePartnerPriceRule: function (data, tab,configUrl) {
        var result = null;
        var method = 'POST';
        var url = adminPath + (tab.configUrl||tab.dataUrl);
        if (data._id) {
            url += '/' + data._id;
            method = 'PUT';
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            async: false,
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            },
            callback: function (require, success, response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                result = responseMessage.data;
            }
        })
        tab.items.items[0].refreshData();
        return result;

    },
    /**
     * 保存成本规则
     * @param data
     * @param tab
     */
    savePartnerCostingRule: function (data, tab) {
       ;
        var result = null;
        var method = 'POST';
        var url = adminPath + 'api/partnercostingconfigs'
        if (data._id) {
            url = adminPath + 'api/partnercostingconfigs/' + data._id;
            method = 'PUT';
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            async: false,
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            },
            callback: function (require, success, response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                result = responseMessage.data;
            }
        })
        tab.items.items[0].refreshData();
        return result;

    },
    /**
     *
     */
    addProductPriceRule: function (grid,configUrl) {
        var controller = this;
        var productPriceRule = grid.productPriceRule;
        var strategies = grid.partnerProductPricingConfig.strategies;
        var optionalPriceRule = [];
        for (var i = 0; i < productPriceRule.length; i++) {
            var extra = false;
            for (var j = 0; j < strategies.length; j++) {
                if (productPriceRule[i]._id == strategies[j]._id) {
                    extra = true;
                    continue;
                }
            }
            if (extra == false) {
                optionalPriceRule.push(productPriceRule[i]);
            }
        }
        var store = Ext.create('Ext.data.Store', {
            fields: [
                '_id', 'currency', {
                    name: 'isProductRule',
                    type: 'boolean',
                    defaultValue: true
                },
                'strategyType',
                'description'
            ],
            data: optionalPriceRule
        });
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            width: 500,
            height: 500,
            layout: 'fit',
            title: i18n.getKey('choice') + i18n.getKey('price') + i18n.getKey('strategy'),
            items: [
                {
                    xtype: 'grid',
                    store: store,
                    selType: 'checkboxmodel',
                    columns: [
                        {
                            xtype: 'rownumberer',
                            width: 50,
                        },
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id'
                        },
                        {
                            text: i18n.getKey('strategy') + i18n.getKey('type'),
                            dataIndex: 'strategyType',
                            width: 150,
                            renderer: function (value) {
                                var result = '';
                                switch (value) {
                                    case "com.qpp.cgp.domain.pricing.configuration.SimpleQtyTablePricingSetting":
                                        result = i18n.getKey('simple') + i18n.getKey('strategy');
                                        break;
                                    case "com.qpp.cgp.domain.pricing.configuration.AdditionQtyTablePricingSetting":
                                        result = i18n.getKey('addition') + i18n.getKey('strategy');
                                        break;
                                    case "com.qpp.cgp.domain.pricing.configuration.MathExpressionPricingSetting":
                                        result = i18n.getKey('expression') + i18n.getKey('strategy');
                                        break;
                                }
                                return result;
                            }
                        },
                        {
                            text: i18n.getKey('description'),
                            sortable: false,
                            dataIndex: 'description',
                            flex: 1,
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip ="' + value + '"';
                                return value;
                            }
                        }
                    ]
                }
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var selections = win.items.items[0].getSelectionModel().getSelection();
                        var data = grid.partnerProductPricingConfig;
                        for (var i = 0; i < selections.length; i++) {
                            data.strategies.push({
                                _id: selections[i].raw._id,
                                clazz: "com.qpp.cgp.domain.pricing.configuration.ExpressionPricingConfig"
                            })
                        }
                        var result = controller.savePartnerPriceRule(data, grid.ownerCt,configUrl);
                        if (result.data) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKye('添加成功'));

                        }
                        win.close();
                    }
                }, {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.close();


                    }
                }
            ]
        });
        win.show();

    }
})
