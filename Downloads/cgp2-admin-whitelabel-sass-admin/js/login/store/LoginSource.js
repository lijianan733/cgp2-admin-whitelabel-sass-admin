Ext.define('CGP.login.store.LoginSource', {
    extend: 'Ext.data.Store',
    idProperty: 'id',
    fields: [
        {name: 'id', type: 'int'},
        'name',
        'adminPath',
        'adminPath',
        'projectThumbServer',
        'imageServer',
        'title',
        'source',
        'adminPath'
    ],
    proxy: {
        type: 'rest',
        url: adminPath + "common/servers",
        reader: {
            root: 'data',
            type: 'json'
        }
    },
    autoLoad:true
})
