Ext.define('CGP.pcspreprocesscommonsource.store.SourceStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.pcspreprocesscommonsource.model.SourceModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcspreprocesscommonsource',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})
