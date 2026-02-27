/**
 * Created by nan on 2018/8/10.
 */
Ext.define('CGP.resourcesoperation.model.ResourcesOperationModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        },

        {
            name: 'idReference',
            type: 'ResourceType'
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
            name: 'operations',
            type: 'array'
        }
    ],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/security/operations',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})