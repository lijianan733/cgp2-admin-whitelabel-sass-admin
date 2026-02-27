/**
 * @Description:
 * @author nan
 * @date 2023/2/1
 */
Ext.define('CGP.common.valueExV3.model.ExpressionModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'clazz', type: 'string'},
        {name: 'expression', type: 'string'},
        {name: 'expressionEngine', type: 'string', defaultValue: 'JavaScript'},
        {name: 'inputs', type: 'array'},
        {name: 'resultType', type: 'string'},
        {name: 'promptTemplate', type: 'string'},
        {name: 'min', type: 'object', defaultValue: undefined},
        {name: 'max', type: 'object', defaultValue: undefined},
        {name: 'regexTemplate', type: 'object', defaultValue: undefined}
    ],
})