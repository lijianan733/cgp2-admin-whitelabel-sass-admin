Ext.define("CGP.materialviewtype.model.PcsPlaceholder", {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'expression',
            type: 'string'
        },
        {
            name: 'attributes',
            type: 'array',
            serialize: function (value) {
                if (Ext.isEmpty(value)) {
                    return [];
                }
                return value;
            }
        },
        {
            name: 'selector',
            type: 'string'
        }]
});