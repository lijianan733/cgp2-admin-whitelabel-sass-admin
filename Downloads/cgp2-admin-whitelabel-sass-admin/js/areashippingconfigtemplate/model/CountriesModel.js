/**
 * Created by shirley on 2021/8/31
 * 国家
 * */
Ext.define('CGP.shippingquotationtemplatemanage.model.CountriesModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'isoCode2',
        type: 'string'
    }, {
        name: 'isoCode3',
        type: 'string'
    }]
})