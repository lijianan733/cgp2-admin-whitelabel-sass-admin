Ext.define("CGP.bommaterialattribute.store.AttributesOptions",{
	extend : "Ext.data.Store",
	requires : ["CGP.bommaterialattribute.model.AttributesOptions"],
	
	model: 'CGP.bommaterialattribute.model.AttributesOptions',
    remoteSort: 'true',
    pageSize: 25,
    url: adminPath + 'api/admin/bom/schema/attributes/{0}/options',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/bom/schema/attributes/{0}/options',
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