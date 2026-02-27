/**
 * Created by nan on 2019/6/27.
 */
Ext.define('CGP.operationlog.model.OperationLogModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int'
        },
        {
            name: 'params',
            type: 'object'
        },
        {
            name: 'result',
            type: 'object'
        },
        {
            name: 'user',
            type: 'string'
        },
        {
            name: 'time',
            type: 'data',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'duration',
            type: 'int'
        },
        {
            name: 'level',
            type: 'string'
        },
        {
            name: 'tags',
            type: 'array',
            convert: function (value, record) {
                var result = [];
                if (Ext.isEmpty(value) || Ext.Object.isEmpty(value)) {
                    return [];
                } else {
                    for (i in value) {
                        result.push(i + ':' + value[i]);
                    }
                    return result;
                }
            }
        },
        {
            name: 'message',
            type: 'string'
        }, {
            name: 'module',
            type: 'string'
        }, {
            name: 'operator',
            type: 'string'
        }, {
            name: 'ip',
            type: 'string'
        }, {
            name: 'applicationName',
            type: 'string'
        },
        {
            name: 'requestInfo',
            type: 'object'
        }, {
            name: 'extra',
            type: 'object'
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.operation.log.domain.OperationLog'
        }
    ],
    proxy: {
        type: 'uxrest',
        timeout: 600000,
        url: operationLogPath + 'api/operation_logs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
