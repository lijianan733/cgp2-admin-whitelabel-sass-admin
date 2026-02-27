/**
 * @Description:
 * @author nan
 * @date 2023/1/13
 */
Ext.define('CGP.ordersummary.store.CutOffStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    requires: ['CGP.ordersummary.model.CutOffModel'],
    model: 'CGP.ordersummary.model.CutOffModel',
    remoteSort: true,
    sorters: [{
        property: 'signDate',
        direction: 'DESC'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/reports/cutoff',
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