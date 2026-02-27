/**
 * Created by admin on 2019/10/29.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.model.OneWaySimpleValueMaping',{
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name:'_id',
            type:'int'
        },
        {
            name:'productId',
            type:'int'
        },'clazz','description',
        {
            name: 'inputs',
            type: 'array'
        },
        {
            name: 'outputs',
            type: 'array'
        },{
            name: 'attributeMappingDomain',
            type: 'object'
        },{
            name: 'attributePropertyPath',
            type: 'object'
        }, {
            name: 'depends',
            type: 'array'
        }, {
            name: 'mappingLinks',
            type: 'array'
        }
    ],
    autoLoad: true,

    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/oneWayProductAttributeMappings',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
