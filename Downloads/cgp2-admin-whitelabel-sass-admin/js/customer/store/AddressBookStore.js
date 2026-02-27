Ext.define("CGP.customer.store.AddressBookStore",{
	extend  : 'Ext.data.Store',
	requires : 'CGP.customer.model.AddressBook',
	
	model : 'CGP.customer.model.AddressBook',
//	storeId : 'addressBook',
	remoteSort:false,
	proxy : {
			extraParams: {
                    userId: null
            },
			type : 'uxrest',
			url : adminPath + 'api/addressBooks',
			reader : {
				successProperty : false,
				type : 'json',
				root : 'data'
			}
	},
	userId :null,
	autoLoad:false,
	constructor: function (config) {

        var me = this;

        me.proxy.extraParams.userId = config.userId;

        me.callParent(arguments);
    }
		
});