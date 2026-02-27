/**
 * Created by nan on 2020/8/6.
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.model.ViewConfigV2DTOModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        }, {
            name: 'productConfigViewId',
            type: 'number'
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'builderViewConfigDomain',
            type: 'object'
        }, {
            name: 'editViewConfigs',
            type: 'array'
        }
    ]
});

