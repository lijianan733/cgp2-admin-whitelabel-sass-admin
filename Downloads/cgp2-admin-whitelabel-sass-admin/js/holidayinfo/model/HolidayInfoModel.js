Ext.define("CGP.holidayinfo.model.HolidayInfoModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string'
    }, {
        name: 'remark',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'holidayStrategy',
        type: 'object'
    }, {
        name: 'country',
        type: 'object'
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.preprocess.holiday.HolidayInfoConfig'
    }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/holidayinfoconfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
