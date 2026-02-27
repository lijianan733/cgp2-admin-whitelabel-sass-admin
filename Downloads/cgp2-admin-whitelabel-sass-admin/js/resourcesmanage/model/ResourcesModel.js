/**
 * Created by nan on 2018/8/9.
 */
Ext.define('CGP.resourcesmanage.model.ResourcesModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'catalogId',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.security.domain.resource.ResourceType'
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
            name: 'idReference',
            type: 'ResourceType'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'resourceClass',
            type: 'string'
        }

    ],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/security/resources',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
