

//var localRoleStore = new Ext.data.Store({
//	model : 'CGP.model.Role',
//	storeId : 'localRoleStore',
//	data : []
//});

Ext.define("CGP.customer.store.RoleStore",{
	extend : 'Ext.data.Store',
	
	
 	autoLoad: true,
    model: 'CGP.customer.model.Role',
    url : adminPath + 'api/userRoles?customerId={0}',
    userId : null,
    proxy: {

        /*params: {
				customerId: '44'
			},*/
    	url : adminPath + 'api/userRoles?customerId={0}',
        type: 'uxrest',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor : function(config){
   		var me = this;
   		var url = Ext.clone(me.url);

        me.proxy.url = Ext.String.format(url, config.userId);
        me.callParent(arguments);
    },
    resetUrl : function(userId){
    	var me = this;
    	me.userId = userId;
    	var url = Ext.clone(me.url);
    	me.proxy.url = Ext.String.format(url,me.userId);
    }
 });