Ext.define('CGP.main.store.Website', {
    extend: 'Ext.data.Store',
    model: 'CGP.main.model.Website',
    remoteSort: false,
    pageSize: 100,
    proxy: {
        type: 'rest',
        url: adminPath + 'common/websites',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
});