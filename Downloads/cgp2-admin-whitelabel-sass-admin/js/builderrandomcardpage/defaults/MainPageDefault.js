/**
 * @author xiu
 * @date 2023/12/8
 */
Ext.define('CGP.builderrandomcardpage.defaults.MainPageDefault', {
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
        // productInstanceId: 349756777, //双面随机 70
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
    test8: {
        "evenType": "render",
        "editType": "builder",
        "id": "330407996",
        "seqNo": "2",
        "orderId": "330407997",
        "statusId": "102",
        "orderNumber": "TM2512300019",
        "productInstanceId": "330407947",
        "manufacturePreview": "https://sz-nginx-test1.qppdev.com/whitelabel-site/h5builder/production/preview/pc/5/index.html"
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
    mockData: {
        "materialPath": "62702886,62702881,62614427",
        "materialName": "M_Card",
        "materialCode": "M_Card",
        "materialViews": [
            {
                "_id": "330407826",
                "name": "2.48x3.46卡牌 正面",
                "pageContents": [
                    {
                        "_id": "330412373",
                        "idReference": "PageContent",
                        "clazz": "com.qpp.cgp.domain.bom.runtime.PageContent",
                        "createdDate": 1767078108141,
                        "createdBy": "31604380",
                        "modifiedDate": 1767078108142,
                        "modifiedBy": "31604380",
                        "index": "0",
                        "code": "QPSON 1.75x3.5 卡牌 正面V2",
                        "name": "2.48x3.46卡牌 正面V2",
                        "width": 196,
                        "height": 267,
                        "layers": [
                            {
                                "display": true,
                                "description": "背景層",
                                "readOnly": false,
                                "_id": "50775437",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50775447",
                                        "clazz": "Picture",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": false,
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "metaData": {
                                            "isImageLibrary": true
                                        },
                                        "uniqueId": "634712002",
                                        "imageWidth": 196,
                                        "imageHeight": 277,
                                        "originalWidth": 189,
                                        "originalHeight": 267,
                                        "brightness": 0,
                                        "originalName": "936781e30a97821e814befb927ff1620.png",
                                        "contentTransform": [
                                            1,
                                            0,
                                            0,
                                            1,
                                            0,
                                            -5
                                        ],
                                        "printFile": "936781e30a97821e814befb927ff1620.png",
                                        "imageName": "936781e30a97821e814befb927ff1620.png",
                                        "imageId": "330409007"
                                    }
                                ],
                                "uniqueId": "634712001",
                                "effectType": "Printing",
                                "tags": [
                                    "Background"
                                ],
                                "zIndex": 0
                            },
                            {
                                "display": true,
                                "description": "設計層（自由元素）",
                                "readOnly": false,
                                "_id": "50775430",
                                "clazz": "Layer",
                                "items": [],
                                "uniqueId": "634712003",
                                "effectType": "Printing",
                                "tags": [
                                    "Design"
                                ],
                                "zIndex": 1
                            },
                            {
                                "display": true,
                                "description": "前景層",
                                "readOnly": false,
                                "_id": "50775424",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50775427",
                                        "clazz": "Picture",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": true,
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "uniqueId": "634712005",
                                        "brightness": 0
                                    }
                                ],
                                "uniqueId": "634712004",
                                "effectType": "Printing",
                                "tags": [
                                    "Foreground"
                                ],
                                "zIndex": 2
                            },
                            {
                                "display": true,
                                "description": "定制-品红色出血縣",
                                "readOnly": true,
                                "_id": "19198324",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50774336",
                                        "clazz": "ShapeObject",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": false,
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "uniqueId": "634712007",
                                        "shape": {
                                            "clazz": "Path",
                                            "d": "M0 0 L196.5827 0 L196.5827 267.4488 L0 267.4488 L0 0"
                                        },
                                        "strokeStyle": {
                                            "clazz": "SolidColorStroke",
                                            "color": "9502720",
                                            "alpha": 1,
                                            "caps": "round",
                                            "joints": "round",
                                            "miterLimit": 3,
                                            "width": 1,
                                            "dash": []
                                        }
                                    }
                                ],
                                "uniqueId": "634712006",
                                "tags": [
                                    "Builder-Bleeds"
                                ],
                                "zIndex": 3
                            },
                            {
                                "display": true,
                                "description": "定制-灰色刀線",
                                "readOnly": true,
                                "_id": "50774736",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50893621",
                                        "clazz": "ShapeObject",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": false,
                                        "x": 0,
                                        "y": 0,
                                        "width": 179,
                                        "height": 250,
                                        "uniqueId": "634712009",
                                        "shape": {
                                            "clazz": "Path",
                                            "d": "M17.1213 8.6173 L179.4614 8.6173 C184.158 8.6173 187.9653 12.4247 187.9653 17.1213 L187.9653 250.3275 C187.9653 255.0241 184.158 258.8315 179.4614 258.8315 L17.1213 258.8315 L17.1213 258.8315 C12.4247 258.8315 8.6173 255.0241 8.6173 250.3275 L8.6173 17.1213 C8.6173 12.4247 12.4247 8.6173 17.1213 8.6173"
                                        },
                                        "strokeStyle": {
                                            "clazz": "SolidColorStroke",
                                            "color": "12303291",
                                            "alpha": 1,
                                            "caps": "round",
                                            "joints": "round",
                                            "miterLimit": 3,
                                            "width": 1,
                                            "dash": []
                                        }
                                    }
                                ],
                                "uniqueId": "634712008",
                                "tags": [
                                    "Builder-Cut"
                                ],
                                "zIndex": 4
                            },
                            {
                                "display": true,
                                "description": "定制-安全線",
                                "readOnly": true,
                                "_id": "50775419",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50893714",
                                        "clazz": "ShapeObject",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": false,
                                        "x": 0,
                                        "y": 0,
                                        "width": 165,
                                        "height": 236,
                                        "uniqueId": "634712011",
                                        "shape": {
                                            "clazz": "Path",
                                            "d": "M19.9559 15.7039 L176.6268 15.7039 C178.9751 15.7039 180.8787 17.6076 180.8787 19.9559 L180.8787 247.4929 C180.8787 249.8412 178.9751 251.7449 176.6268 251.7449 L19.9559 251.7449 C17.6076 251.7449 15.7039 249.8412 15.7039 247.4929 L15.7039 19.9559 C15.7039 17.6076 17.6076 15.7039 19.9559 15.7039"
                                        },
                                        "strokeStyle": {
                                            "clazz": "SolidColorStroke",
                                            "color": "13172864",
                                            "alpha": 1,
                                            "caps": "round",
                                            "joints": "round",
                                            "miterLimit": 3,
                                            "width": 1,
                                            "dash": [
                                                1,
                                                2
                                            ]
                                        }
                                    }
                                ],
                                "uniqueId": "634712010",
                                "tags": [
                                    "Safe"
                                ],
                                "zIndex": 5
                            },
                            {
                                "display": true,
                                "description": "出血位遮罩圖（透明度由功能決定）",
                                "readOnly": true,
                                "_id": "50775450",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50775454",
                                        "clazz": "Image",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": false,
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "uniqueId": "634712013",
                                        "imageName": "0c7d13ae0e5c1c1bd2a3f577fc83583a.svg",
                                        "imageWidth": 196,
                                        "imageHeight": 267
                                    }
                                ],
                                "uniqueId": "634712012",
                                "tags": [
                                    "Mask"
                                ],
                                "zIndex": 6
                            },
                            {
                                "display": true,
                                "description": "固定文字信息",
                                "readOnly": true,
                                "_id": "50775457",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50775460",
                                        "clazz": "Image",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": false,
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "uniqueId": "634712015",
                                        "imageName": "c37f7cc14baf31cbc49bd70f1070a7b7.svg",
                                        "imageWidth": 196,
                                        "imageHeight": 267
                                    }
                                ],
                                "uniqueId": "634712014",
                                "tags": [
                                    "FixedText"
                                ],
                                "zIndex": 7
                            }
                        ],
                        "pageContentSchemaId": "104431072",
                        "sortIndex": 0,
                        "pageContentSchemaRuntimeId": "330407767",
                        "structVersion": 3
                    }
                ],
                "pageContentQty": 54,
                "mappingIndex": [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                "sort": 0
            },
            {
                "_id": "330407827",
                "name": "2.48x3.46 卡牌 背面",
                "pageContents": [
                    {
                        "_id": "330412372",
                        "idReference": "PageContent",
                        "clazz": "com.qpp.cgp.domain.bom.runtime.PageContent",
                        "createdDate": 1767078108139,
                        "createdBy": "31604380",
                        "modifiedDate": 1767078108140,
                        "modifiedBy": "31604380",
                        "index": "0",
                        "code": "QPSON 1.75x3.5  卡牌 背面",
                        "name": "2.48x3.46 卡牌 背面",
                        "width": 196,
                        "height": 267,
                        "layers": [
                            {
                                "display": true,
                                "description": "背景層",
                                "readOnly": false,
                                "_id": "50776846",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50776850",
                                        "clazz": "Picture",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": false,
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "metaData": {
                                            "isImageLibrary": true
                                        },
                                        "uniqueId": "714427002",
                                        "imageWidth": 196,
                                        "imageHeight": 277,
                                        "originalWidth": 189,
                                        "originalHeight": 267,
                                        "brightness": 0,
                                        "originalName": "a8240e2a917935797f88c16053e12139.png",
                                        "contentTransform": [
                                            1,
                                            0,
                                            0,
                                            1,
                                            0,
                                            -5
                                        ],
                                        "printFile": "a8240e2a917935797f88c16053e12139.png",
                                        "imageName": "a8240e2a917935797f88c16053e12139.png",
                                        "imageId": "330409006"
                                    }
                                ],
                                "uniqueId": "714427001",
                                "effectType": "Printing",
                                "tags": [
                                    "Background"
                                ],
                                "zIndex": 0
                            },
                            {
                                "display": true,
                                "description": "設計層（自由元素）",
                                "readOnly": false,
                                "_id": "50776843",
                                "clazz": "Layer",
                                "items": [],
                                "uniqueId": "714427003",
                                "effectType": "Printing",
                                "tags": [
                                    "Design"
                                ],
                                "zIndex": 1
                            },
                            {
                                "display": true,
                                "description": "前景層",
                                "readOnly": false,
                                "_id": "50776840",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50776841",
                                        "clazz": "Picture",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": true,
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "uniqueId": "714427005",
                                        "brightness": 0
                                    }
                                ],
                                "uniqueId": "714427004",
                                "effectType": "Printing",
                                "tags": [
                                    "Foreground"
                                ],
                                "zIndex": 2
                            },
                            {
                                "display": true,
                                "description": "定制-品紅色出血縣",
                                "readOnly": true,
                                "_id": "19198324",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50776637",
                                        "clazz": "ShapeObject",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": false,
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "uniqueId": "714427007",
                                        "shape": {
                                            "clazz": "Path",
                                            "d": "M0 0 L196.5827 0 L196.5827 267.4488 L0 267.4488 L0 0"
                                        },
                                        "strokeStyle": {
                                            "clazz": "SolidColorStroke",
                                            "color": "9502720",
                                            "alpha": 1,
                                            "caps": "round",
                                            "joints": "round",
                                            "miterLimit": 3,
                                            "width": 1,
                                            "dash": []
                                        }
                                    }
                                ],
                                "uniqueId": "714427006",
                                "tags": [
                                    "Builder-Bleeds"
                                ],
                                "zIndex": 3
                            },
                            {
                                "display": true,
                                "description": "定制-灰色刀線",
                                "readOnly": true,
                                "_id": "19198340",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50893734",
                                        "clazz": "ShapeObject",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": false,
                                        "x": 0,
                                        "y": 0,
                                        "width": 179,
                                        "height": 250,
                                        "uniqueId": "714427009",
                                        "shape": {
                                            "clazz": "Path",
                                            "d": "M17.1213 8.6173 L179.4614 8.6173 C184.158 8.6173 187.9653 12.4247 187.9653 17.1213 L187.9653 250.3275 C187.9653 255.0241 184.158 258.8315 179.4614 258.8315 L17.1213 258.8315 L17.1213 258.8315 C12.4247 258.8315 8.6173 255.0241 8.6173 250.3275 L8.6173 17.1213 C8.6173 12.4247 12.4247 8.6173 17.1213 8.6173"
                                        },
                                        "strokeStyle": {
                                            "clazz": "SolidColorStroke",
                                            "color": "12303291",
                                            "alpha": 1,
                                            "caps": "round",
                                            "joints": "round",
                                            "miterLimit": 3,
                                            "width": 1,
                                            "dash": []
                                        }
                                    }
                                ],
                                "uniqueId": "714427008",
                                "tags": [
                                    "Builder-Cut"
                                ],
                                "zIndex": 4
                            },
                            {
                                "display": true,
                                "description": "定制-安全線",
                                "readOnly": true,
                                "_id": "50776727",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50893739",
                                        "clazz": "ShapeObject",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": false,
                                        "x": 0,
                                        "y": 0,
                                        "width": 165,
                                        "height": 236,
                                        "uniqueId": "714427011",
                                        "shape": {
                                            "clazz": "Path",
                                            "d": "M19.9559 15.7039 L176.6268 15.7039 C178.9751 15.7039 180.8787 17.6076 180.8787 19.9559 L180.8787 247.4929 C180.8787 249.8412 178.9751 251.7449 176.6268 251.7449 L19.9559 251.7449 C17.6076 251.7449 15.7039 249.8412 15.7039 247.4929 L15.7039 19.9559 C15.7039 17.6076 17.6076 15.7039 19.9559 15.7039"
                                        },
                                        "strokeStyle": {
                                            "clazz": "SolidColorStroke",
                                            "color": "13172864",
                                            "alpha": 1,
                                            "caps": "round",
                                            "joints": "round",
                                            "miterLimit": 3,
                                            "width": 1,
                                            "dash": [
                                                1,
                                                2
                                            ]
                                        }
                                    }
                                ],
                                "uniqueId": "714427010",
                                "tags": [
                                    "Safe"
                                ],
                                "zIndex": 5
                            },
                            {
                                "display": true,
                                "description": "出血位遮罩圖（透明度由功能決定）",
                                "readOnly": true,
                                "_id": "50776866",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50776867",
                                        "clazz": "Image",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": false,
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "uniqueId": "714427013",
                                        "imageName": "f523fb8a10361bf9cab03a4644fca486.svg",
                                        "imageWidth": 144,
                                        "imageHeight": 270
                                    }
                                ],
                                "uniqueId": "714427012",
                                "tags": [
                                    "Mask"
                                ],
                                "zIndex": 6
                            },
                            {
                                "display": true,
                                "description": "固定文字信息",
                                "readOnly": true,
                                "_id": "50776923",
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "_id": "50777409",
                                        "clazz": "Image",
                                        "tags": [],
                                        "zIndex": 0,
                                        "readOnly": false,
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "uniqueId": "714427015",
                                        "imageName": "f7654c2e5f177b1d2cf401cd0e238c74.svg",
                                        "imageWidth": 144,
                                        "imageHeight": 270
                                    }
                                ],
                                "uniqueId": "714427014",
                                "tags": [
                                    "FixedText"
                                ],
                                "zIndex": 7
                            }
                        ],
                        "pageContentSchemaId": "104431076",
                        "sortIndex": 0,
                        "pageContentSchemaRuntimeId": "330407766",
                        "structVersion": 3
                    }
                ],
                "pageContentQty": 54,
                "mappingIndex": [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                "sort": 0
            }
        ]
    }
})
