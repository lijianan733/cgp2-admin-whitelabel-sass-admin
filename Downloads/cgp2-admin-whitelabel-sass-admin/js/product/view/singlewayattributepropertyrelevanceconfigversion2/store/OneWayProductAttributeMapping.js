/**
 * Created by admin on 2019/11/7.
 */
Ext.define("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.store.OneWayProductAttributeMapping", {
    extend: 'Ext.data.Store',
    model: "CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.model.OneWayProductAttributeMapping",
    autoSync : true,
    proxy : {
        type : 'memory'
    },
    autoLoad:true
});
