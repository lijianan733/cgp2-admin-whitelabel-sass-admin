/**
 * Created by nan on 2018/1/5.
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainter.model.SkuAttributeConstraintModel', {
    extend: 'Ext.data.Model',
    idProperty : '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull:true
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'conditions',
            type: 'object'
        },
        {
            name: 'skuAttributeId',
            type: 'int'
        },
        {
            name: 'validateExpression',
            type: 'object'
        }
    ]
})
