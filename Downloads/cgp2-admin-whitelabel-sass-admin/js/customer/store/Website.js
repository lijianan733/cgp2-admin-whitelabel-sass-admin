Ext.define("CGP.customer.store.Website",{
	extend : 'Ext.data.Store',
	requires :["CGP.customer.model.Website"],
	
	model : 'CGP.customer.model.Website',
	remoteSort: false,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/websites/available',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true
});
