/**
 * Created by nan on 2018/1/10.
 */
Ext.syncRequire(['CGP.partner.view.partnerorderreportconfigmanage.model.PartnerOrderReportConfigModel']);
Ext.define('CGP.partner.view.partnerorderreportconfigmanage.store.PartnerOrderReportConfigStore', {
    extend: 'Ext.data.Store',
    request:'CGP.partner.view.partnerorderreportconfigmanage.model.PartnerOrderReportConfigModel',
    model:'CGP.partner.view.partnerorderreportconfigmanage.model.PartnerOrderReportConfigModel',
    proxy:{
        type:'uxrest',
        url:adminPath+'',
        reader:{
            type: 'json',
            root:'data.content'
        }
    },
    constructor:function(config){
        var me =this;
        me.proxy.url = adminPath+'api/partners/'+config.partnerId+'/reports/configs';
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments)
    },
    autoLoad:true
})