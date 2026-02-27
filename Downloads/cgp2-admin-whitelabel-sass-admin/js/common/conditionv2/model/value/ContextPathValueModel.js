/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.model.value.ContextPathValueModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'ContextPathValue'
        },
        'valueType',
        {
            name: 'nullable',
            type: 'boolean'
        },
        'path'
    ]
})