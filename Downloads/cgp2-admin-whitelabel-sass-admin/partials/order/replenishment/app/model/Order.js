Ext.define('CGP.replenishment.model.Order', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        type: 'int'
    }, 'orderNo', {
        name: 'replenishments',
        type: 'array'
    }]
})