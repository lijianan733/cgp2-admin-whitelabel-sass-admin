Ext.define('CGP.resource.model.DynamicSizeImage', {
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
            name: 'name',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'thumbnail',
            type: 'string'
        },
        {
            name: 'generateRule',
            type: 'object'
        },
        {
            name:'isDynamicSize',
            type:'boolean'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/dynamicSizeImages',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
