/**
 * Created by nan on 2021/11/10
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.propertysimplifyconfig.store.PropertySimplifyConfigStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.propertysimplifyconfig.model.PropertySimplifyConfigModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/propertySimplifyConfigs',
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
    }
});