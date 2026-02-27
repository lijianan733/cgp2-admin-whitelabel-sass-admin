Ext.define('CGP.promotionrule.store.Coupon', {
    extend: 'Ext.data.Store',
    model:'CGP.promotionrule.model.Coupon',

    proxy: {
        type: 'uxrest',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,

    constructor: function(config) {
        this.proxy.url = adminPath  + 'api/admin/promotionRules/' + config.id + '/coupons';
        this.callParent(arguments);
    }
})