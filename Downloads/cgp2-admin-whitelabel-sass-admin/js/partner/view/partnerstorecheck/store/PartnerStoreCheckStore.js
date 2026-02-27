/**
 * @author xiu
 * @date 2025/5/15
 */
Ext.define('CGP.partner.view.partnerstorecheck.store.PartnerStoreCheckStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.partner.view.partnerstorecheck.model.PartnerStoreCheckModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partner/stores/v2',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [
        {
            property: 'createdDate',
            direction: 'DESC'
        }
    ],
    /* proxy: {
         type: 'pagingmemory',
         data: []
     },
     data: [
         {
             store: {
                 "_id": "263464600",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "createdDate": 1747988646259,
                 "createdBy": "40881767",
                 "modifiedDate": 1748918304623,
                 "modifiedBy": "40881767",
                 "name": "test-store",
                 "url": "https://test-stage-qpmarkets.qppdev.com/tststore523e",
                 "platform": {
                     "_id": "21858392",
                     "clazz": "com.qpp.cgp.domain.partner.store.StorePlatform",
                     "createdDate": 1636945929469,
                     "createdBy": "string",
                     "modifiedDate": 1709970299078,
                     "modifiedBy": "40488402",
                     "name": "WooCommerce",
                     "icon": "a38b15d5c8119e762bb95842d1323ee7.svg",
                     "code": "WooCommerce"
                 },
                 "shopOwner": {
                     "_id": "41136571",
                     "idReference": "ShopOwner",
                     "clazz": "com.qpp.cgp.domain.partner.store.ShopOwner",
                     "modifiedDate": 1748918304623
                 },
                 "status": "active",
                 "authInfoToExternal": true,
                 "authSuccessToExternal": true,
                 "createWebhook": true,
                 "metaData": {
                     "currentStep": 2,
                     "steps": [
                         {},
                         {
                             "storeNameDraft": "test-store",
                             "storeUrlDraft": "https://test-stage-qpmarkets.qppdev.com/tststore523e"
                         },
                         {}
                     ],
                     "flow": "existShop"
                 },
                 "mode": "Stage",
                 "needToUpgradePlugins": false,
                 "currencyExceptionInfoList": [],
                 "storeProductUpgradeStatus": "WAITING",
                 "billAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
                 "deliveryAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
             },
            
             "partner": {
                 "_id": "41136571",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "name": 'zhangjing',
                 "code": 'zhangjing',
             },
         },
         {
             store: {
                 "_id": "263209234",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "createdDate": 1747632800675,
                 "createdBy": "40881767",
                 "modifiedDate": 1748918303726,
                 "modifiedBy": "40881767",
                 "name": "test8-popup",
                 "url": "https://test8-popup.qppdev.com",
                 "platform": {
                     "_id": "245100845",
                     "clazz": "com.qpp.cgp.domain.partner.store.StorePlatform",
                     "createdDate": 1636945929469,
                     "createdBy": "string",
                     "modifiedDate": 1748574458533,
                     "modifiedBy": "40881767",
                     "name": "PopUp",
                     "icon": "e6e9bfd3ff443abe64903b0cccf78726.svg",
                     "code": "PopUp"
                 },
                 "shopOwner": {
                     "_id": "41136571",
                     "idReference": "ShopOwner",
                     "clazz": "com.qpp.cgp.domain.partner.store.ShopOwner",
                     "modifiedDate": 1748918303726
                 },
                 "status": "active",
                 "authInfoToExternal": true,
                 "authSuccessToExternal": true,
                 "createWebhook": true,
                 "currencyCode": "HKD",
                 "mode": "Stage",
                 "needToUpgradePlugins": false,
                 "currencyExceptionInfoList": [],
                 "storeProductUpgradeStatus": "WAITING",
                 "billAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
                 "deliveryAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
             },
 
             "partner": {
                 "_id": "41136571",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "name": 'zhangjing',
                 "code": 'zhangjing',
             },
         },
         {
             store: {
                 "_id": "251878008",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "createdDate": 1743153984354,
                 "createdBy": "40881767",
                 "modifiedDate": 1748918312103,
                 "modifiedBy": "40881767",
                 "name": "levi-23.myshopify.com",
                 "url": "https://levi-23.myshopify.com",
                 "platform": {
                     "_id": "21861624",
                     "clazz": "com.qpp.cgp.domain.partner.store.StorePlatform",
                     "createdDate": 1636945929469,
                     "createdBy": "string",
                     "modifiedDate": 1709969909022,
                     "modifiedBy": "40488402",
                     "name": "Shopify",
                     "icon": "8c6d2e785339a2a41d827a1873cbf02b.svg",
                     "code": "Shopify"
                 },
                 "shopOwner": {
                     "_id": "41136571",
                     "idReference": "ShopOwner",
                     "clazz": "com.qpp.cgp.domain.partner.store.ShopOwner",
                     "modifiedDate": 1748918312103
                 },
                 "status": "active",
                 "authInfoToExternal": true,
                 "authSuccessToExternal": true,
                 "createWebhook": false,
                 "currency": {
                     "id": 969634,
                     "modifiedDate": 1748918312103
                 },
                 "currencyCode": "HKD",
                 "mode": "Stage",
                 "needToUpgradePlugins": false,
                 "shopifyShippingSyncInfo": {
                     "syncStatus": "SYNCHRONIZED"
                 },
                 "currencyExceptionInfoList": [],
                 "storeProductUpgradeStatus": "WAITING",
                 "billAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
                 "deliveryAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
             },
             "partner": {
                 "_id": "41136571",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "name": 'zhangjing',
                 "code": 'zhangjing',
             },
            
         },
         {
             store: {
                 "_id": "251438814",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "createdDate": 1742181225022,
                 "createdBy": "40881767",
                 "modifiedDate": 1748920534011,
                 "modifiedBy": "40881767",
                 "name": "test-1024-10-23",
                 "platform": {
                     "_id": "228179642",
                     "clazz": "com.qpp.cgp.domain.partner.store.StorePlatform",
                     "createdDate": 1730260276404,
                     "createdBy": "808186",
                     "modifiedDate": 1730260276404,
                     "modifiedBy": "808186",
                     "name": "ManualStorePlatform",
                     "icon": "6fa937859bf8adb91b9094e82879607b.svg",
                     "code": "ManualStore"
                 },
                 "shopOwner": {
                     "_id": "41136571",
                     "idReference": "ShopOwner",
                     "clazz": "com.qpp.cgp.domain.partner.store.ShopOwner",
                     "modifiedDate": 1748920534011
                 },
                 "status": "active",
                 "authInfoToExternal": false,
                 "authSuccessToExternal": true,
                 "createWebhook": false,
                 "currencyCode": "CHF",
                 "mode": "Stage",
                 "needToUpgradePlugins": false,
                 "currencyExceptionInfoList": [],
                 "storeProductUpgradeStatus": "WAITING",
                 "billAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
                 "deliveryAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
             },
             "partner": {
                 "_id": "41136571",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "name": 'zhangjing',
                 "code": 'zhangjing',
             },
             
         },
         {
             store: {
                 "_id": "245216061",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "createdDate": 1741573130929,
                 "createdBy": "40881767",
                 "modifiedDate": 1748920534568,
                 "modifiedBy": "40881767",
                 "name": "9340",
                 "url": "https://www.etsy.com/shop/9340",
                 "platform": {
                     "_id": "244940112",
                     "clazz": "com.qpp.cgp.domain.partner.store.StorePlatform",
                     "createdDate": 1636945929469,
                     "createdBy": "string",
                     "modifiedDate": 1709961816328,
                     "modifiedBy": "39552169",
                     "name": "Etsy",
                     "icon": "9794075a5cc9e233063eac1e1430a6fc.svg",
                     "code": "Etsy"
                 },
                 "shopOwner": {
                     "_id": "41136571",
                     "idReference": "ShopOwner",
                     "clazz": "com.qpp.cgp.domain.partner.store.ShopOwner",
                     "modifiedDate": 1748920534568
                 },
                 "status": "active",
                 "authInfoToExternal": true,
                 "authSuccessToExternal": true,
                 "createWebhook": false,
                 "currency": {
                     "id": 969634,
                     "clazz": "com.qpp.cgp.domain.common.Currency",
                     "modifiedDate": 1748920534568
                 },
                 "currencyCode": "HKD",
                 "mode": "Stage",
                 "needToUpgradePlugins": false,
                 "currencyExceptionInfoList": [
                     {
                         "code": 3000607,
                         "message": "The store currency is different from the price currency"
                     }
                 ],
                 "storeProductUpgradeStatus": "WAITING",
                 "billAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
                 "deliveryAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
             },
             "partner": {
                 "_id": "41136571",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "name": 'zhangjing',
                 "code": 'zhangjing',
             },
             
         },
         {
             store: {
                 "_id": "245216060",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "createdDate": 1741573130929,
                 "createdBy": "40881767",
                 "modifiedDate": 1748920534568,
                 "modifiedBy": "40881767",
                 "name": "9340",
                 "url": "https://www.etsy.com/shop/9340",
                 "platform": {
                     "_id": "244940112",
                     "clazz": "com.qpp.cgp.domain.partner.store.StorePlatform",
                     "createdDate": 1636945929469,
                     "createdBy": "string",
                     "modifiedDate": 1709961816328,
                     "modifiedBy": "39552169",
                     "name": "Etsy",
                     "icon": "9794075a5cc9e233063eac1e1430a6fc.svg",
                     "code": "Etsy"
                 },
                 "shopOwner": {
                     "_id": "41136571",
                     "idReference": "ShopOwner",
                     "clazz": "com.qpp.cgp.domain.partner.store.ShopOwner",
                     "modifiedDate": 1748920534568
                 },
                 "status": "active",
                 "authInfoToExternal": true,
                 "authSuccessToExternal": true,
                 "createWebhook": false,
                 "currency": {
                     "id": 969634,
                     "clazz": "com.qpp.cgp.domain.common.Currency",
                     "modifiedDate": 1748920534568
                 },
                 "currencyCode": "HKD",
                 "mode": "Stage",
                 "needToUpgradePlugins": false,
                 "currencyExceptionInfoList": [
                     {
                         "code": 3000607,
                         "message": "The store currency is different from the price currency"
                     }
                 ],
                 "storeProductUpgradeStatus": "WAITING",
                 "billAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
                 "deliveryAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
             },
             "partner": {
                 "_id": "41136571",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "name": 'zhangjing',
                 "code": 'zhangjing',
             },
            
         },
         {
             store: {
                 "_id": "244788266",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "createdDate": 1739866894326,
                 "createdBy": "40881767",
                 "modifiedDate": 1748935009239,
                 "modifiedBy": "40881767",
                 "name": "test",
                 "url": "https://game.islandgameric1e.com/game/island/mobile/index.html",
                 "platform": {
                     "_id": "21858392",
                     "clazz": "com.qpp.cgp.domain.partner.store.StorePlatform",
                     "createdDate": 1636945929469,
                     "createdBy": "string",
                     "modifiedDate": 1709970299078,
                     "modifiedBy": "40488402",
                     "name": "WooCommerce",
                     "icon": "a38b15d5c8119e762bb95842d1323ee7.svg",
                     "code": "WooCommerce"
                 },
                 "shopOwner": {
                     "_id": "41136571",
                     "idReference": "ShopOwner",
                     "clazz": "com.qpp.cgp.domain.partner.store.ShopOwner",
                     "modifiedDate": 1748935009239
                 },
                 "status": "draft",
                 "authInfoToExternal": false,
                 "authSuccessToExternal": false,
                 "connectErrorCode": "005",
                 "createWebhook": false,
                 "metaData": {
                     "currentStep": 2,
                     "steps": [
                         {},
                         {
                             "storeNameDraft": "test",
                             "storeUrlDraft": "https://game.islandgameric1e.com/game/island/mobile/index.html"
                         }
                     ],
                     "flow": "existShop"
                 },
                 "mode": "Stage",
                 "needToUpgradePlugins": false,
                 "currencyExceptionInfoList": [],
                 "storeProductUpgradeStatus": "WAITING",
 
                 "billAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
                 "deliveryAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
             },
             "partner": {
                 "_id": "41136571",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "name": 'zhangjing',
                 "code": 'zhangjing',
             },
            
         },
         {
             store: {
                 "_id": "49087694",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "createdDate": 1692153110301,
                 "createdBy": "40881767",
                 "modifiedDate": 1748942823789,
                 "modifiedBy": "40488402",
                 "name": "2",
                 "url": "https://",
                 "platform": {
                     "_id": "21867108",
                     "clazz": "com.qpp.cgp.domain.partner.store.StorePlatform",
                     "createdDate": 1637207476404,
                     "createdBy": "ManualOrderPlatform",
                     "modifiedDate": 1748574612521,
                     "modifiedBy": "40881767",
                     "name": "ManualOrderPlatform",
                     "icon": "a22db0910569f73d2de20adba0e73983.svg",
                     "code": "Manual"
                 },
                 "shopOwner": {
                     "_id": "41136571",
                     "clazz": "com.qpp.cgp.domain.partner.store.ShopOwner",
                     "modifiedDate": 1748942823789
                 },
                 "status": "close",
                 "authInfoToExternal": false,
                 "authSuccessToExternal": true,
                 "createWebhook": false,
                 "needToUpgradePlugins": false,
                 "currencyExceptionInfoList": [],
                 "storeProductUpgradeStatus": "WAITING",
                 "billAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
                 "deliveryAddress": {
                     "modifiedDate": 1748506138812,
                     "countryCode2": "FR",
                     "countryName": "France",
                     "state": "",
                     "city": "Paris",
                     "streetAddress1": "64,Boulevard Harssmann 75009",
                     "streetAddress2": "",
                     "postcode": "75020",
                     "firstName": "Kaimanho",
                     "lastName": "Kaimanho",
                     "telephone": "",
                     "emailAddress": "kaimanho@qpp.com",
                     "company": "",
                     "sortOrder": 1
                 },
             },
             "partner": {
                 "_id": "41136571",
                 "clazz": "com.qpp.cgp.domain.partner.store.Store",
                 "name": 'zhangjing',
                 "code": 'zhangjing',
             },
         }
     ],*/
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})