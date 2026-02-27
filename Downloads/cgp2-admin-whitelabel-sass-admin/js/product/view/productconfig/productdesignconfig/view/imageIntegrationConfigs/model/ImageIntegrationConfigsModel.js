/**
 * Created by nan on 2017/12/12.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.model.ImageIntegrationConfigsModel', {
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
            type: 'string',
            defaultValue:'com.qpp.cgp.dto.product.ImageIntegrationConfigDTO'
        },{
            name: 'dpi',
            type: 'int'
        },
        {
            name: 'idReference',
            type: 'string'
        },
        {
            name: 'imagePageContentPaths',
            type: 'array'
        },
        {
            name: 'minHeight',
            type: 'int'
        },
        {
            name: 'minWidth',
            type: 'int'
        },
        {
            name: 'productConfigDesignId',
            type: 'int'
        },
        {
            name: 'productMaterialViewTypeId',
            type: 'string'
        },
        {
            name: 'ratioOffset',
            type: 'float'
        },
        {
            name: 'side',
            type: 'string'
        },
        {
            name: 'materialPath',
            type: 'string'
        },
        {
            name: 'pageContentEffectConfigs',
            type: 'array'
        },
        {
            name: 'productMaterialViewType',
            type: 'object'
        },
        {
            name: 'rawRowNumber',
            type: 'number'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/imageIntegrationConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
