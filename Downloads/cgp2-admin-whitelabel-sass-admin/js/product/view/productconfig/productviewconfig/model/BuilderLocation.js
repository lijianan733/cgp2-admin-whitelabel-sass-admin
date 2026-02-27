Ext.define('CGP.product.view.productconfig.productviewconfig.model.BuilderLocation', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'title',
            type: 'string'
        }, {
            name: 'sortOrder',
            type: 'int'
        }, {
            name: 'manufacturePreviewUrl',
            type: 'string'
        }, {
            name: 'userPreviewUrl',
            type: 'string'
        }, {
            name: 'builderUrl',
            type: 'string'
        }, {
            name: 'locale',
            type: 'string'
        }, {
            name: 'language',
            type: 'object'
        },
        {
            name: 'clazz',
            type: 'string'
        }, {
            name: 'builderPublishStatus',
            type: 'string',
            defaultValue: undefined
        }, {
            name: 'fonts',
            type: 'array'
        }, {
            name: 'defaultFont',
            type: 'string',
            convert: function (value) {
                if (Ext.isObject(value)) {
                    return value._id;
                } else {
                    return value;
                }
            }
        }
    ]
});
