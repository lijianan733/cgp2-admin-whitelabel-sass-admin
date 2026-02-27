// 语言设置的的 model
Ext.define('CGP.language.model.LanguageModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'clazz',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'locale', //地区
        type: 'object',
        useNull: true,
        defaultValue: null
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
    }, {
        name: 'displayField',
        type: 'string',
        convert: function (value, record) {
            var data = record.getData();
            var result = '';
            if (data.code) {
                result += data.code.code;
            }
            if (data.locale) {
                result += '-' + data.locale.code;
            }
            return result;
        }
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
