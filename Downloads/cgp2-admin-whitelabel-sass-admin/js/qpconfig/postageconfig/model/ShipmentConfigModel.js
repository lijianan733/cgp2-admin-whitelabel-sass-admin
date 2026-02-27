/**
 * @Description:
 * @author nan
 * @date 2023/9/18
 */
Ext.define("CGP.qpconfig.postageconfig.model.ShipmentConfigModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        '_id',
        'name',
        'description',
        'postageCountType',
        'code',
        {
            name: 'postageConfig',
            type: 'object'
        },
        {
            name: 'available',
            type: 'boolean'
        },
        {
            name: 'currencyCode',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.shipment.ShipmentConfig'
        }
    ],

    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/shipmentConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
