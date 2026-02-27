new Ext.data.Store({
    storeId: 'standardPostageStore',
    model: 'CGP.model.StandardPostage',
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/postage/standard',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: 'true'
})