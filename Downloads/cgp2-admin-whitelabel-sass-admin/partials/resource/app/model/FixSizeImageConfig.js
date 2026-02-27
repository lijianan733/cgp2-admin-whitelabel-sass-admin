Ext.define('CGP.resource.model.FixSizeImageConfig', {
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
            name: 'imageName',
            type: 'string'
        },
        {
            name:'dynamicSizeImage',
            type:'object'
        },
        {
            name: 'imageWidth',
            type: 'number'
        },
        {
            name:'imageHeight',
            type:'number'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/fixSizeImageConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
