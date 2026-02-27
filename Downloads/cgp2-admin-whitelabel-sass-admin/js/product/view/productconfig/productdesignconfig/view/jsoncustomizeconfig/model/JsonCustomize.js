/**
 * Created by nan on 2017/12/12.
 */
/**
 * Created by nan on 2017/12/12.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.jsoncustomizeconfig.model.JsonCustomize', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull:true
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name:'productConfigDesignId',
            type:'number'
        },
        {
            name: 'productMaterialViewTypeId',
            type: 'string'
        },
        {
            name: 'designDataTypeSchema',
            type: 'object'
        },
        {
            name: 'designDataJsonSchema',
            type: 'string'
        },
        {
            name: 'operatorConfigId',
            type: 'string'
        },
        {
            name: 'productMaterialViewType',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/jsonCustomizeConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
