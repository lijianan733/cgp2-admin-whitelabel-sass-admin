Ext.define('CGP.productcategory.store.Product', {
    extend: 'Ext.data.Store',
    fields: ['id', 'type', 'sku',
        'name', 'model']
})