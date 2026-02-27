/**
 * Created by nan on 2019/7/10.
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.navigationV3.model.SimplifyBomNodeModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'parent',
            type: 'string'
        },
        {
            name: 'sbomPath',
            type: 'string'
        },
        {
            name: 'rtType',
            type: 'object'
        },
        {
            name: 'rtObject',
            type: 'object'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'mateiralViews',
            type: 'array'
        },
        {
            name: 'isEnable',
            type: 'boolean'
        },
        {
            name: 'defaultNode',
            type: 'boolean'
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: "com.qpp.cgp.domain.simplifyBom.SBNode"

        },
        {
            name: 'materialPath',
            type: 'string'
        },{
            name: 'isContainSimplifyMaterialViewType',
            type: 'boolean'
        }
    ]
})
