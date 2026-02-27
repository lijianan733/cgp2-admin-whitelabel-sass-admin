/**
 * Created by nan on 2021/9/2
 */
Ext.define("CGP.pcresourcelibrary.model.PCResourceItemModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string'
    }, {
        name: 'resource',
        type: 'object'
    }, {
        name: 'category',
        type: 'object'
    }, {
        name: 'tag',
        type: 'array',
    }, {
        name: 'languageFilter',
        type: 'array'
    }, {//描述信息
        name: 'displayDescription',
        type: 'object'
    }, {
        name: 'library',
        type: 'object'
    },{
        name:'clazz',
        type:'string',
        defaultValue:'com.qpp.cgp.domain.pcresource.PCResourceItem'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcresourceItems',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})