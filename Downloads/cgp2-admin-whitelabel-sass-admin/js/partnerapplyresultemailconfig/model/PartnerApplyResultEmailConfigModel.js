/**
 * Created by nan on 2018/1/31.
 */
Ext.define('CGP.partnerapplyresultemailconfig.model.PartnerApplyResultEmailConfigModel', {
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
            type: 'int'
        },
        {
            name: 'verifySuccessNotificationConfig',
            type: 'object'
        },
        {
            name: 'verifyFailedNotificationConfig',
            type: 'object'
        },
        {
            name: 'defaultRoleIds',
            type: 'array'
        }
    ],
    proxy: {
        url: adminPath + '',
        type: 'uxrest',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
})