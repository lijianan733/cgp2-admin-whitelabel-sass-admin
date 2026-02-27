/**
 * Created by shirley on 2021/8/27
 * */
Ext.Loader.syncRequire([
    'CGP.shippingquotationtemplatemanage.model.AreaQtyShippingModel'
]);
Ext.define('CGP.shippingquotationtemplatemanage.store.AreaQtyShippingStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.shippingquotationtemplatemanage.model.AreaQtyShippingModel',
    requires: ['CGP.shippingquotationtemplatemanage.model.AreaQtyShippingModel'],
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url:  adminPath + 'api/areaShippingConfigGroups',
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