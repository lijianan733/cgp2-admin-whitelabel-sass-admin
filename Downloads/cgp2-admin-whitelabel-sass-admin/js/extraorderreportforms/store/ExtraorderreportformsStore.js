/**
 * @author xiu
 * @date 2025/1/21
 */
Ext.define('CGP.extraorderreportforms.store.ExtraorderreportformsStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.extraorderreportforms.model.ExtraorderreportformsModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/{name}/orders',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
   /* proxy: {
        type: 'memory',
        data: []
    },
    data: [
        {
            id: 123,
            clazz: 'clazz',
            orderNumber: 'orderNumber',
            datePurchased: '2024-12-31T20:52:52.000+08:00',
            status: 'status',
            partnerName: 'partnerName',
            partnerId: 'partnerId',
            partnerEmail: 'partnerEmail',
            qty: 'qty',
            currency: 'currency',
            paymentMethod: 'paymentMethod',
            totalPrice: 'totalPrice',
            productPrice: 'productPrice',
            tax: 'tax',
            shippingPrice: 'shippingPrice',
            discountPrice: 'discountPrice',
            shippingMethod: 'shippingMethod',
            deliveryName: 'deliveryName',
            deliveryEmail: 'deliveryEmail',
            deliveryCountry: 'deliveryCountry',
            deliveryStreetAddress1: 'deliveryStreetAddress1',
            deliveryStreetAddress2: 'deliveryStreetAddress2',
            shippingNo: 'shippingNo',
            storeUrl: 'storeUrl',
            customerOrderNumber: 'customerOrderNumber',
        },
        {
            id: 1234,
            clazz: 'clazz',
            orderNumber: 'orderNumber',
            datePurchased: '2024-12-31T20:52:52.000+08:00',
            status: 'status',
            partnerName: 'partnerName',
            partnerId: 'partnerId',
            partnerEmail: 'partnerEmail',
            qty: 'qty',
            currency: 'currency',
            paymentMethod: 'paymentMethod',
            totalPrice: 'totalPrice',
            productPrice: 'productPrice',
            tax: 'tax',
            shippingPrice: 'shippingPrice',
            discountPrice: 'discountPrice',
            shippingMethod: 'shippingMethod',
            deliveryName: 'deliveryName',
            deliveryEmail: 'deliveryEmail',
            deliveryCountry: 'deliveryCountry',
            deliveryStreetAddress1: 'deliveryStreetAddress1',
            deliveryStreetAddress2: 'deliveryStreetAddress2',
            shippingNo: 'shippingNo',
            storeUrl: 'storeUrl',
            customerOrderNumber: 'customerOrderNumber',
        }
    ],*/
    sorters: [
        {
            property: 'datePurchased',
            direction: 'DESC'
        }
    ],
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            var {type} = config.params;
            me.proxy.url = adminPath + `api/${type}/orders`;
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})