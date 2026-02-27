/**
 * Created by admin on 2019/10/29.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.model.AttributePropertyValue', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int'
        },
        {
            name: 'propertyPath',
            type: 'object',
            defaultVale: {
                clazz: 'com.qpp.cgp.domain.attributeproperty.PropertyPathDto',
                EntryLink: null,
                skuAttributeId: 0,
                skuAttribute: {},
                propertyName: '',
                attributeProfile: {}
            }
        },
        'clazz',
        {
            name: 'value',
            type: 'object'
        },
        {
            name: 'isInclude',
            type: 'boolean'
        }
    ]
})
