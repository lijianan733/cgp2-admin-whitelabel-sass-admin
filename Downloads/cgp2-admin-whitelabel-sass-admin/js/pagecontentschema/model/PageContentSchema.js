/**
 * pagecontentschema model
 */
Ext.define('CGP.pagecontentschema.model.PageContentSchema', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'code',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'width', //
        type: 'int'
    }, {
        name: 'height',
        type: 'int'
    }, {
        name: 'layers',
        type: 'array',
        defaultValue: undefined
    }, {
        name: 'clipPath',
        type: 'object',
        defaultValue: undefined
    }, {
        name: 'priceAreas',
        type: 'array',
        defaultValue: undefined
    }, {
        name: 'displayObjectConstraints',
        type: 'array',
        defaultValue: undefined
    }, {
        name: 'canvases',
        type: 'array',
        defaultValue: undefined
    }, {
        name: 'rtType',
        type: 'object',
        defaultValue: undefined
    },  {
        name: 'pageContentItemPlaceholders',
        type: 'array',
        defaultValue: undefined
    }, {
        name: 'templateId',
        type: 'string'
    },{
        name: 'pageContentSchemaGroup',
        type: 'object',
        defaultValue: undefined
    },  {
        name: 'clazz', //
        type: 'string',
        defaultValue: domainObj.PageContentSchema
    },{
        name: 'mainVariableDataSource', //
        type: 'object',
        defaultValue: domainObj.PageContentSchema
    },],
    /**
     * @cfg {Ext.data.Proxy} proxy
     * model proxy
     */
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pageContentSchemas',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

