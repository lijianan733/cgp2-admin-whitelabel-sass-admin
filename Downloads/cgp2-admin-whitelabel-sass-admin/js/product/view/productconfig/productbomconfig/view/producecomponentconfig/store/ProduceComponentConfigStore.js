/**
 * Created by nan on 2018/10/24.
 */
Ext.define('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.store.ProduceComponentConfigStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.model.ProduceComponentConfigModel',
    pageSize: 1000,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/produceComponentConfigs',
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
})