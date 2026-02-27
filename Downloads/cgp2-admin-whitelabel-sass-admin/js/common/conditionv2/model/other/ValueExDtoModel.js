/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */

Ext.define('CGP.common.conditionv2.model.other.ValueExDtoModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'ValueExDto'
        },
        'function',
        'latestValue'
    ]
})