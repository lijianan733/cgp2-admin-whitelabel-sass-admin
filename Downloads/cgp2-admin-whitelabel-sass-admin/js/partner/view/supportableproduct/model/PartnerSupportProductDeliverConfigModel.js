/**
 * Created by nan on 2018/4/17.
 */
Ext.define('CGP.partner.view.supportableproduct.model.PartnerSupportProductDeliverConfigModel', {
    extend: 'Ext.data.Model',
    idProperty:'_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            defaultValue:undefined
        },
        {
            name: 'productId',
            type: 'int'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue:'com.qpp.cgp.domain.product.config.delivery.ProductDeliveryMethodConfig'
        },
        {
            name: 'partnerSupportedConfigId',
            type: 'string'
        },
        {
            name: 'deliveryMethodType',
            type: 'string'
        },
        {
            name: 'receiveAddressId',
            type: 'string'
        }
    ]
})
