Ext.define('CGP.resource.model.Font', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'number',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'fontFamily',
            type: 'string'
        },
        {
            name: 'displayName',
            type: 'string'
        },
        {
            name: 'wordRegExp',
            type: 'string'
        },
        {
            name: 'supportedStyle',
            type: 'array'
        },
        {
            name: 'languages',
            type: 'array'
        },
        {
            name: 'thumbnail',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcResource/fonts',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
