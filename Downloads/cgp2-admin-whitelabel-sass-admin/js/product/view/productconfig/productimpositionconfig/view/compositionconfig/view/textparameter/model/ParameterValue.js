/**
 * Created by miao on 2021/6/09.
 */

Ext.define("CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.model.ParameterValue", {
    extend: 'Ext.data.Model',
    // idProperty: '_id',
    fields: [
        // {
        //     name: '_id',
        //     type: 'number'
        // },
        {
            name: 'value',
            type: 'object'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'condition',
            type: 'object'
        }
    ]
});
