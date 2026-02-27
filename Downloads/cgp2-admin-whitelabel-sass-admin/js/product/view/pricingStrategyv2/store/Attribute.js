Ext.define('CGP.product.view.pricingStrategyv2.store.Attribute', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.pricingStrategyv2.model.Attribute',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/products/{id}/attributeValues',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function (config) {
        var configurableId = config.productId;
        this.proxy.url = adminPath + 'api/products/' + configurableId + '/attributeValues';
        this.callParent(arguments);
    }
});