/**
 * Created by admin on 2019/10/29.
 */
Ext.define("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.store.AttributePropertyValue", {
    extend: 'Ext.data.Store',
    model: "CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.model.AttributePropertyValue",
    autoSync : true,
    proxy : {
        type : 'memory'
    }
});
