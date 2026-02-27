/**
 * @author xiu
 * @date 2025/1/21
 */
Ext.define('CGP.extraorderreportforms.model.ExtraorderreportformsModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.common.color.RgbColor'
        },
        {
            type: 'string',
            name: 'orderNumber'
        },
        {
            type: 'string',
            name: 'couponCode'
        },
        {
            type: 'string',
            name: 'datePurchased',
        },
        {
            type: 'string',
            name: 'status',
        },
        {
            type: 'string',
            name: 'partnerName'
        },
        {
            type: 'string',
            name: 'partnerId'
        },
        {
            type: 'string',
            name: 'partnerEmail'
        },
        {
            type: 'string',
            name: 'qty',
        },
        {
            type: 'object',
            name: 'currency',
        },
        {
            type: 'string',
            name: 'currencyCode',
            convert: function (value, record) {
                var currency = record.get('currency');
                if (currency) {
                    var {title, code} = currency;
                    return `${title} (${code})`
                }

            }
        },
        {
            type: 'string',
            name: 'paymentMethod',
        },
        {
            type: 'string',
            name: 'totalPrice',
        },
        {
            type: 'string',
            name: 'productPrice',
        },
        {
            type: 'string',
            name: 'tax',
        },
        {
            type: 'string',
            name: 'shippingPrice',
        },
        {
            type: 'string',
            name: 'discountPrice',
        },
        {
            type: 'string',
            name: 'shippingMethod',
        },
        {
            type: 'string',
            name: 'deliveryName'
        },
        {
            type: 'string',
            name: 'deliveryEmail'
        },
        {
            type: 'string',
            name: 'deliveryCountry',
        },
        {
            type: 'string',
            name: 'deliveryStreetAddress1' //deliveryStreetAddress2
        },
        {
            type: 'string',
            name: 'deliveryStreetAddress2' //deliveryStreetAddress2
        },
        {
            type: 'string',
            name: 'deliveryStreetAddress',
            convert: function (value, record) {
                var deliveryStreetAddress1 = record.get('deliveryStreetAddress1'),
                    deliveryStreetAddress2 = record.get('deliveryStreetAddress2');
                return deliveryStreetAddress1 + `<br>` + deliveryStreetAddress2;
            }
        },
        {
            type: 'string',
            name: 'shippingNo',
        },
        {
            type: 'string',
            name: 'storeUrl'
        },
        {
            type: 'string',
            name: 'customerOrderNumber',
        },

    ],
})