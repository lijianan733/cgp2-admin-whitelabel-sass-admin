Ext.define("CGP.product.view.productconfig.productviewconfig.store.BuilderFont",{
    extend : 'Ext.data.Store',
    model : "CGP.product.view.productconfig.productviewconfig.model.BuilderFont",
    remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/font',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});