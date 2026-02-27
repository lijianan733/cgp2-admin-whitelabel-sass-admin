
Ext.define("CGP.configuration.store.MailTemplateFileStore",{
	extend : 'Ext.data.Store',
	
	proxy : {
		extraParams:{
			target : 'customer'
		},
		type : 'uxrest',
		url : adminPath + 'api/configurations/mailtemplatefilenames',
		reader :{
			type : 'json',
			root : "data"
		}
	},
	fields: [
         {name:'name', type: 'string'},
         {name:'description',  type: 'string'}
    ],
    params : null,
    
    constructor : function(config){
    	var me = this;
    	me.proxy.extraParams = config.params;
    	me.callParent(arguments);
    }
});