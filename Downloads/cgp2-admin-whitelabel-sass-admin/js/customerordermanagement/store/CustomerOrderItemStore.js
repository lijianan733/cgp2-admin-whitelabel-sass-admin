/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.define('CGP.customerordermanagement.store.CustomerOrderItemStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.customerordermanagement.model.CustomerOrderInfoModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
     proxy: {
        type: 'uxrest',
        url: adminPath + 'api/background/store/orders/{id}/items/v1',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
   /* proxy: {
        type: 'pagingmemory',
        data: []
    },
    data: [
        {
            "id": 245216526,
            "status": "paid",
            "productInstanceId": "245216523",
            "qty": 1,
            "unitPrice": "US$42.20",
            "unitPriceValue": 42.20,
            "amount": "US$42.20",
            "amountValue": 42.20,
            "productId": "242397717",
            "productName": "19\" x 19\"-25/01/13",
            "productImageInfo": {
                "productImageSetId": 242942311,
                "filename": "35fa6441-13a1-4d08-8677-01c5c30096af-0.jpg",
                "filePath": "file/composingPreview/35fa6441-13a1-4d08-8677-01c5c30096af-0.jpg",
                "sortOrder": 0,
                "isDesign": true
            },
            "productWeight": "257.00g",
            "totalWeight": "257.00g",
            "isOrdered": true,
            "whitelabelOrderId": "252172924",
            "whitelabelOrderNumber": "TM2503100001",
            "isSimpleCustomized": false,
            "productInstanceThumbnail": "35fa6441-13a1-4d08-8677-01c5c30096af-0.jpg",
            "mockupImages": [
            ],
            "productDescription": "Print Type:Classic</br>Board Quality:Deluxe</br>Number of Pieces:500</br>Print Sides:Single Side</br>Finish:Regular Gloss</br>Packaging:Standard box with Image</br>Printed Insert:No</br>Frame add on:None",
            "isFinishedProduct": false,
            "designMethod": "FIX",
            "price": "US$28.99",
            "totalPrice": "US$28.99",
            "productSku": "QPSON Custom 19\" x 19\" Puzzle Set-69"
        },
    ],*/
    constructor: function (config) {
        var me = this,
            {customerId} = config; 

        me.proxy.url = adminPath + `api/background/store/orders/${customerId}/items/v1`;

        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})