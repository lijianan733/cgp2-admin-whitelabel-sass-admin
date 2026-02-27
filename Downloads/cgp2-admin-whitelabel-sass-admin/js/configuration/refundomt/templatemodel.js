Ext.define('CGP.model.RefundMailTemplate',{
	extend : 'Ext.data.Model',
	idProperty:'id',
	fields : [{
		name : 'id',
		type : 'int',
		useNull: true
	},{
		name: 'subject', 
		type: 'string'
	},{
        name: 'templateId',
        type: 'int'
    },{
		name: 'fileName', 
		type: 'string'
	},{
		name: 'emails', 
		type: 'string'
	},{
		name: 'website',
		type: 'object'
	}],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/refundmailtemplates',
		reader:{
			type:'json',
			root:'data'
		},
		writer: {
			type : 'json'
		}
	}
});