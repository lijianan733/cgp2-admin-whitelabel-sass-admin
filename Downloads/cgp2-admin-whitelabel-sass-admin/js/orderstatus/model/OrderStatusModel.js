/**
 *
 */

Ext.define('CGP.orderstatus.model.OrderStatusModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.order.OrderStatus'
    }, {
        name: 'frontendName',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'fontSort',
        type: 'number'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/whitelabelOrderStatuses',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});