Ext.define('CGP.common.store.Partner', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'name',
            type: 'string',
            convert: function(value,record){
                return value+'<'+record.getId()+'>'
            }
        },
        {
            name: 'id',
            type: 'int'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});