Ext.define("CGP.partnerapplys.store.WebsiteAll",{
	extend : 'Ext.data.Store',
	requires :["CGP.partnerapplys.model.Website"],
	
	model : 'CGP.partnerapplys.model.Website',
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