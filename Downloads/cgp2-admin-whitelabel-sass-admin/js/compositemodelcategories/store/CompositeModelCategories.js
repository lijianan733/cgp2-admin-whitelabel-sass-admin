Ext.define('CGP.compositemodelcategories.store.CompositeModelCategories',{
    extend: 'Ext.data.Store',
    model: 'CGP.compositemodelcategories.model.CompositeModelCategories',
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