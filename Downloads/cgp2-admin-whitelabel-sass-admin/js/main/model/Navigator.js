Ext.define('CGP.main.model.Navigator', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            convert: function (value, record) {
                return value || record.get('_id');
            }
        },
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'text',
            type: 'string',
            convert: function (value, record) {
                var me = this;
                return i18n.getKey(value);
            }
        },
        {
            name: 'leaf',
            type: 'boolean'
        },
        {
            name: 'url',
            type: 'string'
        },
        {
            name: 'block',
            type: 'string'
        }
    ]
})
