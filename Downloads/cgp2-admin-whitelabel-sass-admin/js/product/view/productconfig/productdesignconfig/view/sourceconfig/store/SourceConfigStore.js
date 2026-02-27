/**
 * Created by nan on 2019/9/25.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.SourceConfigStore', {
    extend: 'Ext.data.Store',
    alias: 'widget.sourceconfigstore',
    require: ['CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.model.SourceConfigModel'],
    model: 'CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.model.SourceConfigModel',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/sourceConfigController',
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
});
