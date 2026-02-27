/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.define('CGP.profitmanagement.store.CreatePartnerProfitCheckStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.profitmanagement.model.CreatePartnerProfitCheckModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/{partnerId}/balance',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: {
        property: 'settleDate',
        direction: 'DESC'
    },
    /*proxy: {
        type: 'memory',
        data: []
    },
    data: [
        {
            id: 346,
            year: '2025',
            month: '3',
            finish: true,
            amount: 123,
            transferBalance: 123,
            outTransferBalance: 0,
            inTransferBalance: 0,
            waitTransferBalance: 0,
        },
        {
            id: 1346,
            year: '2025',
            month: '2',
            finish: false,
            amount: 123,
            transferBalance: 23,
            outTransferBalance: 10,
            inTransferBalance: 200,
            waitTransferBalance: 100,
        },
        {
            id: 13456,
            year: '2025',
            month: '2',
            finish: false,
            amount: 123,
            transferBalance: 113,
            outTransferBalance: 10,
            inTransferBalance: 200,
            waitTransferBalance: 10,
        }
    ],*/
    constructor: function (config) {
        var me = this;
        if (config) {
            if (config.partnerId) {
                var {partnerId} = config;
                me.proxy.url = adminPath + `api/${partnerId}/balance`
            }

            if (config.params) {
                me.proxy.extraParams = config.params;
            }
        }
        me.callParent(arguments);
    }
})