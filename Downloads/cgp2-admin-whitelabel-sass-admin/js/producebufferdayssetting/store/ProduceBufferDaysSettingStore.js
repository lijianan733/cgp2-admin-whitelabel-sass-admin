/**
 * @author xiu
 * @date 2025/9/26
 */
Ext.define('CGP.producebufferdayssetting.store.ProduceBufferDaysSettingStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.producebufferdayssetting.model.ProduceBufferDaysSettingModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'pagingmemory'
    },
    sorters: [
        {
            property: 'qtyFrom',
            direction: 'ASC'
        }
    ],
    data: [],
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})