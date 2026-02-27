/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.define('CGP.profitmanagement.store.CreatePartnerProfitInfoStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.profitmanagement.model.CreatePartnerProfitInfoModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/{partnerId}/transaction',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: {
        property: 'timestamp',
        direction: 'DESC'
    },
   /* proxy: {
        type: 'memory',
        data: []
    },
    data: [
        {
            id: 233,
            type: 'OUT',
            amount: -123,
            balance: 999,
            operateDate: 1740564109527,
            operateCurrency: {
                code: 'US',
                symbolLeft: '$'
            },
            balanceCurrency: {
                code: 'US',
                symbolLeft: '$'
            },
            description: '2025-01-08 17:00:00,  拼单97xxxxxxx',
            remark: 'remark',
        },
        {
            id: 1233,
            type: 'IN',
            amount: 123,
            balance: 1999,
            operateDate: 1740564109527,
            operateCurrency: {
                code: 'US',
                symbolLeft: '$'
            },
            balanceCurrency: {
                code: 'US',
                symbolLeft: '$'
            },
            description: '2025-01-08 17:00:00,  拼单97xxxxxxx',
            remark: 'remark',
        }
    ],*/
    constructor: function (config) {
        var me = this;
        if (config) {
            if (config?.partnerId) {
                var {partnerId} = config;
                me.proxy.url = adminPath + `api/${partnerId}/transaction`
            }

            if (config?.params) {
                me.proxy.extraParams = config.params;
            }
        }
        me.callParent(arguments);
    }
})