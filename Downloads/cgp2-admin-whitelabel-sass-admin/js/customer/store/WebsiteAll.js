Ext.define("CGP.customer.store.WebsiteAll",{
	extend : 'Ext.data.Store',
	requires :["CGP.customer.model.Website"],
	
	model : 'CGP.customer.model.Website',
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
