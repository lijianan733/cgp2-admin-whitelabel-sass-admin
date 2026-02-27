Ext.define('CGP.ticket.store.Website', {
    extend: 'Ext.data.Store',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'}
    ],
    remoteSort: false,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/websites',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});