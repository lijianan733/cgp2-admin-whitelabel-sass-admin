Ext.define('CGP.common.paibantype.store.PaibanType', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'id',
        type: 'int'
    }, 'code', 'name'],
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