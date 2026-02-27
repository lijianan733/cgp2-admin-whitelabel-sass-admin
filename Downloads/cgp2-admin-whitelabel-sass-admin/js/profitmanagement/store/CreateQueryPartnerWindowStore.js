/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.define('CGP.profitmanagement.store.CreateQueryPartnerWindowStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.profitmanagement.model.CreateQueryPartnerWindowModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'createdDate',
        direction: 'DESC'
    }],
   /* proxy: {
        type: 'memory',
        data: []
    },
    data: [
        {
            id: 233,
            partnerId: 1244555,
            partnerEmail: '2650821587@qpp.com',
            name: '张三',
        },
        {
            id: 1233,
            partnerId: 12445545,
            partnerEmail: '18824411438@qpp.com',
            name: '李四',
        }
    ],*/
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})