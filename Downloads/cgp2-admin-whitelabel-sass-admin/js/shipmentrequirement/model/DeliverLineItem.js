Ext.define('CGP.shipmentrequirement.model.DeliverLineItem', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'items',
            type: 'array'
        },
        {
            name: 'outName',
            type: 'string'
        },
        {
            name: 'cost',
            type: 'float'
        },
        {
            name: 'address',
            type: 'object'
        },
        {
            name: 'date',
            type: 'date',
            dateWriteFormat: 'Uu',
            convert: function (value) {
                return new Date(value);
            }
        },
        {
            name: 'shipmentMethod',
            type: 'string'
        },
        {
            name: 'orderDeliveryMethod',
            type: 'string'
        },
        {
            name: 'isLock',
            type: 'boolean'
        },
        {
            name: 'shipRemark',
            type: 'string'
        },
        {
            name: 'customsClearanceRemark',
            type: 'string'
        },
        {
            name: 'dutyType',
            type: 'string'
        },
        {
            name: 'manufactureCenters',
            type: 'array'
        },
        {
            name: 'finalManufactureCenter',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/shipmentRequirements',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
