Ext.define('CGP.mailsubscribe.store.MailSubscribe', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'email',
            type: 'string'
        },
        {
            name: 'subscribeDate',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'website',
            type: 'string'
        },{
            name: 'category',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/mailSubscribes',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});