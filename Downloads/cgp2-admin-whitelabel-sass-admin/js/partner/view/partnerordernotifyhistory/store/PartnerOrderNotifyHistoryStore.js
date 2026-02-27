/**
 * Created by nan on 2017/12/18.
 */
Ext.syncRequire(['CGP.partner.view.partnerordernotifyhistory.model.PartnerOrderNotifyHistoryModel']);
Ext.define('CGP.partner.view.partnerordernotifyhistory.store.PartnerOrderNotifyHistoryStore',{
    extend:'Ext.data.Store',
    autoLoad:true,
    model:'CGP.partner.view.partnerordernotifyhistory.model.PartnerOrderNotifyHistoryModel',
    params:null,
    proxy:{
        type:'uxrest',
        url:adminPath+'api/partnerOrderNotifyHistories',
        reader:{
            type: 'json',
            root:'data.content'
        }
    },
    constructor:function(config){
        var me = this;
            if(config.params){
                me.proxy.extraParams = config.params;
            }
        me.callParent(arguments);
    }
});