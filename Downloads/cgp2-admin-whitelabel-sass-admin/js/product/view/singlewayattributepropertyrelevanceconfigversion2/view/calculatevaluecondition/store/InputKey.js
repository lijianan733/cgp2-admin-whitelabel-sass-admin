/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.store.InputKey", {
    extend: 'Ext.data.Store',
    requires:["CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.model.InputKey"],
    model: "CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.model.InputKey",
    proxy : {
        type : 'memory'
    }
});