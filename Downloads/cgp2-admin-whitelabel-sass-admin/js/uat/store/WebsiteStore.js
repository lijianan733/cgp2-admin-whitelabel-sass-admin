Ext.define("CGP.uat.store.WebsiteStore",{
	extend : 'Ext.data.Store',
	requires : ["CGP.uat.model.Website"],
	
	model : "CGP.uat.model.Website",
	remoteSort : false,
	pageSize : 25,
	proxy : {
		type: 'uxrest',
        url: adminPath + 'api/websites',
        reader: {
            type: 'json',
            root: 'data.content'
        }
	},
	autoLoad: true
});
