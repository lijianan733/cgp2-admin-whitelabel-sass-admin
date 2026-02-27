/**
 * Created by nan on 2020/4/3.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.store.MaterialMappingDTOConfigStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.model.MaterialMappingDTOConfigModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materialMappingDTOConfigs',
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
})

