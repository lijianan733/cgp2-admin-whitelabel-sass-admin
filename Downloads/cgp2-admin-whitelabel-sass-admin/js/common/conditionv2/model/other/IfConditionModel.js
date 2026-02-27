/**
 * @Description:if 这种条件语句块
 * @author nan
 * @date 2022/9/27
 */

Ext.define('CGP.common.conditionv2.model.other.IfConditionModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'IfCondition'
        },
        {
            name: 'condition',
            type: 'object'
        },
        {
            name: 'statement',
            type: 'object'
        }
    ]

})