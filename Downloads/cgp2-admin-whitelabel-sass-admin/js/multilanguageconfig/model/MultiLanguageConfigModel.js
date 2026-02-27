// 中英文多语言配置model
Ext.define('CGP.multilanguageconfig.model.MultiLanguageConfigModel', {
    extend: 'Ext.data.Model',
    //使用“id”和“_id”之间的区别
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    },
        {
            name: 'name',//多语言配置对应key
            type: 'string'
        },
        {
            name: "type",//配置类型
            type: "string"
        },
        {
            name: 'value',//多语言配置对应value
            type: 'string'
        },
        {
            name: 'cultureCode',//语言
            type: 'string'
        },
        {
            name: "active",
            type: 'boolean',
        },
        {
            name: "comment",//备注
            type: 'string'
        },{
            name: "language",
            type: 'object'
        }],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/resources',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});


