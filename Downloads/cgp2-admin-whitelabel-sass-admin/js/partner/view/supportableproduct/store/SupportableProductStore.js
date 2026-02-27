/**
 * Created by nan on 2018/3/26.
 */
Ext.define('CGP.partner.view.supportableproduct.store.SupportableProductStore',{
    extend:'Ext.data.Store',
    request:'CGP.partner.view.supportableproduct.model.SupportableProductModel',
    model:'CGP.partner.view.supportableproduct.model.SupportableProductModel',
    proxy:{
        type:'uxrest',
        url:adminPath+'api/partners/{partnerId}/supportedProducts',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    autoLoad:true,
    constructor:function(config){
        var me = this;
        me.proxy.url=adminPath+'api/partners/'+config.partnerId+'/supportedProducts';
        me.callParent(arguments);
    }
})