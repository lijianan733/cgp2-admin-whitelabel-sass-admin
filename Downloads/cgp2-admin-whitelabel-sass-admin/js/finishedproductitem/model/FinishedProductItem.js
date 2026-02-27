/**
 * currency model
 */
Ext.define('CGP.finishedproductitem.model.FinishedProductItem', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'material',
        type: 'object'
    }, {
        name: 'qty',
        type: 'int'
    }, {
        name: 'isOutsourcing',
        type: 'boolean'
    }, {
        name: 'isNeedPrint',
        type: 'boolean'
    }, {
        name: 'status',
        type: 'array'
    }, {
        name: 'currentItems',
        type: 'array'
    }, {
        name: 'manufactureOrderItem',
        type: 'object'
    }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/finishedProductItems',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
});