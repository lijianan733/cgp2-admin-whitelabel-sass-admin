Ext.define('CGP.common.store.Website', {
    extend: 'Ext.data.Store',
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
})