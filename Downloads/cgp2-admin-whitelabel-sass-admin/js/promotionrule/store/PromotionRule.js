Ext.define('CGP.promotionrule.store.PromotionRule', {
    extend: 'Ext.data.Store',
    model: 'CGP.promotionrule.model.PromotionRule',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/promotionRules',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
//    autoLoad: true
})