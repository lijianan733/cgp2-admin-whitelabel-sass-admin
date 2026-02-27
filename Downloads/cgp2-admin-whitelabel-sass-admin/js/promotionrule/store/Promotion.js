Ext.define('CGP.promotionrule.store.Promotion', {
    extend: 'Ext.data.Store',
    model: 'CGP.promotionrule.model.Promotion',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/promotions',
        reader:{
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})