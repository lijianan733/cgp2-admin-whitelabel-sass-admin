/**
 * Created by nan on 2019/1/15.
 */
Ext.define('CGP.product.view.bothwayattributemapping.store.TwoWayProductAttributeMapping', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.bothwayattributemapping.model.TwoWayProductAttributeMapping',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/twoWayProductAttributeMappings',
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
})