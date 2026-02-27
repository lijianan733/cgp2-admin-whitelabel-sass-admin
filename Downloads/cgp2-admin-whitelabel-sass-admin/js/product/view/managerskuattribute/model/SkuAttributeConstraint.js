Ext.define('CGP.product.view.managerskuattribute.model.SkuAttributeConstraint', {
    extend: 'Ext.data.Model',
    idProperty : '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'idReference',
            type: 'string'
        },{
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'include',
            type: 'boolean'
        },
        {
            name: 'skuAttributeId',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },{
            name: 'conditions',
            type: 'object'
        },{
            name: 'validateExpression',
            type: 'object'
        },{
            name: 'items',
            type: 'object'
        }
    ]
});
