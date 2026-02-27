Ext.define('CGP.ticket.model.Ticket', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'category',
        'websiteId',
        'websiteName',
        'ip',
        {
            name: 'createdDate',
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
            name: 'status',
            type: 'int'
        },
        {
            name: 'histories',
            type: 'array'
        },
        {
            //附件
            name: 'attachments',
            type: 'array',
            serialize: function (value) {
                if(Ext.isEmpty(value)){
                    return [];
                }
                return value;
            }

        }
    ], proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/tickets',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

})