Ext.define('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.model.ProductMaterialViewCfgModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: "com.qpp.cgp.domain.bom.ProductMaterialViewType"
        }, {
            name: 'materialPath',
            type: 'string'
        }, {
            name: 'materialViewType',
            type: 'object'
        }, {
            name: 'productConfigDesignId',
            type: 'int'
        }, {
            name: 'productMaterialViewTypeId',
            type: 'string'
        }, {
            name: 'conditionExpression',
            type: 'string'
        },
        {
            name: 'userAssign',
            type: 'string',
            defaultValue: null
        },
        {
            name: 'materialSelector',
            type: 'object',
            defaultValue: undefined

        },
        {
            name: 'pageContentQty',
            type: 'object'
        }, {
            name: 'productMaterialViewTypeIds',
            type: 'object'
        }, {
            name: 'productMaterialViewTemplateConfigIds',
            type: 'array'
        },
        {
            name:'displayName',
            type:'string',
            convert: function (value, record) {
                return record.get('name') + '(' + record.getId() + ')';
            }
        }
        /*, {
            name: 'materialViewAttribute',
            type: 'object'
        }*/
    ]
})
