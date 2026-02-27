/**
 * Created by nan on 2019/6/27.
 */
Ext.define('CGP.product_price_component.model.ProductPriceComponentModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true,
        },
        {
            name: 'priceComponents',
            type: 'array'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: "com.qpp.cgp.domain.product.price.ProductPriceComponent"
        },
        {
            name: 'description',
            type: 'string',
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productPriceComponents',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
