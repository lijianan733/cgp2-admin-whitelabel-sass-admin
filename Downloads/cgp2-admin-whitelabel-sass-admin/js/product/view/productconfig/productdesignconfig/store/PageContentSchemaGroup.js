Ext.define('CGP.product.view.productconfig.productdesignconfig.store.PageContentSchemaGroup',{
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.model.PageContentSchemaGroup',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pageContentSchemaGroups',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});