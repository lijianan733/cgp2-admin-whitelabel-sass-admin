Ext.define('CGP.cmsformcomponentrendertemplate.model.CmsFormComponentRenderTemplateModel', {
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
            defaultValue: 'com.qpp.cgp.domain.cms.record.FormElementComponentTemplate'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'template',
            type: 'string',
        },
        {
            name: 'isGroup',
            type: 'boolean',
        },
        {
            name: 'description',
            type: 'string',
        },
        {
            name: 'previewImage',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/form-element-component-template',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})