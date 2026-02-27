/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.model.template.CustomizeFunctionModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'CustomizeFunction'
        },
        'name',
        {
            name: 'paragraph',
            type: 'array'
        },
        {//type:Expression/ValueEx,没意义字段
            name: 'type',
            type: 'string'
        }, {
            name: 'expression',
            type: 'string'
        }
    ]
})