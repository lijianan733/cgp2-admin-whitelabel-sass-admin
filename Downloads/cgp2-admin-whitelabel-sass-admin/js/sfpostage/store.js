new Ext.data.Store({
    storeId: 'standardPostageStore',
    model: 'CGP.model.SfPostage',
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/postage/sf',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: 'true'
})