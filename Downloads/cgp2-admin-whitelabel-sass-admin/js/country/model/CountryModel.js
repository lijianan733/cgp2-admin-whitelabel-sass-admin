Ext.define('CGP.country.model.CountryModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        }, {
            name: 'isoCode2',
            type: 'string'
        }, {
            name: 'isoCode3',
            type: 'string'
        }, {
            name: 'multilingualKey',
            type: 'string',
            convert: function (value, record) {
                return record.raw?.clazz;
            }
        }, {
            name: 'needState',
            type: 'boolean',
            useNull: true,
        }],
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/countries',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});