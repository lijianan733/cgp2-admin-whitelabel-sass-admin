Ext.define('CGP.product.view.productconfig.productmappingconfig.store.ProductMappingCfgStore',{
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productmappingconfig.model.ProductMappingCfgModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productConfigMappings',
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
