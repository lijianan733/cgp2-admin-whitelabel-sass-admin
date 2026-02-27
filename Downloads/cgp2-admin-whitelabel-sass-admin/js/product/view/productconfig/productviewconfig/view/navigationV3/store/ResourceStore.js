/**
 * Created by nan on 2021/6/8
 * builder中使用的中英对照的资源
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.navigationV3.store.ResourceStore', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'values',
            type: 'array'
        }
    ],
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/languageResources/tables',
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
    }
})