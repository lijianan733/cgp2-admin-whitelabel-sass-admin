/**
 * Created by nan on 2018/3/12.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.store.ProductMaterialViewTypeVersionFiveStore',{
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
    params : null,
    constructor : function(config){
        var me = this;
        if(!Ext.isEmpty(config) && !Ext.isEmpty(config.params)){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    autoLoad: true
});
