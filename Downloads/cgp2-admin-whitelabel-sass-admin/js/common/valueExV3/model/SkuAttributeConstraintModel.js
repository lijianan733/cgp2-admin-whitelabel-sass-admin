/**
 * Created by nan on 2018/3/16.
 */
Ext.define('CGP.common.valueExV3.model.SkuAttributeConstraintModel', {
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
            type: 'object'
        },
        {
            name: 'validExpression',
            type: 'object'
        }
    ]
})
