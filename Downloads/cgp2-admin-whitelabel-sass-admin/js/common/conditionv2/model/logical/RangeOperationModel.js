/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.model.logical.RangeOperationModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'RangeOperation'
        },
        {
            name: 'source',
            type: 'object'
        },
        {
            name: 'inOperator',
            type: 'boolean'
        },
        {
            name: 'value',
            type: 'object'
        }
    ]
})