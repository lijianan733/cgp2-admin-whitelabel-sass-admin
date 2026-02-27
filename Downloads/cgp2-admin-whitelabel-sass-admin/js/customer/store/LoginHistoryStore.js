Ext.define("CGP.customer.store.LoginHistoryStore",{
	extend : 'Ext.data.Store',
	
	fields : [{name: 'id',     type: 'int'},
			  {name: 'ipAddress',      type: 'string'},
			  {name: 'loginDate',    type: 'date',
			   convert: function (value) {
				      return new Date(value)},
			   serialize: function (value) {
				       var time = value.getTime();
				       return time;}},
			  {name: 'userAgent',   type: 'string'}
	],
	remoteSort:false,
	url : adminPath + 'api/loginHistories/user/{0}',
	pageSize:10,
	defaultLoginDate : null, //第一次加载是加载哪几个月的历史记录
	proxy : {
		extraParams: {
			
		},
		type : 'uxrest',
		url : adminPath + 'api/loginHistories/user/{0}',
		reader : {
			type : 'json',
			root : 'data.content'
		}
	},
	autoLoad : true,
	constructor: function (config) {
		var me =this;
      	var url = Ext.clone(me.url);
		me.defaultLoginDate = config.defaultLoginDate;
        me.proxy.url = Ext.String.format(url, config.userId);
        me.proxy.extraParams.filter = Ext.JSON.encode([
        	{name : 'loginDate',value : me.defaultLoginDate, type : 'number'}
        ]); 
        
        me.callParent(arguments);
    },
    refresh : function(userId){
    	var me = this;
    	var url = Ext.clone(me.url);
    	me.proxy.extraParams.filter = Ext.JSON.encode([
        	{name : 'loginDate',value : me.defaultLoginDate, type : 'number'}
        ]); 
    	me.proxy.url = Ext.String.format(url,userId);
    }
});