/**
 * @Description:
 * @author nan
 * @date 2022/9/7
 */
Ext.define('CGP.orderstatusmodify.model.ShipmentItemTypeSettingModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'seqNo',
            type: 'number',
        },
        {
            name: 'orderNumber',
            type: 'string',
        },
        {
            name: 'productInfo',
            type: 'object',
        },
        {
            name: 'paibanStatus',
            type: 'number',
        },
        {
            name: 'productionStatus',
            type: 'number',
        },
        {
            name: 'composingTaskExecutionTimeStatistics',
            type: 'object',
        },
        {
            name: 'productionPostTime',
            type: 'number',
        },
        {
            name: 'productionFinishTime',
            type: 'number',
        },
        {
            name: 'paibanStartTime',
            type: 'number',
        },
        {
            name: 'paibanEndTime',
            type: 'number',
        },
        {
            name: 'waitPaibanTime',
            type: 'number',
        },
        {
            name: 'waitPaibanEndTime',
            type: 'number',
        },
        {
            name: 'waitingTimeMs',
            type: 'number',
            convert: function (value, record) {
                var composingTaskExecutionTimeStatistics = record.get('composingTaskExecutionTimeStatistics');
                return composingTaskExecutionTimeStatistics?.waitingTimeMs;
            },
        },
        {
            name: 'runningTimeMs',
            type: 'number',
            convert: function (value, record) {
                var composingTaskExecutionTimeStatistics = record.get('composingTaskExecutionTimeStatistics');
                return composingTaskExecutionTimeStatistics?.runningTimeMs;
            },
        },
        {
            name: 'thumbnail',
            type: 'number',
            convert: function (value, record) {
                var productInfo = record.get('productInfo');
                return productInfo?.thumbnail;
            },
        }
    ],
})