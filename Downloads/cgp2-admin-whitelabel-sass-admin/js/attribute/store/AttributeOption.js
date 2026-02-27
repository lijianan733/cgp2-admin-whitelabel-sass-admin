Ext.define("CGP.attribute.store.AttributeOption",{
	extend : "Ext.data.Store",
	requires : ["CGP.attribute.model.AttributeOption"],
	
	model: 'CGP.attribute.model.AttributeOption',
    remoteSort: 'true',
    pageSize: 25,
    url: adminPath + 'api/attributes/{0}/option',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/attributes/{0}/option',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoSync: true,
    autoLoad : true,
    constructor: function(config){
    	var me = this;
    	var url = Ext.String.format(Ext.clone(me.url),config.id);
    	me.proxy.url = url;
    	me.callParent(arguments);
    	me.on("write",function(store){
    		store.sort("sortOrder","ASC");
    	});
    }
	
});