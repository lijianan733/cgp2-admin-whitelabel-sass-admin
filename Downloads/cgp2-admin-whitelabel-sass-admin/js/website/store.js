Ext.create('Ext.data.Store', {
    storeId: 'websiteStore',
    model: 'CGP.model.Website',
    remoteSort: false,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/websites',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});