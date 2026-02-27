Ext.define('CGP.test.pcCompare.store.PcDataStore', {
    extend: 'Ext.data.TreeStore',

    model:'CGP.test.pcCompare.model.PcDataModel',
    nodeParam: 'id',
    proxy: 'memory',
    root: {
        text: 'userData',
        id: '1'
    }
})