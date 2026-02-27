/**
 * Created by nan on 2021/9/26
 */
Ext.define("CGP.pcresourcelibrary.store.ResourceStore", {
    extend: 'Ext.data.Store',
    model: "CGP.pcresourcelibrary.model.ResourceModel",
    remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcResource/common',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});