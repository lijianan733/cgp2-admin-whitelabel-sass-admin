Ext.define('CGP.productcategory.store.Website', {
    extend: 'Ext.data.Store',
    model: 'CGP.productcategory.model.Website',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/websites/available',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

})
