Ext.define("CGP.attribute.store.Attribute",{
	extend : 'Ext.data.Store',
	requires : ["CGP.attribute.model.Attribute"],
	
	model : "CGP.attribute.model.Attribute",
	remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/attributes',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'id',
        direction: 'DESC'
    }],
    autoLoad: true
});