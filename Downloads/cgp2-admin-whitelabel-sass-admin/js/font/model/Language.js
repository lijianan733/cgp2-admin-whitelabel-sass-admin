Ext.define('CGP.font.model.Language', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue:'com.qpp.cgp.domain.common.Language'
        }, {
            name: 'locale', //地区
            type: 'object'
        }, {
            name: 'code',
            type: 'object'
        }, {
            name: 'image',
            type: 'string'
        }, {
            name: 'directory', // 目录
            type: 'string'
        }, {
            name: 'sortOrder', // 排序
            type: 'string'
        }]
});
