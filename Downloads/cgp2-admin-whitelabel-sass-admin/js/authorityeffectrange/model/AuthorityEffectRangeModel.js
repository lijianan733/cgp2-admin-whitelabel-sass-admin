/**
 * Created by nan on 2018/8/10.
 */
Ext.define('CGP.authorityeffectrange.model.AuthorityEffectRangeModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.security.domain.acp.AccessControlPermission'
        },
        {
            name: 'abstractACPDTOS',
            type: 'object'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'effectiveTime',
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
            name: 'expireTime',
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
            name: 'permissionType',
            type: 'string'
        },
        {
            name: 'scope',
            type: 'object'
        },
        {
            name: 'privilege',
            type: 'object'
        },
        {
            name: 'privilegeDTO',
            type: 'object'
        }

    ],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/security/acp',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})