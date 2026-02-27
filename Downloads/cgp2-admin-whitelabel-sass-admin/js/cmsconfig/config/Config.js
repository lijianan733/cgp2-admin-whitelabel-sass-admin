/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.define('CGP.cmsconfig.config.Config', {
    statics: {
        clazz: {
            ProductDetail: 'com.qpp.cgp.domain.cms.ProductDetailCMSConfig',
            ProductCategory: 'com.qpp.cgp.domain.cms.ProductsOfCatalogCMSConfig',
            NormalPage: 'com.qpp.cgp.domain.cms.NormalPageCMSConfig'
        },
        translate: {
            ProductDetail: i18n.getKey('productPublishConfig'),
            ProductCategory: i18n.getKey('categoryPublishConfig'),
            NormalPage: i18n.getKey('normalPagePublishConfig'),
        },
        cmsType: {
            ProductDetail: 'ProductDetail',
            ProductCategory: 'ProductCategory',
            NormalPage: 'Normal',
        }
    }
})