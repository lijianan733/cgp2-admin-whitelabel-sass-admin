Ext.define('CGP.resource.model.Rule', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'number',
            useNull: true
        },
        {
            name: 'range',
            type: 'object'
        },
        {
            name: 'rule',
            type: 'object'
        },
        {
            name: 'description',
            type: 'string'
        }
    ]
});
