Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV2.store.MaterialMapping', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV2.model.MaterialMapping',
    //    expanded: true,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materialMappingConfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
});