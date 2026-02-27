/**
 * Created by nan on 2020/6/23.
 */
Ext.define("CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.store.JobConfigStore", {
    extend: 'Ext.data.Store',
    model: "CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.JobConfigModel",
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/jobConfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }

});
