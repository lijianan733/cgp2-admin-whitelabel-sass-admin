/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.define('CGP.cmsconfig.model.CmsConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.cms.ProductDetailCMSConfig',
        },
        {
            name: 'modifiedDate',
            type: 'number'
        },
        {
            name: 'cmsPageId',
            type: 'string'
        },
        {
            name: 'pageName',
            type: 'string'
        },
        {
            name: 'pageTitle',
            type: 'string'
        },
        {
            name: 'metaKeywords',
            type: 'string'
        },
        {
            name: 'metaDescription',
            type: 'string'
        },
        {
            name: 'metaRobots',
            type: 'string'
        },
        {
            name: 'metaCharset',
            type: 'string'
        },
        {
            name: 'metas',
            type: 'array'
        },
        {
            name: 'product',
            type: 'object'
        },
        {
            name: 'productListDTO',
            type: 'object'
        },
        {
            name: 'productImages',
            type: 'array'
        },
        {
            name: 'shortDesc',
            type: 'string'
        },
        {
            name: 'specifications',
            type: 'string'
        },
        {
            name: 'productDesc',
            type: 'string'
        },
        {
            name: 'properties',
            type: 'array'
        },
        {
            name: 'publishProfiles',
            type: 'array'
        },
        {//显示优先信息
            name: 'globalPriority',
            type: 'number'
        },
        {//产品在类目里显示的图片
            name: 'defaultImageInCatalog',
            type: 'object'
        },
        {//产品在类目里显示的图片
            name: 'hoverImageInCatalog',
            type: 'object'
        },
        {//产品在类目里显示的图片
            name: 'groups',
            type: 'array'
        },
        {
            name: 'category',
            type: 'object'
        },
        {
            name: 'filters',
            type: 'array'
        },
        //发布配置的状态
        {
            name: 'status',
            type: 'number'
        },
        //销售标签
        {
            name: 'saleTags',
            type: 'array'
        },
        //配置版本
        {
            name: 'configVersion',
            type: 'number',
            useNull: true
        },
        //产品profileCode数组
        {
            name: 'publishProfileCodes',
            type: 'array',
            useNull: true
        },
        //属性版本编号
        {
            name: 'versionedProductAttributeId',
            type: 'string',
            useNull: true
        },
        //产品描述信息项
        {
            name: 'specificationItems',
            type: 'array'
        },
        //关联产品
        {
            name:'relatedProductIds',
            type:'array'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/cms-configs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
