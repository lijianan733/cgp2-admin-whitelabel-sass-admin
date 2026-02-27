Ext.define('CGP.product.view.shippingstrategy.byqty.store.ShippingConfigStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.shippingstrategy.byqty.model.ShippingConfigModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/areaShippingConfigGroups',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})
