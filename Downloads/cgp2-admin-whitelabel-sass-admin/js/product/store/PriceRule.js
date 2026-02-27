Ext.define('CGP.product.store.PriceRule', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.model.PriceRule',
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        if (config.productId) {
            me.proxy = {
                type: 'uxrest',
                url: adminPath + 'api/products/' + config.productId + '/qtyPrice',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            };
        }
        me.callParent(arguments);
    }

})