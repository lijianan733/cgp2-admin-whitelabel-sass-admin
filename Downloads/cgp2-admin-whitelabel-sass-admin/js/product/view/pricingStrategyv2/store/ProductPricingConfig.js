/**
 * Created by admin on 2020/2/26.
 */
Ext.define("CGP.product.view.pricingStrategyv2.store.ProductPricingConfig", {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.pricingStrategyv2.model.ProductPricingConfig',
    proxy: {
        type: 'uxrest',
        url: '',//这是产品的售价策略接口
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        me.proxy.url = config.url;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
