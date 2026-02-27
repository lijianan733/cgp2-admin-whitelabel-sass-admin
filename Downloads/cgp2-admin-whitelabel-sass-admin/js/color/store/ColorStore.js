Ext.define('CGP.color.store.ColorStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.color.model.ColorModel'],
    model: 'CGP.color.model.ColorModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/colors',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    //model.js
    remoteSort: true,
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
