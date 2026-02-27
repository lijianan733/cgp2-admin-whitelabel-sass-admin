Ext.define('CGP.orderdetails.model.PaymentMethod', {
    extend: 'Ext.data.Model',
    idProperty: 'code',
    fields: ['code', 'descripton', 'title', {
        name: 'sortOrder',
        type: 'int'
    }]

})