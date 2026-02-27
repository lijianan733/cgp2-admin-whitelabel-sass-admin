/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.model.logical.IntervalOperationModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'IntervalOperation'
        },
        {
            name: 'source',
            type: 'object'
        },
        {
            name: 'operator',
            type: 'string'
        },
        {
            name: 'min',
            type: 'object'
        },
        {
            name: 'max',
            type: 'object'
        }
    ]
})