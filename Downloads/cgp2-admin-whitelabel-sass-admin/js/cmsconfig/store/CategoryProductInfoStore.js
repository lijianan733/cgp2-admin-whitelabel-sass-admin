/**
 * @Description:指定类目下产品信息
 * @author nan
 * @date 2022/5/17
 */

Ext.define('CGP.cmsconfig.store.CategoryProductInfoStore', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'attributes',
            type: 'array'
        }, {
            name: 'id',
            type: 'string'
        }, {
            name: 'mode',
            type: 'string'
        }, {
            name: 'model',
            type: 'string'
        }, {
            name: 'name',
            type: 'string'
        },
        {
            name: 'sku',
            type: 'string'
        },
        {
            name: 'type',
            type: 'string'
        },
    ],
    pageSize: 1000,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/product-of-catalog/subProductCategories/{categoryId}/products',
        ready: {
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
        if (config && config.categoryId) {
            me.proxy.url = me.proxy.url.replace('{categoryId}', config.categoryId);
        }
        me.callParent(arguments);
    },

})