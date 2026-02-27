/**
 * Created by shirley on 2021/8/24
 * */
Ext.Loader.syncRequire([
    'CGP.shippingquotationtemplatemanage.model.CurrencyModel'
]);
Ext.define('CGP.shippingquotationtemplatemanage.store.CurrencyStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.shippingquotationtemplatemanage.model.CurrencyModel',
    requires: ['CGP.shippingquotationtemplatemanage.model.CurrencyModel'],
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/currencies',
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