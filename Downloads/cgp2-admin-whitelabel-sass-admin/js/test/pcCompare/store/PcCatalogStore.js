Ext.define('CGP.test.pcCompare.store.PcCatalogStore', {
    extend: 'Ext.data.TreeStore',

    model:'CGP.test.pcCompare.model.PcCatalogModel',
    nodeParam: 'id',
    proxy: 'memory',
    root: {
        text: 'userData',
        id: '1'
    }
})