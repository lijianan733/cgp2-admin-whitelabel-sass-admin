/**
 * Created by nan on 2021/1/13
 */

Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomLayoutPreprocessConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'designId',
            type: 'string'
        },
        {
            name: 'targetMaterialViewType',
            type: 'object'
        },
        {
            name: 'runWhenInit',
            type: 'boolean'
        }, {
            name: 'pageContentList',
            type: 'array'
        },
        {
            name: 'pcSourceContentSelector',
            type: 'string'
        },
        {
            name: 'pcTargetSelector',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pagecontentpreprocess',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
