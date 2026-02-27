/**
 * @Description: 配置了cmsConfig的产品
 * @author nan
 * @date 2023/9/6
 */
Ext.define('CGP.cmsconfig.model.CmsProductModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'configSize',
            type: 'number'
        },
        {
            name: 'model',
            type: 'string'
        }, {
            name: 'name',
            type: 'string'
        },
        {
            name: 'type',
            type: 'string'
        },
         {
            name: 'medias',
            type: 'array'
        }, {
            name: 'mode',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/products/cmsConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})


