/**
 * Created by nan on 2019/6/27.
 */
Ext.define('CGP.product_price_component.store.ProductPriceComponentStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.product_price_component.model.ProductPriceComponentModel'],
    model: 'CGP.product_price_component.model.ProductPriceComponentModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productPriceComponents',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'createdDate',
        direction: 'DESC'
    }],
    autoLoad: true

})
