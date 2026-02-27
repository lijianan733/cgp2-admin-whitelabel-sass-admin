/**
 * Created by nan on 2021/7/14
 */

Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.model.TemplateGroupModel', {
    extend: 'Ext.data.Model',
    idProperty: 'groupId',
    fields: [
        {
            name: 'groupId',
            type: 'string'
        },
        {
            name: 'mvtId',
            type: 'string'
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        }, {
            name: 'materialPath',
            type: 'string'
        }, {
            name: 'productMaterialViewTypeTemplateConfigs',
            type: 'array'
        }
    ]
})