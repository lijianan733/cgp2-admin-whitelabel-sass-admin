/**
 * Created by nan on 2020/2/14.
 */
Ext.define('CGP.product.view.managerskuattribute.model.SkuAttributePropertyModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'value',
            type: 'string'
        },
        {
            name: 'skuAttributeId',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.attributeconfig.SkuAttributePropertyValue'
        }
    ]
})
