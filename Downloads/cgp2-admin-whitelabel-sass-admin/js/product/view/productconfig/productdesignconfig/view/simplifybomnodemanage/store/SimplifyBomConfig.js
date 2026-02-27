Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.store.SimplifyBomConfig',{
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.model.SimplifyBomConfig',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/simplifyBomController',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params : null,
    autoLoad: true
});