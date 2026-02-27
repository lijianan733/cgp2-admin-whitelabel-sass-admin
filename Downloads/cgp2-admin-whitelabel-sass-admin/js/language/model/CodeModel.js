/**
 * Created by nan on 2020/4/27.
 */
Ext.define('CGP.language.model.CodeModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'code',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.common.LanguageCode'
    }],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/languageCodes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
