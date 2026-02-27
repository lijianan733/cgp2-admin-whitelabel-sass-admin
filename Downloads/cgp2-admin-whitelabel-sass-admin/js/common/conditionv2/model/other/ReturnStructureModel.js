/**
 * @Description:返回语句块
 * @author nan
 * @date 2022/9/27
 */

Ext.define('CGP.common.conditionv2.model.other.ReturnStructureModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'ReturnStructure'
        },
        {
            name: 'value',
            type: 'object'
        }
    ]
})