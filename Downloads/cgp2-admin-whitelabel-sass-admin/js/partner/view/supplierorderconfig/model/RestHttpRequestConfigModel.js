/**
 * Created by nan on 2018/6/19.
 */
Ext.define('CGP.partner.view.supplierorderconfig.model.RestHttpRequestConfigModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.partner.RestHttpRequestConfig'
        },
        {
            name: 'method',
            type: 'string'
        },
        {
            name: 'enable',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'isTest',
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
            name: 'url',
            type: 'string'
        },
        {
            name: 'headers',
            type: 'object'
        },
        {
            name: 'body',
            type: 'string'
        },
        {
            name: 'queryParameters',
            type: 'object'
        },
        {
            name: 'successPath',
            type: 'string'
        },
        {
            name: 'successKey',
            type: 'string'
        },
        {
            name: 'errorMessagePath',
            type: 'string'
        }
    ]
})
