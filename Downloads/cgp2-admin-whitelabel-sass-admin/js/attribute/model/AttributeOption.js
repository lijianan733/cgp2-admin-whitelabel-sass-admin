Ext.define("CGP.attribute.model.AttributeOption", {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'sortOrder',
        type: 'int'
    }, 'name', 'imageUrl',
        {
            name: 'multilingualKey',
            type: 'string',
            convert: function (value, record) {
                return record.raw?.clazz;
            }

        }, {
            name: 'value',
            type: 'string'
        },
        {
            name: 'displayValue',
            type: 'string'
        },
    ]
});