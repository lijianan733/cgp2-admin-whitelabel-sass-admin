Ext.define('CGP.common.model.Language', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'string',
        useNull: true
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'locale', //地区
        type: 'store'
    }, {
        name: 'code',
        type: 'store'
    }, {
        name: 'image',
        type: 'string'
    }, {
        name: 'directory', // 目录
        type: 'string'
    }, {
        name: 'sortOrder', // 排序
        type: 'string'
    }],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/languages',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
