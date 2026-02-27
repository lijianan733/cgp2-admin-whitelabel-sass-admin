/**
 * Created by nan on 2018/6/21.
 */
Ext.define('CGP.partner.view.supplierorderconfig.model.NotifyEmailConfigModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.mail.MailTemplateConfig'
        },
        {
            name: 'attachments',
            type: 'array'
        },
        {
            name: 'enable',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'name',
            type: 'string',
            defaultValue: null
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string',
            defaultValue: null
        },
        {
            name: 'content',
            type: 'string'
        },
        {
            name: 'subject',
            type: 'string'
        },
        {
            name: 'to',
            type: 'array'
        },
        {
            name: 'cc',
            type: 'array'
        },
        {
            name: 'bcc',
            type: 'array'
        }
    ]
})
