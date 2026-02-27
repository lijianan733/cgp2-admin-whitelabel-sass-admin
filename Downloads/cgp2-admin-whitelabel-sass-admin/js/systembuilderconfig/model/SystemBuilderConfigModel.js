// 语言设置的的 model
Ext.define('CGP.systembuilderconfig.model.SystemBuilderConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.product.config.v2.builder.SystemBuilderConfig'
    }, {
        name: 'builderUrl',
        type: 'string'
    }, {
        name: 'platform',
        type: 'string'
    }, {
        name: 'version',
        type: 'string'
    }, {
        name: 'userPreviewUrl',
        type: 'string'
    }, {
        name: 'manufacturePreviewUrl',
        type: 'string'
    }, {
        name: 'supportLanguage', // 目录
        type: 'array'
    }, {
        name: 'isSystemDefault', // 排序
        type: 'boolean'
    }, {//说明使用哪些版本的导航和builder配置
        name: 'schemaVersion',
        type: 'object'
    }],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/systembuilderconfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
