/**
 * Created by nan on 2018/6/12.
 */

Ext.define('CGP.partner.model.SalerConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'baseCurrency',
            type: 'int',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.partner.config.PartnerSalerConfig'
        },
        {
            name: 'customAddressLabel',
            type: 'string'
        },
        {
            name: 'defaultCurrency',
            type: 'int',
            useNull: true

        },
        {
            name: 'extraParam',
            type: 'string'
        },
        {
            name: 'partnerId',
            type: 'int'
        },
        {
            name: 'salerDeliveryAddress',
            type: 'object'
        },
        {
            name: 'shippingMethod',
            type: 'int',
            useNull: true
        }
    ],
    proxy: {
        type: 'uxrest',
        appendId: false,//是否自动在url后加id
        url: adminPath + 'api/partners/{partnerId}/salerConfig',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})

