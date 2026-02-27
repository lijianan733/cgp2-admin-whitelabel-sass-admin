/**
 * Created by nan on 2020/12/14
 */
Ext.define('CGP.pagecontent.model.PageContentModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
        },
        {
            name: 'index',
            type: 'string',
        }, {
            name: 'code',
            type: 'string',
        }, {
            name: 'name',
            type: 'string',
        }, {
            name: 'width',
            type: 'number',
        }, {
            name: 'height',
            type: 'string',
        }, {
            name: 'layers',
            type: 'array',
        }, {
            name: 'rtObject',
            type: 'object',
        }, {
            name: 'pageContentSchemaId',
            type: 'string',
        }, {
            name: 'clipPath',
            type: 'object',
        }, {
            name: 'templateId',
            type: 'string',
        },{
            name: 'generateMode',
            type: 'string',
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
});










