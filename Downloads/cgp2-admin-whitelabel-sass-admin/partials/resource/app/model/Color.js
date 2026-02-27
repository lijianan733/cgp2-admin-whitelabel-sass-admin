Ext.define('CGP.resource.model.Color', {
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
            name: 'r',
            type: 'number'
        },
        {
            name: 'g',
            type: 'number'
        },
        {
            name: 'b',
            type: 'number'
        },
        {
            name: 'c',
            type: 'number'
        },
        {
            name: 'm',
            type: 'number'
        },
        {
            name: 'y',
            type: 'number'
        },
        {
            name: 'k',
            type: 'number'
        },
        {
            name: 'gray',
            type: 'string'
        },
        {
            name: 'color',
            type: 'string',
            convert: function (value, record) {
                var controller = Ext.create('CGP.resource.controller.Color');
                var data = record.getData();
                return controller.getColor(data);
            }
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcResource/colors',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
