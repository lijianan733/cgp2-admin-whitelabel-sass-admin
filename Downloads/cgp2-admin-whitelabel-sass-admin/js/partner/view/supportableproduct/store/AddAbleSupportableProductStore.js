/**
 * Created by nan on 2018/4/28.
 */
Ext.define('CGP.partner.view.supportableproduct.store.AddAbleSupportableProductStore',{
    extend:'Ext.data.Store',
    request:'CGP.partner.view.supportableproduct.model.ProductModel',
    model:'CGP.partner.view.supportableproduct.model.ProductModel',
    proxy:{
        type:'uxrest',
        url:adminPath+'api/partners/{partnerId}/supportedProducts/canBeAdded',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    autoLoad:true,
    params : null,
    constructor : function(config){
        var me = this;
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.proxy.url=adminPath+'api/partners/'+config.partnerId+'/supportedProducts/canBeAdded';
        me.callParent(arguments);
    }
})