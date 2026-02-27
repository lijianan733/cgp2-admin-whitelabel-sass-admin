Ext.define("CGP.bommaterialattribute.store.Attribute",{
	extend : 'Ext.data.Store',
	requires : ["CGP.bommaterialattribute.model.Attribute"],
	
	model : "CGP.bommaterialattribute.model.Attribute",
	remoteSort: 'true',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/bom/schema/attributes',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});