/**
 * Created by nan on 2020/11/5
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.model.BuilderConfigV2Model', {
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
        },
        {
            name: 'productConfigViewId',
            type: 'string'
        },
        {
            name: 'defaultUrl',
            type: 'object'
        },
        {
            name: 'builderViewResourceConfig',
            type: 'object'
        },
        {
            name: 'productBuilderConfigs',
            type: 'array'
        },
    ]

})