Ext.define("CGP.buildermanage.model.ConfigVersionModel",{
    extend : 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'publishVersion',
        type: 'int'
    }, 'status', 'description',{
        name: 'platform',
        type: 'string'
    },{
        name: 'builderUrl',
        type: 'string'
    },{
        name: 'userPreviewUrl',
        type: 'string'
    },{
        name: 'manufacturePreviewUrl',
        type: 'string'
    },{
        name: 'supportLanguage',
        type: 'array'
    },{
        name: 'clazz',
        type: 'string'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/systemBuilderPublishVersions',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});