Ext.define('CGP.common.store.Language', {
    extend: 'Ext.data.Store',
    model: 'CGP.common.model.Language',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/languages',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});