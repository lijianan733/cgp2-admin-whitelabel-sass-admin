Ext.define('CGP.configuration.store.ConfigStore', {
    extend:'Ext.data.Store',
    model: 'CGP.configuration.model.Config',

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