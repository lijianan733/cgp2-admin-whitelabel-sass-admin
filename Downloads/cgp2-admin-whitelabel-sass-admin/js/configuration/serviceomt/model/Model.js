/**
 * Created by nan on 2018/4/27.
 */
Ext.define('CGP.configuration.serviceomt.model.Model', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },
        {
            name: 'websiteId',
            type: 'int',
            useNull: true
        },
        {
            name: 'partnerId',
            type: 'int'
        },
        {
            name: 'preStatusId',
            type: 'int',
            useNull: true
        },
        {
            name: 'curStatusId',
            type: 'int',
            useNull: true
        },
        {
            name: 'mailTemplateConfig',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orderStatusChangeMailConfigs/backstage',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json'
        }
    }
});