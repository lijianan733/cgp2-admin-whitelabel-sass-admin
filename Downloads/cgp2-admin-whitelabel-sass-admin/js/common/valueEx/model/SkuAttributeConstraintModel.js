/**
 * Created by nan on 2018/3/16.
 */
Ext.define('CGP.common.valueEx.model.SkuAttributeConstraintModel', {
    extend: 'Ext.data.Model',
    fields: [
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
            type: 'object',
            defaultValue: undefined
        },
        {
            name: 'validExpression',
            type: 'object',
            defaultValue: undefined
        }
    ]
});