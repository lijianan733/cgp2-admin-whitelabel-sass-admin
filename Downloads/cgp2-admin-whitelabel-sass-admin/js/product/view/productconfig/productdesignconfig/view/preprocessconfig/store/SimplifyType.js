/**
 * Created by nan on 2020/2/19.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.SimplifyType', {
    extend: 'Ext.data.Store',
    alias: 'widget.simplifytypestore',
    requires:['CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.SimplifyType'],
    model: 'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.SimplifyType',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/tileProductPageContentPreprocessConfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (!Ext.isEmpty(config) && !Ext.isEmpty(config.params)) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    autoLoad: true
});
