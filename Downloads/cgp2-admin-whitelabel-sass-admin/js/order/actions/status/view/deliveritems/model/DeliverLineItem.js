Ext.define('Order.status.view.deliveritems.model.DeliverLineItem', {
    extend: 'Ext.data.Model',
    fields: [{
        name: '_id',
        type: 'string'
    }, {
        name: 'items',
        type: 'array'
    }, {
        name: 'outName',
        type: 'string'
    }, {
        name: 'cost',
        type: 'float'
    }, {
        name: 'address',
        type: 'object'
    },{
        name: 'date',
        type: 'date',
        dateWriteFormat: 'Uu',
        convert: function (value) {
            return new Date(value);
        }
    }]
});
