/**
 * Created by nan on 2019/1/15.
 */
Ext.define('CGP.product.view.bothwayattributemapping.model.TwoWayProductAttributeMapping', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int'
        },
        {
            name: 'productId',
            type: 'int'
        },
        {
            name: 'rightSkuAttributeIds',
            type: 'array',
            defaultValue:[]
        },
        {
            name: 'rightAttributes',
            type: 'array',
            defaultValue:[]
        },
        {
            name: 'leftSkuAttributeIds',
            type: 'array',
            defaultValue:[]
        },
        {
            name: 'leftAttributes',
            type: 'array',
            defaultValue:[]
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name:'executeCondition',
            type:'object',
            defaultValue:{
                executeProfileItemIds:[],
                executeAttributeInput:{}
            }
        },{
            name: 'attributeMappingDomain',
            type: 'object'
        },
        {
            name: 'mappingGrids',
            type: 'array',
            defaultValue:[{}]
        },
        {
            name:'mappingLinks',
            type: 'array'
        },
        {
            name:'depends',
            type: 'array'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/twoWayProductAttributeMappings',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})