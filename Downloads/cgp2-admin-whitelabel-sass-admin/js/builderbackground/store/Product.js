Ext.define("CGP.builderbackground.store.Product",{
	extend : "Ext.data.Store",
	requires : ["CGP.builderbackground.model.Product"],
	
	model: 'CGP.builderbackground.model.Product',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + "api/products/list",
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});
