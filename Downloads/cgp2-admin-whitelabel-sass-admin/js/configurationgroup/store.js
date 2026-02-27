var store = Ext.create('Ext.data.Store',{
	storeId : 'configGroupStore',
	model: 'CGP.model.ConfigGroup',
	remodeSort:false,
	proxy:{
		type:'uxrest',
		url:adminPath + 'api/configurationGroups/all',
		reader:{
			type:'json',
			root:'data'
		}
	},
	autoLoad:true
});