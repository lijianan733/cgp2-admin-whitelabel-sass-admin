Ext.define('CGP.product.view.managerskuattribute.store.SkuProductGridStore',{
    extend:'Ext.data.Store',
    request:'CGP.product.model.Product',
    model: 'CGP.product.model.Product',
    proxy: {
        type: 'uxrest',
        url: '',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true,
    constructor:function(config){
        me=this;
        me.proxy.url=adminPath + 'api/products/configurable/' + config.productId + '/skuProduct';
        me.callParent();
    }

})