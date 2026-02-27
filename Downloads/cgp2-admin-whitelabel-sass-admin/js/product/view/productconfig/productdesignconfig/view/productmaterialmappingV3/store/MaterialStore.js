/**
 * Created by nan on 2020/4/1.
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.model.MaterialModel'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.store.MaterialStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.model.MaterialModel',
    requires: ['CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.model.MaterialModel'],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materials',
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
