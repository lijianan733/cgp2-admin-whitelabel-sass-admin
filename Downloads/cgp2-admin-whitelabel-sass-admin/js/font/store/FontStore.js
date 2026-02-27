Ext.define("CGP.font.store.FontStore", {
    extend: 'Ext.data.Store',
    model: "CGP.font.model.FontModel",
    remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/font',
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