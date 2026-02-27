/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.store.ConditionInput", {
    extend: 'Ext.data.Store',
    requires:["CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.model.ConditionInput"],
    model: "CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.model.ConditionInput",
    proxy : {
        type : 'memory'
    }
});