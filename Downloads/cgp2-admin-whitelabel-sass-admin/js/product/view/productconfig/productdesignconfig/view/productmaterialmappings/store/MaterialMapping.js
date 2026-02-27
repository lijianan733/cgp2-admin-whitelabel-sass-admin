Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappings.store.MaterialMapping', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappings.model.MaterialMapping',
    //    expanded: true,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materialMappings',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
});