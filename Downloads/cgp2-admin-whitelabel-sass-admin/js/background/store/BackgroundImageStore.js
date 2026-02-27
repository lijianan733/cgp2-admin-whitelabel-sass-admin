/**
 * Created by nan on 2020/12/25
 */

Ext.define('CGP.background.store.BackgroundImageStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    model: 'CGP.background.model.BackgroundImageModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/backgroundImages',
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