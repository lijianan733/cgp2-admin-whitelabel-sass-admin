// 语言设置的的 model
Ext.define('CGP.buildercommonresource.model.CommonResourceModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'fonts',
        type: 'array'
    }, {
        name: 'fontFilters',
        type: 'string'
    }, {
        name: 'fontColors',
        type: 'array'
    }, {
        name: 'backgroundColors',
        type: 'array'
    }, {
        name: 'version',
        type: 'string'
    }],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/commonbuilderresourceconfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
