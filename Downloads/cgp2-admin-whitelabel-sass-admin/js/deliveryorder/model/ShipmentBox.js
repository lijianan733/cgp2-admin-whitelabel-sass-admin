Ext.define('CGP.deliveryorder.model.ShipmentBox', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'productQty',
        type: 'int'
    }, {
        name: 'boxQty',
        type: 'int'
    }, {
        name: 'boxLength',
        type: 'float'
    }, {
        name: 'boxWidth',
        type: 'float'
    }, {
        name: 'boxHeight',
        type: 'float'
    }, {
        name: 'boxSizeUnit',
        type: 'String'
    }, {
        name: 'productWeight',
        type: 'float'
    }, {
        name: 'totalWeight',
        type: 'float'
    }, {
        name: 'packageType',
        type: 'string'
    }, /*{
        name: '_id',
        type: 'string'
    },*/ {
        name: 'id',
        type: 'number',
        useNull: true
    },{
        name: 'sortNo',
        type: 'int'
    }, {
        name: 'productItems',
        type: 'array'
    },{
        name:'clazz',
        type:'string',
        defaultValue:'com.qpp.cgp.domain.shipment.ShipmentBox'
    }]
})
