/**
 * Created by admin on 2019/11/21.
 */
Ext.define("CGP.product.view.bothwayattributemapping.store.ProductAttribute", {
    extend: 'Ext.data.Store',
    model: "CGP.product.view.bothwayattributemapping.model.Attribute",
    autoSync : true,
    proxy : {
        type : 'memory'
    }
});