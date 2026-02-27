Ext.create('Ext.data.Store', {
    storeId: 'websiteStore',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'url',
            type: 'string'
        }
    ], proxy: {
        type: 'uxrest',
        url: adminPath + 'api/websites/available',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true
});