/**
 * Created by nan on 2021/9/2
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.model.PCPreSetModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
        },
        {
            name: 'clazz',
            type: 'string',
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'mvt',
            type: 'object'
        },
        {
            name: 'applyConfig',
            type: 'object'
        },
        {
            name: 'businessLib',
            type: 'object'
        },
        {
            name: 'indexConfig',
            type: 'object'
        }, {
            name: 'pcResourceApplyConfigs',
            type: 'array'
        }, {
            name: 'pcResourceApplyConfig',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcResourceContents',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

})