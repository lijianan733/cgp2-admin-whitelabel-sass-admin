Ext.define('CGP.product.edit.store.CompositeModel', {
    extend: 'Ext.data.Store',
    fields:['code','name'],
    proxy: {
        type : 'uxrest',
        url: adminPath + "api/admin/compositeModels",
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true
})