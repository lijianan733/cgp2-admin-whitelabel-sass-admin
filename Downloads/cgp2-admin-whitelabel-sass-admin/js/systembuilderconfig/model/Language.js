/**
 * Created by nan on 2020/11/7
 * 覆盖掉CGP.common.model.Language这个类，因为这个地方使用的id为number，其他地方使用string
 */
Ext.define('CGP.systembuilderconfig.model.Language', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'number',
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
