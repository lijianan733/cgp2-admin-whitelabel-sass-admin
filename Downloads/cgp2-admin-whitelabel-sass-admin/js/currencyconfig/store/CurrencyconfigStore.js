/**
 * @author xiu
 * @date 2024/12/31
 */
Ext.define('CGP.currencyconfig.store.CurrencyconfigStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.currencyconfig.model.CurrencyconfigModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/platformCurrencySettings',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'version',
        direction: 'DESC'
    }],
   /* proxy: {
        type: 'memory',
    },
    data: [
        {
            id: 133829,
            clazz: 'com.qpp.cgp.domain.common.color.RgbColor',
            version: 3,
            status: 2,
            effectiveTime: 1735622568216,
            createdDate: 1735622568216
        },
        {
            id: 133828,
            clazz: 'com.qpp.cgp.domain.common.color.RgbColor',
            version: 2,
            status: 3,
            effectiveTime: 1735622468216,
            createdDate: 1735622468216
        },
        {
            id: 133827,
            clazz: 'com.qpp.cgp.domain.common.color.RgbColor',
            version: 1,
            status: 1,
            effectiveTime: 1735622268216,
            createdDate: 1735622268216
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