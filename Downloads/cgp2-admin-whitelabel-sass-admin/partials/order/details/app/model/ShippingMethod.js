Ext.define('CGP.orderdetails.model.ShippingMethod', {
    extend: 'Ext.data.Model',
    idProperty: 'code',
    fields: ['code', 'title', 'descripton', {
        name: 'cost',
        type: 'float'
    }, {
        name: 'tax',
        type: 'float'
    }, {
        name: 'totalExTax',
        type: 'float'
    }, {
        name: 'totalIncTax',
        type: 'float'
    }]

})