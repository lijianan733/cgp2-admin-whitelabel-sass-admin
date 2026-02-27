/**
 * Created by admin on 2020/8/21.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.model.ConditionInput', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'inputs',
            type: 'array'
        },
        {
            name: 'condition',
            type: 'object'
        },
        {
            name:'description',
            type:"string"
        }
    ]
})