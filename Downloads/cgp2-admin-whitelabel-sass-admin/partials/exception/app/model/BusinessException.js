/**
 * BusinessException
 * @Author: miao
 * @Date: 2021/12/17
 */
Ext.define('CGP.exception.model.BusinessException', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'number',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'message',
            type: 'string'
        },
        {
            name: 'message_zh_CN',
            type: 'string'
        },
        {
            name: 'category',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'level',
            type: 'string'
        },
        {
            name: 'params',
            type: 'array'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/businessExceptionInfo',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
