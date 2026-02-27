/**
 * @Description: 一般作为左值，指明一个属性
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.model.logical.LogicalOperationModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'LogicalOperation'
        },
        {
            name: 'andOperator',
            type: 'boolean'
        },
        {
            name: 'expressions',
            type: 'array'
        }
    ]
})