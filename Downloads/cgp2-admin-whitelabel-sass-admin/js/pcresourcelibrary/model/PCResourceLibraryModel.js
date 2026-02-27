/**
 * Created by nan on 2021/9/1
 */
Ext.define("CGP.pcresourcelibrary.model.PCResourceLibraryModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'type',
        type: 'string'
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.pcresource.PCResourceLibrary'
    }, {
        name: 'displayInfo',
        type: 'string',
        convert: function (value, record) {
            return record.get('name') + '(' + record.getId() + ')';
        }
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pCResourceLibraries',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
