Ext.Loader.syncRequire([
    'CGP.product_price_component.view.ProductPriceComponentSelector'
]);
Ext.define('CGP.partner.view.config.baseconfig.BaseConfigForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    designId: null,
    layout: 'vbox',
    width: 450,
    height: 250,
    defaults: {
        width: '100%',
        margin: '5 25'
    },
    partnerId: '',
    baseConfig: null,
    diyGetValue: function () {
        var me = this;
        var data = me.getValue();
        return data;
    },
    initComponent: function () {
        var me = this;
        me.baseConfig = {
            shippingStrategyConfig: null,
            productionProductPriceComponent: null,
            stageProductPriceComponent: null
        };
        me.items = [];
        me.initProductShippingStrategy(me.partnerId);
        me.initProductPriceComponent(me.partnerId);
        me.callParent();
        me.listeners = {
            afterrender: function () {
                me.initFormItems(me.partnerId);
            }
        }
    },
    initFormItems: function (partnerId) {
        var me = this;
        var shippingStrategyComp = {
            xtype: 'radiogroup',
            fieldLabel: i18n.getKey('product') + i18n.getKey('shippingStrategy'),
            padding: 15,
            // Arrange radio buttons into two columns, distributed vertically
            columns: 2,
            columnWidth: 80,
            name: 'shippingStrategy',
            itemId: 'shippingStrategy',
            vertical: true,
            items: [
                {
                    width: 80,
                    boxLabel: i18n.getKey('weightCharge'),
                    name: 'shippingStrategy',
                    inputValue: 'BY_PRODUCT_WEIGHT',
                    checked: Ext.isEmpty(me.baseConfig.shippingStrategyConfig.priceStrategy) || me.baseConfig.shippingStrategyConfig.priceStrategy == 'BY_PRODUCT_WEIGHT'
                },
                {
                    width: 80,
                    boxLabel: i18n.getKey('qtyCharge'),
                    name: 'shippingStrategy',
                    inputValue: 'BY_PRODUCT_QTY',
                    checked: me.baseConfig.shippingStrategyConfig.priceStrategy == 'BY_PRODUCT_QTY'
                }
            ]
        };
        var stageProductPriceComponent = {
            xtype: 'product_price_component_selector',
            itemId: 'stageProductPriceComponent',
            name: 'stageProductPriceComponent',
            haveReset: true,
            fieldLabel: i18n.getKey('Stage环境的默认产品价格组成'),
            listeners: {
                afterrender: function () {
                    var me = this;
                    var id = me.ownerCt.baseConfig?.stageProductPriceComponent?.productPriceComponent?._id;
                    if (id) {
                        me.setInitialValue([id]);
                    }
                }
            }
        };
        var productionProductPriceComponent = {
            xtype: 'product_price_component_selector',
            itemId: 'productionProductPriceComponent',
            name: 'productionProductPriceComponent',
            haveReset: true,
            fieldLabel: i18n.getKey('Production环境的默认产品价格组成'),
            listeners: {
                afterrender: function () {
                    var me = this;
                    var id = me.ownerCt.baseConfig?.productionProductPriceComponent?.productPriceComponent?._id;
                    if (id) {
                        me.setInitialValue([id]);
                    }
                }
            }
        };
        me.add([shippingStrategyComp, stageProductPriceComponent, productionProductPriceComponent]);
    },
    initProductShippingStrategy: function (partnerId) {
        var me = this;
        var strategyConfig = {};
        var url = (adminPath + 'api/partnerProductShippingConfigs?page=1&limit=1&filter=' + JSON.stringify([{
            name: "partnerId",
            value: partnerId,
            type: "number"
        }]));
        JSAjaxRequest(url, "GET", false, null, false, function (require, success, response) {
            if (success) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    if (responseMessage.data.content.length != 0) {
                        strategyConfig = responseMessage.data.content[0];
                    }
                }
            }
        });
        me.baseConfig.shippingStrategyConfig = strategyConfig
        return strategyConfig;
    },
    initProductPriceComponent: function (partnerId) {
        var me = this;
        var url = adminPath + 'api/partnerPriceComponents?page=1&start=0&limit=25' +
            `&filter=[{"name":"partner.id","value":"${me.partnerId}","type":"number"}]`;
        JSAjaxRequest(url, "GET", false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var arr = responseText.data.content;
                    arr.map(function (item) {
                        if (item.applicationMode == 'Stage') {
                            me.baseConfig.stageProductPriceComponent = item;
                        } else if (item.applicationMode == 'Production') {
                            me.baseConfig.productionProductPriceComponent = item;
                        }
                    });
                }
            }
        });
        return me.baseConfig;
    },
    saveBaseConfig: function (baseConfig, partnerId) {
        var me = this;
        me.saveShippingStrategyConfig(baseConfig, partnerId);
        me.saveProductPriceComponent(baseConfig, partnerId);
    },
    saveShippingStrategyConfig: function (data, partnerId) {
        var me = this;
        var haveshippingStrategy = false;
        var shippingStrategyConfig = me.baseConfig.shippingStrategyConfig;
        var jsonData = {
            priceStrategy: data.shippingStrategy,
            clazz: 'com.qpp.cgp.domain.partner.shipping.PartnerProductShippingConfig',
            partnerId: partnerId
        }
        if (!Ext.isEmpty(shippingStrategyConfig._id)) {
            haveshippingStrategy = true;
        }
        var url = adminPath + 'api/partnerProductShippingConfigs';
        var method = 'POST';
        if (haveshippingStrategy) {
            url = url + '/' + shippingStrategyConfig._id;
            method = 'PUT';
            jsonData._id = shippingStrategyConfig._id;
        }
        JSAjaxRequest(url, method, true, jsonData, null, function (require, success, response) {
            if (success) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    me.baseConfig.shippingStrategyConfig = responseMessage.data;
                }
            }
        });
    },
    saveProductPriceComponent: function (data, partnerId) {
        //POST PUT
        var me = this;
        var jsonData = null;
        var url = adminPath + 'api/partnerPriceComponents';
        var method = 'POST';
        var dealHandler = function (env) {
            var fieldName = env == 'Production' ? 'productionProductPriceComponent' : 'stageProductPriceComponent';
            if (Ext.isEmpty(data[fieldName])) {
                if (me.baseConfig[fieldName]) {
                    method = 'DELETE';
                    url = adminPath + 'api/partnerPriceComponents/' + me.baseConfig[fieldName]._id;
                    jsonData = null;
                    JSAjaxRequest(url, method, true, jsonData, '保存成功!', function (require, success, response) {
                        if (success) {
                            var responseMessage = Ext.JSON.decode(response.responseText);
                            if (responseMessage.success) {
                                me.baseConfig[fieldName] = null;
                            }
                        }
                    });
                }
            } else {
                //put post
                jsonData = {
                    name: env,
                    clazz: 'com.qpp.cgp.domain.partner.price.PartnerPriceComponent',
                    partner: {
                        id: partnerId,
                        clazz: 'com.qpp.cgp.domain.partner.Partner'
                    },
                    productPriceComponent: {
                        clazz: 'com.qpp.cgp.domain.product.price.ProductPriceComponent',
                        _id: data[fieldName]._id
                    },
                    applicationMode: env,
                    status: 1,
                    description: env,
                    _id: null
                };
                if (me.baseConfig[fieldName]) {
                    method = 'PUT';
                    url = adminPath + 'api/partnerPriceComponents/' + me.baseConfig[fieldName]._id;
                    jsonData._id = me.baseConfig[fieldName]._id;
                } else {
                    method = 'POST';
                    url = adminPath + 'api/partnerPriceComponents';
                }
                JSAjaxRequest(url, method, true, jsonData, '保存成功!', function (require, success, response) {
                    if (success) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        if (responseMessage.success) {
                            me.baseConfig[fieldName] = responseMessage.data;
                        }
                    }
                });
            }
        };
        dealHandler('Stage');
        dealHandler('Production');

    }
})
