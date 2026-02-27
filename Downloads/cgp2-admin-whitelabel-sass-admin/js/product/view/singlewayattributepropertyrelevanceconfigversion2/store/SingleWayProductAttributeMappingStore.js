/**
 * Created by nan on 2019/11/7.
 */


Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.store.SingleWayProductAttributeMappingStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.model.SingleWayProductAttributeMappingModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/oneWayProductAttributeMappings',
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
