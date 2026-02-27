/**
 * @Description: 一般作为左值，指明一个属性
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.model.value.ProductAttributeValueModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'ProductAttributeValue'
        },
        'valueType',
        {
            name: 'nullable',
            type: 'boolean'
        },
        'attributeId'
    ]
})