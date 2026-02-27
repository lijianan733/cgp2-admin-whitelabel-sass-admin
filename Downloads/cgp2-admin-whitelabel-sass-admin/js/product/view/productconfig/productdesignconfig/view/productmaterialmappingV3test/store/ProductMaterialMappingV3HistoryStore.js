/**
 * Created by nan on 2020/5/20.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.store.ProductMaterialMappingV3HistoryStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.model.ProductMaterialMappingV3HistoryModel',
    //    expanded: true,
    autoLoad: true,
    params : null,
    constructor : function(config){
        var me = this;
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    sorters : [{   //应用于当前Store的排序器集合
        property : 'operationTime',
        direction : 'DESC'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materialMappingTestRecords',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
});
