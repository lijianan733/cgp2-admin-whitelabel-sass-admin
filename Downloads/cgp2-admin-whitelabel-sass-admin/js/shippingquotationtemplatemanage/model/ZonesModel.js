/**
 * Created by shirley on 2021/9/4
 * */
Ext.define('CGP.shippingquotationtemplatemanage.model.ZonesModel', {
    extend: 'Ext.data.Model',
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
        name: 'codeName',
        type: 'string',
        convert: function (v, record) {
            return record.data.code + '(' + record.data.name + ')';
        }
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.common.Zone'
    }]
})