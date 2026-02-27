/**
 * Created by nan on 2019/8/21.
 */
Ext.define('CGP.order.view.cgpplaceorder..model.DiyOrderItemModel', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'thumbnail',
        type: 'string',
        useNull: true
    }, {
        name: 'qty',
        type: 'int'
    }, {
        name: 'price',
        type: 'int'
    }, {
        name: 'allPrice',
        type: 'int'
    }, {
        name: 'productInfo',
        type: 'object'
    }]
})
