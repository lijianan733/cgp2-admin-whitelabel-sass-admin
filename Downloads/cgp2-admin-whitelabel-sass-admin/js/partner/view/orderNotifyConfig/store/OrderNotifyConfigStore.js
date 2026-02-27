/**
 * Created by nan on 2017/12/19.
 */
Ext.syncRequire('CGP.partner.view.orderNotifyConfig.model.OrderNotifyConfigModel')
Ext.define('CGP.partner.view.orderNotifyConfig.store.OrderNotifyConfigStore',{
    extend:'Ext.data.Store',
    requires: ['CGP.partner.view.orderNotifyConfig.model.OrderNotifyConfigModel'],
    model:'CGP.partner.view.orderNotifyConfig.model.OrderNotifyConfigModel',
    params:null,
    proxy:{
        type:'uxrest',
        url:adminPath+'api/partners/{partnerId}/orderStatusChangeNotifications',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    autoLoad:true,
    constructor:function(config){
        var me = this;
        me.proxy.url=adminPath+'api/partners/'+config.partnerId+'/orderStatusChangeNotifications'
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments)
    }

})