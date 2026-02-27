Ext.define("CGP.model.SaleProductStatistics",{
	extend : 'Ext.data.Model',
	fields : [{
		name : 'money',
		type : 'double'
	},{
		name : 'product',
		type : 'string'
	}]
	
});

Ext.define('CGP.model.ProductCateogry', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }],
    proxy: {
        type: 'rest',
        url: adminPath + 'api/admin/productCategory',
        extraParams: {
            access_token: Ext.util.Cookies.get('token'),
            website: 1,
            isMain: true
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

Ext.create('Ext.data.Store',{
	storeId : 'MonthlyProductStatisticsStore',
	model : 'CGP.model.SaleProductStatistics',
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/orderstatistics/product',
		reader : {
			type: 'json',
			root: 'data'
		}
	},
	autoLoad : false
});

var mainProductCategoryStore = Ext.create('Ext.data.TreeStore', {
    storeId: "mainProductCategoryStore",
    model: 'CGP.model.ProductCateogry',
    nodeParam: 'id',
    proxy: {
        type: 'rest',
        url: adminPath + 'api/admin/productCategory',
        extraParams: {
            access_token: Ext.util.Cookies.get('token'),
            website: 1,
            isMain: true
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    root: {
        id: -1,
        name: ''
    },
    autoLoad: true
});