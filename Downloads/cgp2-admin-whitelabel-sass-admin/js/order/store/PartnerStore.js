Ext.define('CGP.order.store.PartnerStore', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'name',
            type: 'string',
            convert: function (value, record) {
                return value + '<' + record.getId() + '>'
            }
        },
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'partnerType',
            type: 'string'
        },
        {
            name: 'email',
            type: 'string'
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
})