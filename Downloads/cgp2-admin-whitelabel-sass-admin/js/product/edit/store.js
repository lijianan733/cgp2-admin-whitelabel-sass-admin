var websiteStore = new Ext.create('Ext.data.Store', {
    storeId: 'websiteStore',
    fields: [{
        name: 'id',
        type: 'int'
                    }, 'name'],
    remoteSort: false,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/websites/available',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true
})