new Ext.data.Store({
    storeId: 'orderStore',
    model: 'CGP.model.Order',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/redo',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'createdDate',
        direction: 'DESC'
    }],
    autoLoad: true
});