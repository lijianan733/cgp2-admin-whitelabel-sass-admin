Ext.define('CGP.rtoption.model.RtOption', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'number',
            useNull: true
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'value',
            type: 'string'
        },
        {
            name: 'displayValue',
            type: 'string'
        },
        {
            name: 'sortOrder',
            type: 'number'
        },
        {
            name: 'tag',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/rtoptions',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
