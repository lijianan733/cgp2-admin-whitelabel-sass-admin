/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.model.template.TemplateFunctionModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'TemplateFunction'
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
            name: 'templateUrl',
            type: 'string'
        },{
            name: 'template',
            type: 'string'
        },{
            name: 'component',
            type: 'string'
        }
    ]
})