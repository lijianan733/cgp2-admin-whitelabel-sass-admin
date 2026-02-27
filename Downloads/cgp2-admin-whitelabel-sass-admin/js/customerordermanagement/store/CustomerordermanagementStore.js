/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.define('CGP.customerordermanagement.store.CustomerordermanagementStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.customerordermanagement.model.CustomerordermanagementModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/background/store/orders/v1',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    // 排序
    sorters: [
        {
            property: 'datePurchased',
            direction: 'DESC'
        }
    ],
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})