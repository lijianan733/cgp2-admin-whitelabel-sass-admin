Ext.define("CGP.promotionrule.store.Product",{
	extend : 'Ext.data.Store',
	
    model: 'CGP.promotionrule.model.Product',
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