Ext.define("CGP.rtattribute.model.AttributesOptions", {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'string',
            useNull: true
        },
        {
            name: 'displayValue',
            type: 'string'
        }, {
            name: 'sortOrder',
            type: 'int',
            useNull: true
        },
        'name',
        "value"
    ]
});
