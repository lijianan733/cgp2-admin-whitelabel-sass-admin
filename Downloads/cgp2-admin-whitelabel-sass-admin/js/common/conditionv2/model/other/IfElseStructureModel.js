/**
 * @Description: if elseif else的结构体
 * @author nan
 * @date 2022/9/27
 */

Ext.define('CGP.common.conditionv2.model.other.IfElseStructureModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'IfElseStructure'
        },
        {
            name: 'conditions',
            type: 'array'
        },
        {
            name: 'elseStatement',
            type: 'object'
        }
    ]
})