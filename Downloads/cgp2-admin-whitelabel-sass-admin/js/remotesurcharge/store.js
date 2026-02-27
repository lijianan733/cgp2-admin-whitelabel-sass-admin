new Ext.data.Store({
    storeId: 'remoteSurchargeStore',
    model: 'CGP.model.RemoteSurcharge',
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/remoteSurcharge',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});