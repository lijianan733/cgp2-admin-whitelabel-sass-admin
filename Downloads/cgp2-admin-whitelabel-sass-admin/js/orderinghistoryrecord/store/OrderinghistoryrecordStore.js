/**
 * @author xiu
 * @date 2024/5/31
 */
Ext.define('CGP.orderinghistoryrecord.store.OrderinghistoryrecordStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.orderinghistoryrecord.model.OrderinghistoryrecordModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/bulkOrderSubmitRecord',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})