/**
 * Created by nan on 2018/3/26.
 */
Ext.define('CGP.partner.view.suppliersupportableproduct.model.SupportableProductModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'com.qpp.cgp.domain.partner.producer.ProducerSupportedProductConfig'
        },
        {
            name: 'status',
            type: 'string'
        },
        {
            name: 'price',
            type: 'string'
        },
        {
            name: 'product',
            type: 'object'
        }
    ]
})
