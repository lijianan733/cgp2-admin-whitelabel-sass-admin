Ext.define('CGP.product.view.productattributeconstraint.model.MultiDiscreteValueConstraint', {
    extend: 'Ext.data.Model',
    idProperty : '_id',
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
            name: 'skuAttributeIds',
            type: 'array'
        }, {
            name: 'isEnable',
            type: 'boolean'
        },{
            name: 'description',
            type: 'string'
        },{
            name: 'productId',
            type: 'int'
        },{
            name: 'isInclude',
            type: 'boolean'
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
