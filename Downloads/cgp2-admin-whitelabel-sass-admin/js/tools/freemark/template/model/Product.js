Ext.define('CGP.tools.freemark.template.model.Product', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        'model', 'name','type'],
    proxy: {
        type: 'uxrest',
        url: adminPath + "api/products",
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
