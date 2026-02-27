Ext.define('CGP.promotionrule.model.Coupon', {
    extend: 'Ext.data.Model',
    fields: ['name', 'code', 'description', {
        name: 'maxUse',
        type: 'int'
    }, {
        name: 'used',
        type: 'int'
    }]
})