Ext.define('CGP.mailsubscribe.store.MailHistory', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'subject',
            type: 'string'
        },
        {
            name: 'pushDate',
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
        },
        {
            name: 'operator',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/mailSubscribes/pushHistories',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});