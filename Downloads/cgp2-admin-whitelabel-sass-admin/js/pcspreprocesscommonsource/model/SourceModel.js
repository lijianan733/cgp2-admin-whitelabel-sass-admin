Ext.define('CGP.pcspreprocesscommonsource.model.SourceModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'clazz',
            type: 'string'
        }, {
            name: 'pathValueEx',
            type: 'object'
        }, {
            name: 'sourceType',
            type: 'string'
        }, {
            name: 'format',
            type: 'string',
            defaultValue: 'pdf',
        }, {
            name: 'dpi',
            type: 'int'
        }, {
            name: 'standard',
            type: 'string'
        }, {
            name: 'standardExpression',
            type: 'object'
        }, {
            name: 'palettes',
            type: 'array'
        }, {
            name: 'excludePalettes',
            type: 'array'
        }, {
            name: 'margin',
            type: 'object'
        },{
            name: 'parding',
            type: 'object'
        },{
            name: 'itemQty',
            type: 'int'
        }, {
            name: 'row',
            type: 'int'
        }, {
            name: 'column',
            type: 'int'
        }, {
            name: 'horizontalOrVertical',
            type: 'boolean'
        }, {
            name: 'max',
            type: 'int'
        }, {
            name: 'clazz',
            type: 'string',
        }
    ], proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcspreprocesscommonsource',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

})
