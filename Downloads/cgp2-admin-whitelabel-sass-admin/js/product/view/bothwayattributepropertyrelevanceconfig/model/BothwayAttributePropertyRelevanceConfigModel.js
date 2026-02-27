/**
 * Created by nan on 2019/1/15.
 */
Ext.define('CGP.product.view.bothwayattributepropertyrelevanceconfig.model.BothwayAttributePropertyRelevanceConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int'
        },
        {
            name: 'skuAttributes',
            type: 'array'
        },
        {
            name: 'productId',
            type: 'int'
        },
        {
            name: 'items',
            type: 'array'
        },{
            name: 'attributeMappingDomain',
            type: 'object'
        },
        {
            name: 'name',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/multiAttributeTwoWayPropertyConfig',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})