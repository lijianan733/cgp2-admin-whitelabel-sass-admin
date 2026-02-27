Ext.define("CGP.attribute.model.Attribute", {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'sortOrder',
            type: 'int',
            defaultValue: 0
        },
        'code', 'name',
        'inputType', 'validationExp',
        {
            name: 'required',
            type: 'boolean'
        },
        {
            name: 'showInFrontend',
            type: 'boolean'
        },
        {
            name: 'useInCategoryNavigation',
            type: 'boolean'
        },
        {
            name: 'options',
            type: 'array',
        },
        {
            name: 'attributeOptions',
            type: 'array',
        },
        {
            name: 'multilingualKey',
            type: 'string',
            convert: function (value, record) {
                return record.raw?.clazz;
            }
        },
        {
            name: 'valueType',
            type: 'string'
        },
        {
            name: 'selectType',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.attribute.Attribute'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/attributes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
