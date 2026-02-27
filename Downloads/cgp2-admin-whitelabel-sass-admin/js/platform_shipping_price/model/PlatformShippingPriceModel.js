/**
 * {
 *     "_id": 54452407,
 *     "clazz": "com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig",
 *     "platform": "PS",
 *     "applicationMode": "Stage",
 *     "discount": 60,
 *     "percentage": true
 * }
 */
Ext.define('CGP.platform_shipping_price.model.PlatformShippingPriceModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'int',
        useNull: true
    }, {
        name: 'clazz',
        type: 'string',
    }, {
        name: 'applicationMode',
        type: 'string'
    }, {
        name: 'platform',
        type: 'string'
    }, {
        name: 'storePlatformCode',
        type: 'string'
    }, {
        name: 'discount',
        type: 'string'
    }, {
        name: 'percentage',
        type: 'boolean'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/platformShippingPriceConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});