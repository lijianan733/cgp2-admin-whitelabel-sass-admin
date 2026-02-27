/**
 * Created by nan on 2018/5/15.
 */
Ext.define('CGP.builderpublishhistory.model.CustomerModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'gender',
            type: 'string'
        },
        {
            name: 'firstName',
            type: 'string'
        },
        {
            name: 'lastName',
            type: 'string'
        },
        {
            name: 'password',
            type: 'string'
        },
        {
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
        },
        {
            name: 'email',
            type: 'string'
        },
        {
            name: 'enable',
            type: 'boolean'
        },
        {
            name: 'roles',
            type: 'array'
        },
        {
            name: 'website',
            type: 'object'
        },
        {
            name: 'source',
            type: 'string'
        },
        {
            name: 'defaultAddressBookId',
            type: 'int',
            useNull: true
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/users/',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});