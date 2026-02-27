Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.model.MultiDiscreteValueConstraint', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.product.attribute.constraint2.multi.MultiDiscreteValueConstraintItem'

        }, {
            name: 'items',
            type: 'array'
        }, {
            name: 'inSkuAttributeIds',
            type: 'array'
        }, {
            name: 'enable',
            type: 'boolean'
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'productId',
            type: 'int'
        }, {
            name: 'attributeMappingDomain',
            type: 'object'
        },
        {
            name: 'attributePropertyPath',
            type: 'object'
        }, {
            name: 'depends',
            type: 'array'
        }, {
            name: 'mappingLinks',
            type: 'array'
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productAttributeConstraints/v2',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
