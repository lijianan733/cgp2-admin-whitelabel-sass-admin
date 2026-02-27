/**
 * Created by nan on 2018/4/24.
 */
Ext.define('CGP.configuration.productdefaultsupplier.store.EnablePartnerStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.configuration.productdefaultsupplier.model.EnablePartnerModel',
    proxy: {
        type: 'uxrest',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    constructor : function(config){
        var me = this;
        me.addEvents(['nosupportpartner']);
        if(config && config.productId){
            me.proxy.url= adminPath+'api/products/'+config.productId+'/availableProducers'
        }
        me.callParent(arguments);
    }
})