/**
 * Created by admin on 2019/11/7.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.model.OneWayProductAttributeMapping', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int'
        },
        {
            name: 'productId',
            type: 'int'
        }, 'clazz', 'description',
        {
            name: 'inputs',
            type: 'array'
        },
        {
            name: 'outputs',
            type: 'array'
        },
        {
            name: 'inSkuAttributeIds',
            type: 'array'
        },
        {
            name: 'inSkuAttributes',
            type: 'array'
        }, {
            name: 'attributeMappingDomain',
            type: 'object'
        },
        {
            name:'mappingLinks',
            type: 'array'
        },
        {
            name:'depends',
            type: 'array'
        }
    ]
})
