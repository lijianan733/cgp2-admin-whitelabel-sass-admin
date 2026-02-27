/**
 * Created by admin on 2019/12/12.
 */
Ext.define('CGP.product.view.shippingstrategy.byqty.store.ConfigStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.shippingstrategy.byqty.model.ConfigModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productAreaShippingConfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})
