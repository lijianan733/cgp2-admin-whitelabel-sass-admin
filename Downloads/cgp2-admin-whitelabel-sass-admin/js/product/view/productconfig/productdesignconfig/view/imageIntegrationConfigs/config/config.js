/**
 * @Description:
 * @author nan
 * @date 2022/8/3
 */
//下单测试数据
var orderData = {
    "bindOrderNumbers": [
        "test22030018"
    ],
    "lineItems": [
        {
            "qty": 10,
            "imageProject": {
                "productId": 29804144,
                "comparisonThumbnail": "https://dev-sz-qpson-nginx.qppdev.com/file/file/f87f6b8de9d4d74de35d6382c6583653.png",
                "content": [
                    {
                        "side": "S-Front-Hor",
                        "image": "https://dev-sz-qpson-nginx.qppdev.com/file/file/f87f6b8de9d4d74de35d6382c6583653.png"
                    }
                ]
            },
            "comment": "test",
            "customsUnitPrice": 33.3
        }
    ],
    "deliveryAddress": {
        "firstName": "felix",
        "lastName": "chan",
        "state": "test",
        "city": "test",
        "suburb": "test",
        "postcode": "111111",
        "streetAddress1": "test1",
        "steetAddress2": "test",
        "telephone": 12345678911,
        "mobile": 123456,
        "emailAddress": "felixchan@qpp.com",
        "countryCode2": "US",
        "countryName": "United States"
    },
    "customsCurrencyCode": "HKD",
    "shippingMethod": "Standard"
}
