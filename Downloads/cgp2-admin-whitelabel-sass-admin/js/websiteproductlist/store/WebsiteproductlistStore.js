/**
 * @author xiu
 * @date 2025/7/30
 */
Ext.define('CGP.websiteproductlist.store.WebsiteproductlistStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.websiteproductlist.model.WebsiteproductlistModel',
    pageSize: 50,
    autoLoad: true,
    remoteSort: true,
     proxy: {
         type: 'uxrest',
         url: adminPath + 'api/store-settings/product-view',
         reader: {
             type: 'json',
             root: 'data.content'
         }
     },
   /* proxy: {
        type: 'pagingmemory',
    },
    data: [
        {
            "id": 133829,
            "type": "Configurable",
            "model": "michael_test_impression_i18n_03",
            "name": "michael_test_impression_i18n_03",
            "salePrice": 25.1,
            "lowestPrice": 0.65,
            "dateAvailable": 1638115200000,
            "mode": "RELEASE",
            "mainCategory": {
                "id": 22275365,
                "name": "QPSON-Playing Cards",
                "websiteName": "WhiteLabel"
            },
            "subCategories": [
                {
                    "id": 22234468,
                    "name": "QPSON"
                }
            ],
            "websiteName": "WhiteLabel",
            "clazz": "com.qpp.cgp.domain.product.ConfigurableProduct",
            "createdDate": 1747893228819,
            "internal": false,
            "isFinished": false,
            isActived: true,
            isRelease: true,
        },
    ],*/
    sorters: [{
        property: 'dateAvailable',
        direction: 'DESC'
    }],
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})