/**
 * Created by nan on 2018/1/31.
 */
Ext.syncRequire(['CGP.partnerapplyresultemailconfig.model.PartnerApplyResultEmailConfigModel']);
Ext.define('CGP.partnerapplyresultemailconfig.store.PartnerApplyResultEmailConfigStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.partnerapplyresultemailconfig.model.PartnerApplyResultEmailConfigModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/websites/partnerRegisterConfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    constructor:function(config){
        var me = this;
        if(config.params){
            me.proxy.extraParams = config.params;
        };
        me.callParent(arguments);
    }

})