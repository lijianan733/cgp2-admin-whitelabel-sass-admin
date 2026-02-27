/**
 * Created by nan on 2020/2/19.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.OperatorStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.OperatorModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/operatorcontroller',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    constructor : function(config){
        var me = this;
        if(config){
            if(config.params){
                me.proxy.extraParams = config.params;
            }
        }
        me.callParent(arguments);
    }
});
