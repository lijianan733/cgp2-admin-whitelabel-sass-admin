/**
 * Created by nan on 2020/12/9
 */

Ext.define('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.model.PageContentModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'index',
            type: 'string'
        }, {
            name: 'code',
            type: 'string'
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'width',
            type: 'number'
        }, {
            name: 'height',
            type: 'number'
        }, {
            name: 'layers',
            type: 'array'
        }, {
            name: 'rtObject',
            type: 'object'
        }, {
            name: 'pageContentSchemaId',
            type: 'string'
        }, {
            name: 'clipPath',
            type: 'object'
        }, {
            name: 'templateId',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.bom.runtime.PageContent'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pageContents',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
