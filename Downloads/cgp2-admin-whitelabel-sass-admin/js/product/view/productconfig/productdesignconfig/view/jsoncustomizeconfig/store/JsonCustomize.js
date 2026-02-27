/**
 * Created by nan on 2017/12/12.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.jsoncustomizeconfig.store.JsonCustomize', {
    extend: 'Ext.data.Store',
    require:['CGP.product.view.productconfig.productdesignconfig.view.jsoncustomizeconfig.model.JsonCustomize'],
    model:'CGP.product.view.productconfig.productdesignconfig.view.jsoncustomizeconfig.model.JsonCustomize',
    autoLoad: true,
    remoteSort: true,
    sorters: [{
        property: '_id',
        direction: 'DESC'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/jsonCustomizeConfigs/DTOs',
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
    }
});