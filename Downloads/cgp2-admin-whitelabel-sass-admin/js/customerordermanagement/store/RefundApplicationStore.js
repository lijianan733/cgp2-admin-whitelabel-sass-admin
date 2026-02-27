/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.define('CGP.customerordermanagement.store.RefundApplicationStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.customerordermanagement.model.RefundApplicationModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    /*proxy: {
        type: 'uxrest',
        url: adminPath + 'api/colors',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },*/
    proxy: {
        type: 'pagingmemory',
        data: []
    },
    data: [],
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})