Ext.define('CGP.bommaterialattribute.store.ValueTypes',{
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        'code'
    ],
    proxy: {
        extraParams: {
            locale: Ext.util.Cookies.get('lang')
        },
        type: 'uxrest',
        url: adminPath + 'api/admin/bom/schema/attributes/valueTypes',
        reader: {
            type: 'json',
            root: 'data'
        }
    },

    autoLoad: true
})