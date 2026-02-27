Ext.define('CGP.model.ConfigGroup',{
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'id',
		type : 'int',
		useNull: true
	},{
		name:'title',
		type:'string'
	},{
		name:'description', 
		type:'string'
	},{
	    name: 'visible',
	    type:'boolean'
	}],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/configurationGroups',
		reader:{
			type:'json',
			root:'data'
		}
	}
});