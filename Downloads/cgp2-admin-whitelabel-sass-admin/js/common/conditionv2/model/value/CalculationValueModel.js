/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.model.value.CalculationValueModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'CalculationValue'
        },
        'valueType',
        {
            name: 'nullable',
            type: 'boolean'
        },
        'expression',
        {
            name: 'parameter',
            type: 'object'
        }
    ]
})