/**
 * Created by nan on 2018/4/28.
 */
Ext.define('CGP.partner.view.suppliersupportableproduct.store.AddAbleSupportableProductStore', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'sku',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'model',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/producers/{producerId}/supportedProductConfigs/canBeAdd',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config.params) {
            me.proxy.extraParams = config.params;
        }
        me.proxy.url = adminPath + 'api/producers/' + config.partnerId + '/supportedProductConfigs/canBeAdd';
        me.callParent(arguments);
    }
})