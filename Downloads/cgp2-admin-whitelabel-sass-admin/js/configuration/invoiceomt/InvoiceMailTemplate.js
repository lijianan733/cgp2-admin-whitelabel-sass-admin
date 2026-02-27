Ext.define('CGP.configuration.invoiceomt.InvoiceMailTemplate',{
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int',
		useNull: true
	},{
		name: 'subject', 
		type: 'string'
	},{
		name: 'fileName', 
		type: 'string'
	},{
        name: 'templateId',
        type: 'int'
    },{
		name: 'emails', 
		type: 'string'
	},{
		name: 'websiteId',
		type: 'int'
	},{
		name : 'websiteName',
		type : 'string'
	}],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/invoicemailtemplates',
		reader:{
			type:'json',
			root:'data'
		},
		writer: {
			type : 'json'
		}
	}
});