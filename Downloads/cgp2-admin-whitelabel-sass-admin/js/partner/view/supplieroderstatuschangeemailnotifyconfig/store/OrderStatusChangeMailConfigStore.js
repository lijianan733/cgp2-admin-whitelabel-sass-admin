/**
 * Created by nan on 2018/4/23.
 */
Ext.define('CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.store.OrderStatusChangeMailConfigStore', {
    extend: 'Ext.data.Store',
    require: 'CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.model.OrderStatusChangeMailConfigModel',
    model: 'CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.model.OrderStatusChangeMailConfigModel',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath+'api/qppOrderStatusChangeMailConfigs',
        reader: {
            type:'json',
            root:'data.content'
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