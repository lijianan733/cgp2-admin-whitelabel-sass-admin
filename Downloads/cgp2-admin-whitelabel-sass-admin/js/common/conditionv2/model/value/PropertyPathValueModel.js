/**
 * @Description:
 * @author nan
 * @date 2022/9/27
 */
Ext.define('CGP.common.conditionv2.model.value.PropertyPathValueModel', {
    extend: 'Ext.data.Model',
    fields: [
        'clazz',
        'valueType',
        {
            name: 'nullable',
            type: 'boolean'
        },
        'skuAttributeId',
        'attributeProfile',
        'propertyName'
    ]
})