/**
 * Created by nan on 2018/3/16.
 */
Ext.define('CGP.common.valueEx.model.SkuAttributeConstraint', {
    extend: 'Ext.data.Model',
    fields: [
       {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'include',
            type: 'boolean'
        },
        {
            name: 'description',
            type: 'string'
        },{
            name: 'conditions',
            type: 'object',
            defaultValue: undefined
        },{
            name: 'validExpression',
            type: 'object',
            defaultValue: undefined
        },{
            name: 'items',
            type: 'object',
            defaultValue: undefined
        }
    ]
});
