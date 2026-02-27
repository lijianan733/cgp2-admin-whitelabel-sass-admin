/**
 * Created by nan on 2017/12/11.
 */
Ext.define('CGP.partner.view.ecommerceenableproductmanage.model.EnableProductModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'status',
            type: 'string'

        },
        {
            name: 'product',
            type: 'object'

        },
        {
            name: 'price',
            type: 'string'

        }
    ]
});
