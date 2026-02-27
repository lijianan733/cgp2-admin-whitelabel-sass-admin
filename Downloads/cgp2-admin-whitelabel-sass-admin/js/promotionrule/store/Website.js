Ext.define("CGP.promotionrule.store.Website",{
	extend : 'Ext.data.Store',
	requires : ["CGP.promotionrule.model.Website"],
	
	model : 'CGP.promotionrule.model.Website',
	remoteSort: false,
	pageSize : 25,
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/websites',
		reader : {
			type : 'json',
			root : 'data.content'
		}
	},
	autoLoad : true
});

