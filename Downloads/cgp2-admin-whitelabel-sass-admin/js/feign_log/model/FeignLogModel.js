/**
 * Created by nan on 2019/6/27.
 */
Ext.define('CGP.feign_log.model.FeignLogModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int'
        },
        {
            name: 'env',
            type: 'string'
        }, {
            name: 'requestHeaders',
            type: 'object'
        }, {
            name: 'requestMethod',
            type: 'string'
        },
        {
            name: 'requestUrl',
            type: 'string'
        }, {
            name: 'responseBody',
            type: 'string'
        }, {
            name: 'responseHeaders',
            type: 'object'
        }, {
            name: 'responseStatusCode',
            type: 'string'
        },
        {
            name: 'createdDate',
            type: 'string'
        }, {
            name: 'createdBy',
            type: 'object'
        }, {
            name: 'modifiedBy',
            type: 'string'
        },
        {
            name: 'modifiedDate',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.FeignLogInfo'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/feignLogInfo',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
