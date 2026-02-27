/**
 * Created by nan on 2020/7/1.
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.store.GenerateJobConfigStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.GenerateJobConfigModel'],
    model: "CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.GenerateJobConfigModel",
    remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: cgp2ComposingPath + 'api/jobGenerateConfigsV2',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    autoLoad: true
})
