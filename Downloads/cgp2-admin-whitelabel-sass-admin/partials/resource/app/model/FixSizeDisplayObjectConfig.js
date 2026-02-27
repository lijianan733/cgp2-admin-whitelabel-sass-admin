Ext.define('CGP.resource.model.FixSizeDisplayObjectConfig', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'number',
            useNull: true
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
            name:'compositeDisplayObject',
            type:'object'
        },
        {
            name: 'width',
            type: 'number'
        },
        {
            name:'height',
            type:'number'
        },
        {
            name: 'items',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/fixSizeDisplayObjectConfig',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
