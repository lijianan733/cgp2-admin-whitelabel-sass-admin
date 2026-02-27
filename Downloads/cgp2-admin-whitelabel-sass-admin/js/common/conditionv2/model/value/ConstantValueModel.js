/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.model.value.ConstantValueModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'ConstantValue'
        },
        'valueType',
        {
            name: 'nullable',
            type: 'boolean'
        },
        'value'
    ]
})