/**
 * Created by miao on 2021/6/09.
 */
Ext.define("CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.store.ParameterValue", {
    extend: 'Ext.data.Store',
    model: "CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.model.ParameterValue",
    autoSync : true,
    pageSize:10,
    proxy : {
        type : 'pagingmemory'
    }

});
