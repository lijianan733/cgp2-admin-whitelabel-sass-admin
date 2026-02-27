/**
 * Created by nan on 2018/6/11.
 */
Ext.define('CGP.partner.view.sendmailconfig.store.SendMailConfigStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.partner.view.sendmailconfig.model.SendMailConfigModel'],
    model: 'CGP.partner.view.sendmailconfig.model.SendMailConfigModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners/{partnerId}/notifyEmailSenders',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true,
    autoSync: true,
    constructor: function (config) {
        var me = this;
        me.proxy.url = adminPath + 'api/partners/' + config.partnerId + '/notifyEmailSenders';
        me.callParent(arguments);
    }

})