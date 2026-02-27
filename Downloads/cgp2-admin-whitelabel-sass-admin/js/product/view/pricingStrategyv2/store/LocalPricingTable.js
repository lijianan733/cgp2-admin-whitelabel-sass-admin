/**
 * Created by admin on 2020/2/28.
 */
Ext.define("CGP.product.view.pricingStrategyv2.store.LocalPricingTable", {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.pricingStrategyv2.model.PricingTable',
    autoSync: true,
    proxy: {
        type: 'memory'
    }
});