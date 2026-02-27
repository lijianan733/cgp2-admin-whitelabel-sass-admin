/**
 * @author xiu
 * @date 2023/12/8
 */
Ext.define('CGP.builderpage.defaults.MainPageDefault', {
    //正式配置
    config: {
        evenType: 'render',
        editType: 'builder',
        id: JSGetQueryString('id'),
        seqNo: JSGetQueryString('seqNo'),
        orderId: JSGetQueryString('orderId'),
        statusId: JSGetQueryString('status'),
        orderNumber: JSGetQueryString('orderNumber'),
        productInstanceId: JSGetQueryString('productInstanceId'),
        isRandomCardPage: JSGetQueryString('isRandomCardPage') === 'true',
        manufacturePreview: function () {
            var result = null;
            result = JSGetQueryString('manufacturePreview');

            function isAbsoluteURL(url) {
                // 匹配绝对路径 URL 的正则表达式
                var regex = /^(?:[a-z]+:)?\/\//i;
                return regex.test(url);
            }

            if (!isAbsoluteURL(result)) {
                result = adminPath.slice(0, adminPath.length - 10) + JSGetQueryString('manufacturePreview');
            }
            return result
        }(),
    },
    //测试配置
    test: {
        seqNo: 1,
        id: 54945443,
        statusId: 119,
        orderId: 54945444,
        editType: 'builder',
        evenType: 'render',
        orderNumber: 'TM2407090009',
        productInstanceId: 54945422,
        manufacturePreview: 'http://192.168.41.153:8870/productionPreview/index.html', // 'http://192.168.41.140:8089/whitelabel-builder/production/index.html',
    },
    //测试配置2 / 2024.7.9
    test2: {
        seqNo: 1,
        id: 231888281,
        statusId: 101,
        orderId: 231865285,
        editType: 'builder',
        evenType: 'render',
        orderNumber: 'TM2407090009',
        productInstanceId: 231879365,
        manufacturePreview: 'https://sz-nginx-test1.qppdev.com/whitelabel-site/h5builder/production/preview/pc/5/index.html',
    },
    //测试配置3 / 2025.8.30
    test3: {
        seqNo: 1,
        id: 174102640,
        statusId: 106,
        orderId: 174102642,
        editType: 'builder',
        evenType: 'render',
        orderNumber: '972508240003',
        productInstanceId: 174103389,
        manufacturePreview: 'http://192.168.41.153:8848/whitelabel-builder/preview/index.html',
    },
    //测试配置4 / 2025.9.3
    test4: {
        "evenType": "render",
        "editType": "builder",
        "id": "282786461",
        "seqNo": "1",
        "orderId": "282784484",
        "statusId": "101",
        "orderNumber": "TM2509030005",
        "productInstanceId": "282785781",
        "manufacturePreview": "http://192.168.41.153:8848/whitelabel-builder/preview/index.html"
    },
    //测试配置5 / 2025.10.9 正式单查错
    test5: {
        "evenType": "render",
        "editType": "builder",
        "id": "179824003",
        "seqNo": "1",
        "orderId": "179824005",
        "statusId": "100",
        "orderNumber": "972510090001",
        "productInstanceId": "179824760",
        "manufacturePreview": "http://192.168.41.153:8848/whitelabel-builder/preview/index.html"
    },
    //测试配置6 / 2025.11.17 修复普通预览渲染问题
    test6: {
        "evenType": "render",
        "editType": "builder",
        "seqNo": "1",
        "id": "306591382",
        "orderId": "306590382",
        "statusId": "300",
        "orderNumber": "9834565",
        "productInstanceId": "306589729",
        "manufacturePreview": "http://192.168.41.153:8873/whitelabel-builder/preview/index.html"
    },
    test7: { // 2025.11.19 折线测试 73
        "evenType": "render",
        "editType": "builder",
        "id": "306972241",
        "seqNo": "1",
        "orderId": "306965175",
        "statusId": "300",
        "orderNumber": "8520132",
        "productInstanceId": "306971728",
        "manufacturePreview": "http://192.168.41.153:8873/whitelabel-builder/preview/index.html",
        // "manufacturePreview": "https://sz-nginx-test1.qppdev.com/whitelabel-site/h5builder/production/preview/pc/5/index.html"
    },
    test9: {
        "evenType": "render",
        "editType": "builder",
        "id": "346698613",
        "seqNo": "1",
        "orderId": "346698615",
        "statusId": "101",
        "orderNumber": "TM2601280001",
        "productInstanceId": "346698674",
        "manufacturePreview": "https://dev-sz-qpson-nginx.qppdev.com/whitelabel-site/h5builder/production/preview/pc/5/index.html"
    },
    /* hasOwnProperty: {
             "eventId": 123456,
             "type": "qp.builder.production.updateView",
             "columnQty": 12,
             "fitMode": "original" //auto
         }*/
})
