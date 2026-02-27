Ext.define('CGP.productcompositemodels.store.CompositeModelCategories',{
    extend: 'Ext.data.Store',
    model: 'CGP.productcompositemodels.model.CompositeModelCategories',
    proxy:{
        type: 'uxrest',
        url: adminPath+ 'api/admin/compositeModelCategories',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})