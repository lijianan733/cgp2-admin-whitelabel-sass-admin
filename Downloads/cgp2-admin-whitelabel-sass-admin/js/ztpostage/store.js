new Ext.data.Store({
    storeId: 'standardPostageStore',
    model: 'CGP.model.ZtPostage',
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/postage/zt',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: 'true'
})