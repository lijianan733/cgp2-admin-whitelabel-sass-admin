
/**
 * Created by nan on 2017/12/21.
 */
Ext.define('CGP.partner.view.orderNotifyConfig.model.RestHttpRequestConfigModel',{
    extend:'Ext.data.Model',
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
