
Ext.create('Ext.data.Store',{
	storeId : 'ShippingMethod',
	model : 'CGP.model.ShippingModule',
	remoteSort: false,	
	proxy:{
		type:'uxrest',
		url:adminPath + 'api/shippingModules',
		reader:{
			type:'json',
			root:'data'
		}
	},
	sorters: [{
            property: 'sortOrder',
            direction: 'ASC'
        }],
    listeners: {
        update: function (me, record, operation, modifiedFieldNames, eOpts) {
            me.sort('sortOrder', 'ASC');
        }
    }
});

Ext.create("Ext.data.Store",{
	fields : ["code"],
	storeId : 'shippingConfigStore',
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/shippingModules/allMethod',
		reader : {
			type : 'json',
			root : 'data'
		}
	}
})
