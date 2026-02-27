/**
 * Created by nan on 2021/06/4.
 */
Ext.define('CGP.multilanguageconfig.model.LanguageCodeModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'number',
        useNull: true
    }, {
        name: 'code',
        type: 'object'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.common.LanguageCode'
    },{
        name:"codeValue",
        type: 'string',
        convert:function (value,record){
            return record.get('code').code;
        }
    }],
    proxy: {
        //当基于单个实例执行请求时，将自动附加Model实例的ID
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/languages',
        reader: {
            type: 'json',
            //设置返回信息的名称，为必填项
            root: 'data'
        }
    }
})
