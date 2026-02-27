/**
 * Created by nan on 2021/9/6
 */
Ext.define("CGP.pcresourcelibrary.model.PCResourceCategoryModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'type',
        type: 'string'
    }, {
        name: 'displayName',
        type: 'string',
        defaultValue: path + 'ClientLibs/extjs/resources/themes/images/ux/category.png'
    }, {
        name: 'parent',
        type: 'object',
        useNull: true,
    }, {
        name: 'icon',
        type: 'string',
        defaultValue: path + 'ClientLibs/extjs/resources/themes/images/ux/category.png'
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.pcresource.PCResourceItem'
    },{
        name: 'display',
        type: 'string',
        convert: function (value, record) {
            return record.get('name') + '(' + record.get('_id') + ')';
        }
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pCResourceCategories',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})