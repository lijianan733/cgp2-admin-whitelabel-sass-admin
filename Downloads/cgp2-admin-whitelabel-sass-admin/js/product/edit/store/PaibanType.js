Ext.define('CGP.product.edit.store.PaibanType', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {name: 'code',type: 'string'},{name:'name',type:"string",useNull: true}],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/paibanType',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true
})