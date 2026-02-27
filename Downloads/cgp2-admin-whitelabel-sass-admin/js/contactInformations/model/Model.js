Ext.define('CGP.contactInformations.model.Model',{
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.partner.ContactInformation'
        },
        {
            name: 'fullName',
            type: 'string',
        },
        {
            name: 'email',
            type: 'string',
        },
        {
            name: 'phoneNumber',
            type: 'string',
        },
        {
            name: 'websiteUrl',
            type: 'string',
        },
        {
            name: 'discuss',
            type: 'string',
        },
        {
            name: 'status',
            type: 'string',
        },
        {
            name: 'remark',
            type: 'string',
        },
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/business/contactInformations',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
})