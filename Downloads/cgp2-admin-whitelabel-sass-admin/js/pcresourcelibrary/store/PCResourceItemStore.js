/**
 * Created by nan on 2021/9/2
 */
Ext.define("CGP.pcresourcelibrary.store.PCResourceItemStore", {
    extend: 'Ext.data.Store',
    model: "CGP.pcresourcelibrary.model.PCResourceItemModel",
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcresourceItems',
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
})