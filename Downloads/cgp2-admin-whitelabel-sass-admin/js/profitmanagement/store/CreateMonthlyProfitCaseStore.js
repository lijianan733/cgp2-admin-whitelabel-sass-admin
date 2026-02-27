/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.define('CGP.profitmanagement.store.CreateMonthlyProfitCaseStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.profitmanagement.model.CreateMonthlyProfitCaseModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/{year}/{month}/balance',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
   /* proxy: {
        type: 'memory',
        data: []
    },
    data: [
        {
            id: 1235,
            partnerId: 111,
            partnerEmail: 'partnerEmail',
            amount: 321,
            finish: true,
            outTransferBalance: 20,
            inTransferBalance: 100,
            waitTransferBalance: 123
        },
        {
            id: 1234,
            partnerId: 1112,
            partnerEmail: 'partnerEmail',
            amount: 321,
            finish: false,
            outTransferBalance: 10,
            inTransferBalance: 200,
            waitTransferBalance: 123
        },
        {
            id: 12345,
            partnerId: 1112,
            partnerEmail: 'partnerEmail',
            amount: 321,
            finish: false,
            outTransferBalance: 10,
            inTransferBalance: 200,
            waitTransferBalance: 10
        }
    ],*/
    constructor: function (config) {
        var me = this;
        if (config) {
            if (config.year && config.month) {
                var {year, month} = config;
                me.proxy.url = adminPath + `api/${year}/${month}/balance`
            }

            if (config.params) {
                me.proxy.extraParams = config.params;
            }
        }

        me.callParent(arguments);
    }
})