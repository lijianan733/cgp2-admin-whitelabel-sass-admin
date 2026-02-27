Ext.define("CGP.configuration.invoiceomt.InvoiceTemplateConfigStore",{
	extend : "Ext.data.Store",
	model : 'CGP.configuration.invoiceomt.InvoiceMailTemplate',
	remoteSort: true,
	autoLoad:false,
	pageSize:25,
	remoteFilter : true,
	proxy:{
		type : 'uxrest',
		url : adminPath + 'api/invoicemailtemplates',
		reader : {
			type : 'json',
			root : 'data.content'
		}
	}
});

