/**
 * Created by shirley on 2021/8/23
 * */
Ext.Loader.syncRequire([
    'CGP.shippingquotationtemplatemanage.model.AreaShippingConfigGroupModel'
]);
Ext.define('CGP.shippingquotationtemplatemanage.store.AreaShippingConfigGroupStore',{
    extend:'Ext.data.Store',
    requires:['CGP.shippingquotationtemplatemanage.model.AreaShippingConfigGroupModel'],
    model:'CGP.shippingquotationtemplatemanage.model.AreaShippingConfigGroupModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/areaShippingConfigGroups',
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