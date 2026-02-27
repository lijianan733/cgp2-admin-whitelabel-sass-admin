/**
 * Created by nan on 2019/6/27.
 */
Ext.define('CGP.operationlog.store.OperationLogStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.operationlog.model.OperationLogModel'],
    model: 'CGP.operationlog.model.OperationLogModel',
    proxy: {
        type: 'uxrest',
        timeout: 600000,
        url: operationLogPath + 'api/operation_logs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'time',
        direction: 'DESC'
    }],
    autoLoad: true

})
