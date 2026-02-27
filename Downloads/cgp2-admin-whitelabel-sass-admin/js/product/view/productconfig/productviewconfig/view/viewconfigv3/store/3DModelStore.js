/**
 * Created by nan on 2021/3/8
 */

Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.store.3DModelStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.model.3DModelModel',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/threedmodelconfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})
