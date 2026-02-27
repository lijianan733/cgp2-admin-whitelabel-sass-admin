Ext.define('CGP.main.store.BuilderUrl', {
    extend: 'Ext.data.Store',
    fields:['name','url'],
    proxy:{
        type:'rest',
        url: adminPath + 'common/config/defaultBuilderUrl',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})