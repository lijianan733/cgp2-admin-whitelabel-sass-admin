
/**
 * Created by nan on 2021/1/13
 */

Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomContentPreprocessConfigModel', {
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
            name: 'designId',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            //预处理完成后填充的目标
            name: 'targetMaterialViewType',
            type: 'object'
        },
        {
            name: 'runWhenInit',
            type: 'boolean'
        }, {
            name: 'layout',
            type: 'object'
        },
        {
            name: 'background',
            type: 'object'
        },
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
