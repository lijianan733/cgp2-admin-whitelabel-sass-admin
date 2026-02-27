/**
 * Created by nan on 2019/11/7.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.model.SingleWayProductAttributeMappingModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'productId',
            type: 'string'
        }, {
            name: 'executeCondition',
            type: 'object'
        }, {
            name: 'mappingRules',
            type: 'array'
        }, {
            name: 'inSkuAttributeIds',
            type: 'array'
        }, {
            name: 'outSkuAttributeIds',
            type: 'array'
        }, {
            name: 'inputs',
            type: 'array'
        }, {
            name: 'outputs',
            type: 'array'
        }, {
            name: 'inSkuAttributes',
            type: 'array'
        },
        {
            name: 'attributeMappingDomain',
            type: 'object'
        },
        {
            name: 'attributePropertyPath',
            type: 'object'
        }, {
            name: 'depends',
            type: 'array'
        }, {
            name: 'mappingLinks',
            type: 'array'
        },
        {
            name:'inputGroups',
            type:'array'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/multiAttributeOneWayPropertyConfig',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
