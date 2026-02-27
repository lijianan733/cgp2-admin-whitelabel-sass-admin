Ext.define('CGP.product.view.managerskuattribute.store.SkuAttributeConstraint', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.managerskuattribute.model.SkuAttributeConstraint',
    //    expanded: true,
    autoLoad: true,
    autoSync:true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/skuAttributes/{skuAttributeId}/constraints/v2/',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function(config) {
        var skuAttributeId = config.skuAttributeId;
        this.proxy.url = adminPath + 'api/skuAttributes/'+skuAttributeId+'/constraints/v2/';
        this.callParent(arguments);
    }
});