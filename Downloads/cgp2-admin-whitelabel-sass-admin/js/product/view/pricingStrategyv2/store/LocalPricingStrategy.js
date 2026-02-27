/**
 * Created by admin on 2020/2/28.
 */
Ext.define("CGP.product.view.pricingStrategyv2.store.LocalPricingStrategy", {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.pricingStrategyv2.model.LocalPricingStrategy',
    autoSync: true,
    pageSize: 25,
    proxy: {
        type: 'pagingmemory'
    },
    autoLoad: true
});