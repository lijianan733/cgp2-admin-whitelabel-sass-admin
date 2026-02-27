/**
 * Created by nan on 2018/6/11.
 */
Ext.define('CGP.partner.view.sendmailconfig.model.SendMailConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.partner.config.NotifyEmailSender'
        },
        {
            name: 'address',
            type: 'string'
        },
        {
            name: 'host',
            type: 'string'
        },
        {
            name: 'password',
            type: 'string'
        },
        {
            name: 'port',
            type: 'int'
        },
        {
            name: 'protocol',
            type: 'string'
        },
        {
            name: 'targetType',
            type: 'string'
        },
        {
            name: 'timeout',
            type: 'int'
        },
        {
            name: 'username',
            type: 'string'
        }

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners/{partnerId}/notifyEmailSenders/{senderId}',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
