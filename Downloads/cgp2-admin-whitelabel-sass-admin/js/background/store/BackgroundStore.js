/**
 * Created by nan on 2020/12/18
 */
Ext.define('CGP.background.store.BackgroundStore', {
    extend: 'Ext.data.Store',
    requires: ["CGP.background.model.BackgroundModel"],
    model: "CGP.background.model.BackgroundModel",
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/backgrounds',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})