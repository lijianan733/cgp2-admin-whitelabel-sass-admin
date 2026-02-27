/**
 * Created by shirley on 2021/9/4
 * */
Ext.Loader.syncRequire([
    'CGP.shippingquotationtemplatemanage.model.ZonesModel'
]);
Ext.define('CGP.shippingquotationtemplatemanage.store.ZonesStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.shippingquotationtemplatemanage.model.ZonesModel',
    requires: ['CGP.shippingquotationtemplatemanage.model.ZonesModel'],
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/zones',
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
    },
    autoLoad: true,
    params: null
})