Ext.define('CGP.customer.model.Customer', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'string',
            useNull: true
        }, {
            name: 'type',
            type: 'string'
        }, {
            name: 'gender',
            type: 'string'
        }, {
            name: 'firstName',
            type: 'string'
        }, {
            name: 'lastName',
            type: 'string'
        }, {
            name: 'password',
            type: 'string'
        }, {
            name: 'dob',
            type: 'date',
            convert: function (value) {
                if (!Ext.isEmpty(value)) {
                    return new Date(value)
                }
            },
            serialize: function (value) {
                if (!Ext.isEmpty(value)) {
                    var time = value.getTime();
                    return time;
                }
            }
        }, {
            name: 'email',
            type: 'string'
        }, {
            name: 'enable',
            type: 'boolean'
        }, {
            name: 'roles',
            type: 'array'
        }, {
            name: 'website',
            type: 'object'
        }, {
            name: 'source',
            type: 'string',
            //defaultValue: null,
            serialize: function (v) {
                if (Ext.isEmpty(v)) {
                    return null;
                }
            }
        }, {
            name: 'defaultAddressBookId',
            type: 'int',
            useNull: true
        },
        {
            name: 'partnerId',
            type: 'number'
        },
        {
            name: 'registerDate',
            type: 'number',
        },
        {
            name: 'userName',
            type: 'string',
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/users',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});