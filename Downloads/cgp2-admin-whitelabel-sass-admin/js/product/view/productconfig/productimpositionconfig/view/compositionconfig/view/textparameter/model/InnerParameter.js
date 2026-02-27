/**
 * Created by miao on 2021/6/09.
 */

Ext.define("CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.model.InnerParameter", {
    extend: 'Ext.data.Model',
    // idProperty: '_id',
    fields: [
        // {
        //     name: '_id',
        //     type: 'number'
        // },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'value',
            type: 'object'
        },
        {
            name: 'valueType',
            type: 'string',
            convert: function (value, record) {
                if (value) {
                    return value;
                } else {
                    return record.raw.value.type;
                }
            }
        }
    ]
});
