/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.store.InputGroup", {
    extend: 'Ext.data.Store',
    requires:["CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.model.InputGroup"],
    model: "CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.model.InputGroup",
    proxy : {
        type : 'memory'
    }
});