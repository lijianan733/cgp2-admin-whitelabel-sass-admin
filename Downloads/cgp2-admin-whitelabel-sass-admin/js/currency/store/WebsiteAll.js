Ext.define("CGP.currency.store.WebsiteAll",{
	extend : 'Ext.data.Store',
	requires :["CGP.currency.model.Website"],
	
	model : 'CGP.currency.model.Website',
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