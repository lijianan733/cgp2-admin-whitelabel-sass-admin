/**
 * Created by nan on 2018/6/15.
 */
Ext.define('CGP.partner.view.orderstatuschangenotifyconfig.store.OrderStatusChangeNotifyConfigStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.partner.view.orderstatuschangenotifyconfig.model.OrderStatusChangeNotifyConfigModel'],
    model: 'CGP.partner.view.orderstatuschangenotifyconfig.model.OrderStatusChangeNotifyConfigModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners/{partnerId}/orderStatusChangeNotifyConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true,
    autoSync: true,
    constructor: function (config) {
        var me = this;
        me.proxy.url = adminPath + 'api/partners/' + config.partnerId + '/orderStatusChangeNotifyConfigs?partnerServiceType=' + config.type+'&createBy=CGP';
        me.callParent(arguments);
    }

})