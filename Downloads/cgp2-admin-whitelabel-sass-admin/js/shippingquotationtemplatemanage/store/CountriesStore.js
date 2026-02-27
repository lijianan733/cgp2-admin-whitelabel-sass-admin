/**
 * Created by shirley on 2021/8/30
 * 国家
 * */
Ext.Loader.syncRequire([
    'CGP.shippingquotationtemplatemanage.model.CountriesModel'
]);
Ext.define('CGP.shippingquotationtemplatemanage.store.CountriesStore', {
    extend: 'Ext.data.Store',
    requires:['CGP.shippingquotationtemplatemanage.model.CountriesModel'],
    model:'CGP.shippingquotationtemplatemanage.model.CountriesModel',
    remoteSort: true,
    pageSize: 1000,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/countries',
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