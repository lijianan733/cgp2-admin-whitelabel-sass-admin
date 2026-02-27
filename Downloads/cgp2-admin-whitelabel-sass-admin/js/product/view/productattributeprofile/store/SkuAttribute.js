Ext.define('CGP.product.view.productattributeprofile.store.SkuAttribute', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productattributeprofile.model.SkuAttribute',
    proxy : {
        type : 'memory'
    }
});