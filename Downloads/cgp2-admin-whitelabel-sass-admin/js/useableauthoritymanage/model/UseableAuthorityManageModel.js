/**
 * Created by nan on 2018/8/10.
 */
Ext.define('CGP.useableauthoritymanage.model.UseableAuthorityManageModel', {
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
            defaultValue: 'com.qpp.security.domain.privilege.AtomPrivilege'
        },
        {
            name: 'idReference',
            type: 'ResourceType',
            defaultValue: 'AtomPrivilege'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'resource',
            type: 'object'
        },
        {
            name: 'operation',
            type: 'object'
        },
        {
            name: 'privileges',
            type: 'array'
        },{

            name: 'resourceSort',
            type: 'object'
        }
    ],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/security/privileges',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})