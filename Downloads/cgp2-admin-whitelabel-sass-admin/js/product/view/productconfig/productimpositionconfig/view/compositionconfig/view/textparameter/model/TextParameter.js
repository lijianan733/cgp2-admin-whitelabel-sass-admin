/**
 * Created by miao on 2021/6/09.
 */

Ext.define("CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.model.TextParameter", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'number'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'valueTemplate',
            type: 'string'
        },
        {
            name: 'innerParameters',
            type: 'array'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'productConfigImpositionId',
            type: 'number'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/textParameters/',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
