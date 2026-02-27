Ext.define('CGP.test.pcCompare.model.PcDataModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'text',
            type: 'string'
        },
        {
            name: 'leaf',
            type: 'boolean'
        },
        {
            name: 'checked',
            type: 'boolean',
            defaultValue: true
        }
    ]
});