Ext.define('CGP.resource.model.Ornament', {
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
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcResource/ornaments',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
