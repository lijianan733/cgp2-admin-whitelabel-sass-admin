Ext.define('CGP.resource.model.CompositeDisplayObject', {
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
            name:'isDynamicSize',
            type:'boolean'
        },
        {
            name: 'items',
            type: 'array'
        },
        {
            name: 'sourceContainerWidth',
            type: 'number'
        },
        {
            name:'sourceContainerHeight',
            type:'number'
        },
        {
            name:'dynamicSizeFillRules',
            type:'array'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/compositeDisplayObjects',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
