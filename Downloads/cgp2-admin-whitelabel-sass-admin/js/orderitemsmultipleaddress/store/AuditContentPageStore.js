/**
 * @author xiu
 * @date 2026/1/30
 */
Ext.define('CGP.orderitemsmultipleaddress.store.AuditContentPageStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.orderitemsmultipleaddress.model.AuditContentPageModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners/orders/{orderId}/stores/products/designs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    /*proxy: {
        type: 'pagingmemory',
        data: [],
    },
    data: [
        {
            productSku: 'QPSON-3.5x5.75Cards PS002005001-19',
            itemCountInDesignId: 20,
            totalItemQtyInDesignId: 15,
            designMethod: 'RANDOM',
            storeProductId: '12345',
            storeName: 'storeName',
            storeId: 'storeId',
            productModel: 'QPSON-3.5x5.75Cards PS002005001',
            randomDesignReview: false,
            productName: "Large Size Custom Playing Card (3.5\" × 5.75\")",
            previewImage: "1d0389fc-6361-4380-9e30-ef9679f945a4-0.jpg",
            productDescription: "產品：(300克藍芯紙+啤牌油)撲克牌(方形(圓角))[產品++收縮包裝]Playing Card 3.5in x 5.75in(89 x 146 mm)(8張)",
            designId: "344014901",
            itemGenerateStatus: 'SUCCESS',
        },
        {
            productSku: "QPSON-3.5x5.75Cards PS002005001-19",
            itemCountInDesignId: 20,
            totalItemQtyInDesignId: 15,
            designMethod: 'FIX',
            storeProductId: '12345',
            storeName: 'storeName',
            storeId: 'storeId',
            productModel: 'QPSON-3.5x5.75Cards PS002005001',
            randomDesignReview: true,
            productName: "Large Size Custom Playing Card (3.5\" × 5.75\")",
            previewImage: "1d0389fc-6361-4380-9e30-ef9679f945a4-0.jpg",
            productDescription: "產品：(300克藍芯紙+啤牌油)撲克牌(方形(圓角))[產品++收縮包裝]Playing Card 3.5in x 5.75in(89 x 146 mm)(8張)",
            designId: "344014904",
            itemGenerateStatus: 'SUCCESS',
        },
        {
            productSku: "QPSON-3.5x5.75Cards PS002005001-19",
            itemCountInDesignId: 20,
            totalItemQtyInDesignId: 15,
            designMethod: 'FIX',
            storeProductId: '12345',
            storeName: 'storeName',
            storeId: 'storeId',
            productModel: 'QPSON-3.5x5.75Cards PS002005001',
            fixDesignReview: false,
            productName: "Large Size Custom Playing Card (3.5\" × 5.75\")",
            previewImage: "1d0389fc-6361-4380-9e30-ef9679f945a4-0.jpg",
            productDescription: "產品：(300克藍芯紙+啤牌油)撲克牌(方形(圓角))[產品++收縮包裝]Playing Card 3.5in x 5.75in(89 x 146 mm)(8張)",
            designId: "344014902",
        },
        {
            productSku: "QPSON-3.5x5.75Cards PS002005001-19",
            itemCountInDesignId: 20,
            totalItemQtyInDesignId: 15,
            designMethod: 'FIX',
            storeProductId: '12345',
            storeName: 'storeName',
            storeId: 'storeId',
            productModel: 'QPSON-3.5x5.75Cards PS002005001',
            fixDesignReview: true,
            productName: "Large Size Custom Playing Card (3.5\" × 5.75\")",
            previewImage: "1d0389fc-6361-4380-9e30-ef9679f945a4-0.jpg",
            productDescription: "產品：(300克藍芯紙+啤牌油)撲克牌(方形(圓角))[產品++收縮包裝]Playing Card 3.5in x 5.75in(89 x 146 mm)(8張)",
            designId: "344014903",
        },
    ],*/
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }

        if (config && config.orderId) {
            me.proxy.url = adminPath + `api/partners/orders/${config.orderId}/stores/products/designs`;
        }

        me.callParent(arguments);
    }
})