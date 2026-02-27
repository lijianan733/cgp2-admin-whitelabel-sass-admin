/**
 * 角色model
 * {
 *     "_id": 256533143,
 *     "clazz": "com.qpp.cgp.domain.importservice.ImportService",
 *     "name": "USImportService",
 *     "code": "USIP",
 *     "calculateStrategy": "PERCENTAGE",
 *     "calculateValue": 30,
 *     "applicationMode": "Stage",
 *     "countryCode": "CN",
 *     "containShippingCalculate": true,
 *     "manufactureCenter": "PL0001",
 *     "shippingMethod": "中通"
 * }
 */
Ext.define('CGP.product_location.model.ProductLocationModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'int',
        useNull: true
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.manufacture.ProductLocation'
    }, {
        name: 'code',
        type: 'string',
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/product-locations',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});