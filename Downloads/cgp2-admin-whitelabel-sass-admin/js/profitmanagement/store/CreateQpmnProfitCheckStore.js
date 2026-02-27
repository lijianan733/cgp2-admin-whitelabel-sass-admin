/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.define('CGP.profitmanagement.store.CreateQpmnProfitCheckStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.profitmanagement.model.CreateQpmnProfitCheckModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/balance/overview',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    /*proxy: {
        type: 'memory',
        data: []
    },
    data: [
        {
            id: 346,
            year: '2025',
            month: '2',
            finish: true,
            amount: 223,
            transferBalance: 23,
            waitTransferBalance: 200,
            outTransferBalance: 0,
            inTransferBalance: 0,
            currency: {
                code: 'US',
                symbolLeft: '$'
            },
            settlePartnerCount: 100,
            waitSettlePartnerCount: 100,
        },
        {
            id: 347,
            year: '2025',
            month: '3',
            finish: false,
            amount: 123,
            transferBalance: 23,
            waitTransferBalance: 100,
            outTransferBalance: 10,
            inTransferBalance: 20,
            settlePartnerCount: 10,
            currency: {
                code: 'US',
                symbolLeft: '$'
            },
            waitSettlePartnerCount: 100,
        },
        {
            id: 3471,
            year: '2025',
            month: '4',
            finish: false,
            amount: 123,
            currency: {
                code: 'US',
                symbolLeft: '$'
            },
            transferBalance: 23,
            waitTransferBalance: 100,
            outTransferBalance: 10,
            inTransferBalance: 20,
            settlePartnerCount: 10,
            waitSettlePartnerCount: 100,
        }
    ],*/
    sorters: {
        property: 'settleDate2',
        direction: 'DESC'
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})