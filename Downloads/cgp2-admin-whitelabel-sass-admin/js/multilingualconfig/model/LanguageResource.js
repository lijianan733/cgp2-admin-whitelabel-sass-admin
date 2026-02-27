Ext.define("CGP.multilingualconfig.model.LanguageResource", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: "com.qpp.cgp.domain.common.EntityMultilingualConfig"
        },
        'entityClass',
        {
            name: 'attributeNames',
            type: 'array',
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/entityMultilingualConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});