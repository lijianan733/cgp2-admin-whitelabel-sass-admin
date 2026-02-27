/**
 * Created by nan on 2021/9/1
 */
Ext.define("CGP.pcresourcelibrary.store.PCResourceLibraryStore", {
    extend: 'Ext.data.Store',
    model: "CGP.pcresourcelibrary.model.PCResourceLibraryModel",
    remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pCResourceLibraries',
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