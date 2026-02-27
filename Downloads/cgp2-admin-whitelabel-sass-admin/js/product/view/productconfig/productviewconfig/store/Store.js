Ext.define('CGP.product.view.productconfig.productviewconfig.store.Store',{
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productviewconfig.model.ProductViewCfgModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productConfigViews',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params : null,

    constructor : function(config){
        var me = this;
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    autoLoad: false
})