
/**
 * Created by nan on 2018/4/17.
 */
Ext.define('CGP.partner.view.supportableproduct.model.EnableAddressModel', {
    extend: 'Ext.data.Model',
    idProperty:'_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            defaultValue:undefined

        },
        {
            name: 'address',
            type: 'object'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue:'com.qpp.cgp.domain.product.config.delivery.ReceiveAddress'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'websiteId',
            type: 'int'
        }
    ]
})
