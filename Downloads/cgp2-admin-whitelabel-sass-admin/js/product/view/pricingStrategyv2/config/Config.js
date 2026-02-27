/**
 * Created by nan on 2021/12/7
 */

Ext.define("CGP.product.view.pricingStrategyv2.config.Config", {
    statics: {
        'com.qpp.cgp.domain.pricing.configuration.ProductPricingConfig': {
            url: adminPath + 'api/pricingconfigs',
            configType: 'sellPrice',
        },
        'com.qpp.cgp.domain.product.consting.ProductCostingConfig': {
            url: adminPath + 'api/productcontingconfigs',
            configType: 'costPrice',
        },

        'com.qpp.cgp.domain.partner.price.PartnerProductPricingConfig': {
            url: adminPath + 'api/partnerproductpricingconfigs',
            configType: 'sellPrice',
        },
        'com.qpp.cgp.domain.partner.consting.PartnerProductCostingConfig': {
            url: adminPath + 'api/partnercostingconfigs',
            configType: 'costPrice',
        },
        'com.qpp.cgp.domain.partner.PartnerProductConfig': {
            url: adminPath + 'api/partnerProductConfigs',
            configType: 'sellPrice',
        },
    }
})