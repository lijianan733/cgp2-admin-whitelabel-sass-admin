/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.model.logical.CompareOperationModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'CompareOperation'
        },
        'operator',
        {
            name: 'source',
            type: 'object'
        },
        {
            name: 'value',
            type: 'object'
        }
    ]
})