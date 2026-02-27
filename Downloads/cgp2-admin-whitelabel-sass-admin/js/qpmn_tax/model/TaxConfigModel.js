/**
 * 角色model
 *       "_id": 47120130,
 *                 "clazz": "com.qpp.cgp.domain.tax.vat.VatTax",
 *                 "name": "vatTax",
 *                 "code": "DE",
 *                 "taxRate": 19.0,
 *                 "countryCode": "DE",
 *                 "containShippingTax": true
 */
Ext.define('CGP.qpmn_tax.model.TaxConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'int',
        useNull: true
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.tax.vat.VatTax'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'code',
        type: 'string'
    }, {
        name: 'taxRate',
        type: 'string'
    }, {
        name: 'countryCode',
        type: 'string'
    }, {
        name: 'containShippingTax',
        type: 'boolean'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/vatTaxs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});