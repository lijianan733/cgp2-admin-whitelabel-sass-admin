/**
 * Created by nan on 2018/8/16.
 */
Ext.define('CGP.acprole.model.AcpRoleModel', {
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
            defaultValue: 'com.qpp.security.domain.acp.Role'
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