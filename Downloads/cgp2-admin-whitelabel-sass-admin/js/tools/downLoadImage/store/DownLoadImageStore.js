/**
 * @author xiu
 * @date 2024/7/29
 */
Ext.define('CGP.tools.downLoadImage.store.DownLoadImageStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.tools.downLoadImage.model.DownLoadImageModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'pagingmemory',
        data: [],
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