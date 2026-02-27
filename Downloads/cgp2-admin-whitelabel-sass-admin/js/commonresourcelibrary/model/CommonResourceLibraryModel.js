/**
 * Created by nan on 2020/4/27.
 */
Ext.define('CGP.commonresourcelibrary.model.CommonResourceLibraryModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
    }, {//资源类的clazz
        name: 'library',
        type: 'object'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'businessLib',
        type: 'object'
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.pcresource.BusinessLibraryOfCommon'
    }],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/businessLibraryOfCommons',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
