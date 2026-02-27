/**
 * Created by admin on 2020/3/31.
 */
Ext.define("CGP.product.view.pricingStrategyv2.store.LocalArgument", {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.pricingStrategyv2.model.LocalArgument',
    autoSync: true,
    pageSize: 25,
    proxy: {
        type: 'memory'
    }
});