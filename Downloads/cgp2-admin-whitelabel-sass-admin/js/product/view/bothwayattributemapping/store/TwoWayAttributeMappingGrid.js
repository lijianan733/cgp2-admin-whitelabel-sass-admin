/**
 * Created by admin on 2019/11/23.
 */
Ext.define("CGP.product.view.bothwayattributemapping.store.TwoWayAttributeMappingGrid", {
    extend: 'Ext.data.Store',
    model: "CGP.product.view.bothwayattributemapping.model.TwoWayAttributeMappingGrid",
    autoSync : true,
    proxy : {
        type : 'memory'
    },
    autoLoad:true
});