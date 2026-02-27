/**
 * @Description:
 * @author nan
 * @date 2023/1/13
 */
Ext.define('CGP.ordersummary.store.AccountStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    requires: ['CGP.ordersummary.model.AccountModel'],
    model: 'CGP.ordersummary.model.AccountModel',
    sorters: [{
        property: 'orderDate',
        direction: 'DESC'
    }],
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/reports/account',
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