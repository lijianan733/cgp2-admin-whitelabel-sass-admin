Ext.create('Ext.data.Store',{
	storeId : 'orderStatisticsStore',
	model : 'CGP.model.OrderStatistics',
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/orderstatistics/month',
		reader : {
			type: 'json',
			root: 'data'
		}
	},
	autoLoad : false
})

