/**
 * Created by nan on 2017/12/14.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.store.MaterialViewType',{
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.model.ProductMaterialViewTypeVersionFiveModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productMaterialViewTypes',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor : function(config){
        var me = this;
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    autoLoad: true
});