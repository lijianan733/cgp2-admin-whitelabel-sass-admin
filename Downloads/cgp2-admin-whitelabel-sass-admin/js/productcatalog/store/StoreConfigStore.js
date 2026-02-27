/**
 * @author xiu
 * @date 2025/7/30
 */
Ext.define('CGP.productcatalog.store.StoreConfigStore', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: '_id',
            type: 'number'
        },
        {
            name: 'attribute',
            type: 'object'
        },
        {
            name: 'componentType',
            type: 'string'
        },
        {
            name: 'guideName',
            type: 'string'
        },
        {
            name: 'guideUrl',
            type: 'string'
        },
        {
            name: 'shortDesc',
            type: 'string'
        },
        {
            name: 'nickName',
            type: 'string'
        },
        {
            name: 'options',
            type: 'array'
        },
        {
            name: 'profiles',
            type: 'array'
        }
    ],
    pageSize: 25,
    autoLoad: true,
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/cms/product-catalogs/property-configs',
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