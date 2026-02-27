/**
 * currency store
 */
Ext.define("CGP.exchangerateconfig.store.ExchangeRateConfig", {
    extend: 'Ext.data.Store',
    requires: ["CGP.exchangerateconfig.model.ExchangeRateConfig"],
    model: "CGP.exchangerateconfig.model.ExchangeRateConfig",
    remoteSort: false,
    pageSize: 25,
    proxy:{
        type:'uxrest',
        url:adminPath + 'api/exchangeRateSets',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    /*proxy: {
        type: 'memory',
    },
    data: [
        {
            id: '13357',
            version: 2,
            status: 'TEST',
            createdDate: 1735205065464,
            description: '第二套',
            usedPlatforms: ['qpmn', 'qpson'],
            exchangeRates: [],
        },
        {
            id: '13358',
            version: 1,
            status: 'RELEASE',
            createdDate: 1735365586134,
            description: '第一套',
            usedPlatforms: ['qpmn', 'qpmn', 'qpmn', 'qpmn', 'qpmn', 'qpmn', 'qpmn', 'qpmn', 'qpmn', 'qpmn'],
            exchangeRates: [],
        }
    ],*/
    sorters: [{
        property: 'version',
        direction: 'DESC'
    }],
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
