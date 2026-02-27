var store = Ext.create('Ext.data.Store', {
    storeId: 'configStore',
    model: 'CGP.model.Config',

    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/configurations',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

Ext.define('CGP.configuration.store.ConfigStore', {
    extend:'Ext.data.Store',
    model: 'CGP.model.Config',

    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/configurations',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})