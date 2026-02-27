Ext.create('Ext.data.Store',{
	storeId : 'RefundMailTemplateStore',
	model : 'CGP.model.RefundMailTemplate',
	remoteSort: true,
	autoLoad:false,
	pageSize:25,
	remoteFilter : true,
	proxy:{
		type : 'uxrest',
		url : adminPath + 'api/refundmailtemplates',
		reader : {
			type : 'json',
			root : 'data.content'
		}
	}
});