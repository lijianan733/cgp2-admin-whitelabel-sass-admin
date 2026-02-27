Ext.define('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.product.view.managerskuattribute.model.SkuAttributeGridModel'],
    model: 'CGP.product.view.managerskuattribute.model.SkuAttributeGridModel',
    proxy: {
        type: 'uxrest',
        url: '',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true,
    pageSize: 25,
    groupField: 'isSku',
    constructor: function (config) {
        me = this;
        me.proxy.url = adminPath + 'api/products/configurable/' + config.aimUrlId + '/skuAttributes';
        me.callParent(arguments);
    }

})
