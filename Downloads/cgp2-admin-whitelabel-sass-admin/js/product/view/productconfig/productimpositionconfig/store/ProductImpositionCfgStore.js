Ext.define('CGP.product.view.productconfig.productimpositionconfig.store.ProductImpositionCfgStore',{
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productimpositionconfig.model.ProductImpositionCfgModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productConfigImpositions',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params : null,
    sorters : [{
        property : 'configVersion',
        direction : 'ASC'
    }],
    constructor : function(config){
        var me = this;
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    autoLoad: true
})
