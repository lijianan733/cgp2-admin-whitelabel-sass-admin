/**
 * Created by admin on 2020/2/28.
 */
Ext.define("CGP.product.view.pricingStrategyv2.store.LocalAdditionTable", {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.pricingStrategyv2.model.LocalAdditionTable',
    autoSync: true,
    proxy: {
        type: 'memory'
    }
    //autoLoad:true
});