/**
 * Created by admin on 2020/2/26.
 */
Ext.define("CGP.product.view.pricingStrategyv2.store.PricingStrategy", {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.pricingStrategyv2.model.PricingStrategy',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pricingstrategies',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});