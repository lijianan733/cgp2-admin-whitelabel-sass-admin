/**
 * Created by nan on 2020/4/27.
 */
Ext.define('CGP.businesstype.model.BusinessTypeModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
    }, {//资源类的clazz
        name: 'type',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.pcresource.BusinessLibrary'
    }, {
        name: 'description',
        type: 'string',
    }, {
        name: 'diyDisplay',
        type: 'string',
        convert: function (value, record) {
            return record.get('name') + '(' + record.get('_id') + ')';
        }
    }],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/businessLibrary',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
