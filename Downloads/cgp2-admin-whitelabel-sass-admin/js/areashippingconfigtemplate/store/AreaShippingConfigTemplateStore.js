/**
 * Created by shirley on 2021/8/28
 * */
Ext.define('CGP.areashippingconfigtemplate.store.AreaShippingConfigTemplateStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.areashippingconfigtemplate.model.AreaShippingConfigTemplateModel'],
    model: 'CGP.areashippingconfigtemplate.model.AreaShippingConfigTemplateModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/areaShippingConfigTemplates',
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