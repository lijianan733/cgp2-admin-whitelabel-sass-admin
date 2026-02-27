/**
 * @Description:
 * @author xiu
 * @date 2023/4/26
 */
Ext.define('CGP.ordersummary.store.QpAccountStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    requires: ['CGP.ordersummary.model.AccountModel'],
    model: 'CGP.ordersummary.model.AccountModel',
    remoteSort: true,
    sorters: [{
        property: 'signDate',
        direction: 'DESC'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/reports/whitelabel/account',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})