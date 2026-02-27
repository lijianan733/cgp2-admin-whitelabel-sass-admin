new Ext.data.Store({
    storeId: 'expressPostageStore',
    model: 'CGP.model.ExpressPostage',
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/postage/express',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})