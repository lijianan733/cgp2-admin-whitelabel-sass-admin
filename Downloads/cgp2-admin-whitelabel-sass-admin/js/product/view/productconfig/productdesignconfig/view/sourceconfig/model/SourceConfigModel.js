/**
 * Created by nan on 2019/9/25.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.model.SourceConfigModel', {
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
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.preprocess.config.PageContentSourceConfig'
        },
        {
            name: 'isNeedInitPageContent',
            type: 'boolean',
        },
        {
            name: 'materialViewTypeId',
            type: 'string'
        },
        {
            name: 'mvtType',
            type: 'string'
        }, {
            name: 'productMaterialViewType',
            type: 'object'
        }, {
            name: 'simplifyMaterialViewType',
            type: 'object'
        }, {
            name: 'rtTypeId',
            type: 'string',
            convert: false
        }, {
            name: 'productMaterialViewTypeTemplateConfigId',
            type: 'string'
        }, {
            name: 'pageContents',
            type: 'array'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/sourceConfigController',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
