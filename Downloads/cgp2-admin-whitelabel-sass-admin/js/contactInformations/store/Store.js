Ext.define('CGP.contactInformations.store.Store', {
    extend: 'Ext.data.Store',
    model: 'CGP.contactInformations.model.Model',
    remoteSort: false,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/business/contactInformations',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})