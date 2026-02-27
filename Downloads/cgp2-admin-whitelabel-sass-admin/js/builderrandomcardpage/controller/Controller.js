/**
 * @author xiu
 * @date 2023/9/21
 */
Ext.define('CGP.builderrandomcardpage.controller.Controller', {
    editQuery: function (url, jsonData, isEdit) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, true, jsonData, successMsg, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
                }
            }
        }, true);
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, msg) {
        var method = isEdit ? 'PUT' : 'POST';

        JSAjaxRequest(url, method, true, jsonData, msg, callFn, true);
    },

    //查询
    getQuery: function (url) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        })
        return data;
    },

    //删除
    deleteQuery: function (url) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    console.log(responseText.data.content || responseText.data);
                }
            }
        }, true)
    },

    //获取url
    getUrl: function (author) {
        var urlGather = {
            mainUrl: adminPath + 'api/colors',

        }
        return urlGather[author];
    },

    // 左单选栏信息收集
    leftSingleSelectFun: function (operationValue) {
        return {
            elements: [
                {
                    clazz: 'ElementSelector',
                    layerTags: ['Mask', 'Mask50', 'Mask100'],
                    elementClazz: ['Image'],
                    elementTags: []
                }
            ],
            operationType: 'SET',
            attribute: 'alpha',
            single: 'alpha',
            value: operationValue,
        }
    },

    // 右工具栏信息收集
    rightToolsFun: function (isVisible, viewIds) {
        var elements = []
        viewIds.forEach(item => {
            elements.push(
                {
                    clazz: 'ElementSelector',
                    viewId: item._id,
                    pcId: 'ALL.PC',
                    name: item.name || ''
                }
            )
        })

        return {
            elements: elements,
            operationType: 'SET',
            attribute: 'isClip',
            single: 'isClip',
            value: isVisible,
        }
    },

    // 中间控制颜色
    centerColorFun: function (layerTags, color) {
        return {
            elements: [
                {
                    clazz: 'ElementSelector',
                    layerTags: layerTags,
                    elementClazz: 'ShapeObject',
                    attribute: 'strokeStyle',
                    elementTags: [],
                }
            ],
            operationType: 'SET',
            attribute: 'color',
            single: JSON.stringify(layerTags) + 'Color',
            value: +color,
        }
    },

    // 中间控制线
    centerLineFun: function (layerTags, isVisible) {
        return {
            elements: [
                {
                    attribute: 'strokeStyle',
                    clazz: 'ElementSelector',
                    elementClazz: 'ShapeObject',
                    layerTags: layerTags,
                }
            ],
            operationType: 'SET',
            attribute: 'alpha',
            single: layerTags,
            value: isVisible ? 1 : 0,
        }
    },

    // 获取填充图片
    getFillPictures: function (photoLibIds, pageContentId) {
        var url = adminPath + `api/photoLib/photoLibItems/batchQuery?photoLibIds=${photoLibIds}`,
            images = JSGetQuery(url),
            fillPictures = images.map(item => {
                item['pageContentId'] = pageContentId;
                item['fileName'] = item['name']
                return item;
            });
        
        if (!images?.length){
            Ext.Msg.alert('提示','随机卡图库为空!')
        }

        return fillPictures;
    },

    // 获取随机卡牌数据
    getRandomCardDataConversion: function (type, materialViews) {
        var controller = this,
            materialView = materialViews[0],
            photoLibIds = materialView?.photoLibIds,
            // photoLibIds = [346714770, 346714769, 346714768],
            pageContents = materialView?.pageContents,
            fillPictures = [],
            typeGather = {
                materialView: function () {  //单面随机
                    var pageContentId = pageContents[0]._id;

                    materialView['pageContent'] = pageContents[0];
                    fillPictures = controller.getFillPictures(photoLibIds, pageContentId);

                    return {
                        "_id": "197427001",
                        "clazz": "MaterialView",
                        "materialView": materialView
                    }
                },
                materialViewArray: function () { //双面随机
                    materialViews.forEach(item => {
                        var photoLibIds = item['photoLibIds'],
                            pageContents = item?.pageContents,
                            pageContentId = pageContents[0]._id,
                            itemFillPictures = controller.getFillPictures(photoLibIds, pageContentId);

                        fillPictures = Ext.Array.merge(fillPictures, itemFillPictures);
                        item['pageContent'] = pageContents[0];
                    })

                    return {
                        "_id": "197427001",
                        "clazz": "MaterialViewArray",
                        "sortModel": "MV_PRIORITY",
                        "materialViews": materialViews
                    }
                },
                pageContentSchema: function () {
                    materialView['pageContent'] = pageContents[0];

                    return pageContents[0];
                }
            },
            document = typeGather[type]();

        return {
            eventId: JSGetUUID(),
            type: "qp.builder.production.fillBackground",
            document: document,
            fillPictures: fillPictures,
        }
    },

    // 获取随机卡类型(单双面随机/双面联合随机)
    getRandomCardType: function (materialViews) {
        var materialViewLength = materialViews?.length || 0,
            type = materialViewLength > 1 ? 'materialViewArray' : 'materialView';

        return type;
    },

    // 物料选择数据
    changeAndBootstrap: function (type, materialViews) {
       /* var materialViews = [
            {
                "_id": "346698597",
                "name": "卡牌 背面",
                "pageContents": [
                    {
                        "_id": "346714190",
                        "idReference": "PageContent",
                        "clazz": "com.qpp.cgp.domain.bom.runtime.PageContent",
                        "createdDate": 1769591305477,
                        "createdBy": "47304273",
                        "modifiedDate": 1769591305482,
                        "index": "0",
                        "code": "Card_Back",
                        "name": "卡牌 背面",
                        "width": 196,
                        "height": 267,
                        "layers": [
                            {
                                "display": true,
                                "description": "背景層",
                                "readOnly": false,
                                "_id": 50776846,
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "clazz": "Picture",
                                        "_id": 50776850,
                                        "readOnly": false,
                                        "tags": [],
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "imageName": "3d0659ac95b8f2b09a944eb54f4018c5.jpg",
                                        "originalName": "3d0659ac95b8f2b09a944eb54f4018c5.jpg",
                                        "printFile": "3d0659ac95b8f2b09a944eb54f4018c5.jpg",
                                        "originalWidth": 235,
                                        "originalHeight": 215,
                                        "imageWidth": 292,
                                        "imageHeight": 267,
                                        "contentTransform": [
                                            1,
                                            0,
                                            0,
                                            1,
                                            -48,
                                            0
                                        ],
                                        "imageId": "346698558",
                                        "uniqueId": "346698568"
                                    }
                                ],
                                "effectType": "Printing",
                                "tags": [
                                    "Background"
                                ]
                            },
                            {
                                "display": true,
                                "description": "設計層（自由元素）",
                                "readOnly": false,
                                "_id": 50776843,
                                "clazz": "Layer",
                                "items": [],
                                "effectType": "Printing",
                                "tags": [
                                    "Design"
                                ]
                            },
                            {
                                "display": true,
                                "description": "前景層",
                                "readOnly": true,
                                "_id": 50776840,
                                "clazz": "Layer",
                                "items": [],
                                "effectType": "Printing",
                                "tags": [
                                    "Foreground"
                                ]
                            },
                            {
                                "display": true,
                                "description": "定制-品紅色出血縣",
                                "readOnly": true,
                                "_id": 19198324,
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "clazz": "ShapeObject",
                                        "_id": 50776637,
                                        "readOnly": false,
                                        "tags": [],
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "shape": {
                                            "clazz": "Path",
                                            "d": "M0 0 L195.8173 0 L195.8173 266.6835 L0 266.6835 L0 0",
                                            "_id": "50776633"
                                        },
                                        "strokeStyle": {
                                            "clazz": "SolidColorStroke",
                                            "color": 9502720,
                                            "width": 1,
                                            "dash": []
                                        }
                                    }
                                ],
                                "tags": [
                                    "Builder-Bleeds"
                                ]
                            },
                            {
                                "display": true,
                                "description": "定制-灰色刀線",
                                "readOnly": true,
                                "_id": 19198340,
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "clazz": "ShapeObject",
                                        "_id": 50893734,
                                        "readOnly": false,
                                        "tags": [],
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "shape": {
                                            "clazz": "Path",
                                            "d": "M17.1213 8.6173 L178.6961 8.6173 C183.3927 8.6173 187.2 12.4247 187.2 17.1213 L187.2 249.5622 C187.2 254.2588 183.3927 258.0661 178.6961 258.0661 L17.1213 258.0661 L17.1213 258.0661 C12.4247 258.0661 8.6173 254.2588 8.6173 249.5622 L8.6173 17.1213 C8.6173 12.4247 12.4247 8.6173 17.1213 8.6173",
                                            "_id": "50893731"
                                        },
                                        "strokeStyle": {
                                            "clazz": "SolidColorStroke",
                                            "color": "15073298",
                                            "width": 1,
                                            "dash": []
                                        }
                                    }
                                ],
                                "tags": [
                                    "Builder-Cut"
                                ]
                            },
                            {
                                "display": true,
                                "description": "定制-安全線",
                                "readOnly": true,
                                "_id": 50776727,
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "clazz": "ShapeObject",
                                        "_id": 50893739,
                                        "readOnly": false,
                                        "tags": [],
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "shape": {
                                            "clazz": "Path",
                                            "d": "M19.9559 15.7039 L175.8614 15.7039 C178.2097 15.7039 180.1134 17.6076 180.1134 19.9559 L180.1134 246.7276 C180.1134 249.0759 178.2097 250.9795 175.8614 250.9795 L19.9559 250.9795 C17.6076 250.9795 15.7039 249.0759 15.7039 246.7276 L15.7039 19.9559 C15.7039 17.6076 17.6076 15.7039 19.9559 15.7039",
                                            "_id": "50893738"
                                        },
                                        "strokeStyle": {
                                            "clazz": "SolidColorStroke",
                                            "color": "13172864",
                                            "width": 1,
                                            "dash": [
                                                6,
                                                4
                                            ]
                                        }
                                    }
                                ],
                                "tags": [
                                    "Safe"
                                ]
                            },
                            {
                                "display": true,
                                "description": "出血位遮罩圖（透明度由功能決定）",
                                "readOnly": true,
                                "_id": 50776866,
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "clazz": "Image",
                                        "_id": 50776867,
                                        "readOnly": false,
                                        "alpha": 0.4,
                                        "tags": [],
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "printFile": "",
                                        "imageName": "4211be7ad85cc6fb5981970025a5b5d9.svg",
                                        "imageWidth": 196,
                                        "imageHeight": 267
                                    }
                                ],
                                "tags": [
                                    "Mask"
                                ]
                            },
                            {
                                "display": false,
                                "description": "固定文字信息",
                                "readOnly": true,
                                "_id": 50776923,
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "clazz": "Image",
                                        "_id": 50777409,
                                        "readOnly": false,
                                        "tags": [],
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "printFile": "",
                                        "imageName": "25b7c6e3ea25f5bbbe9be053f0c06e21.svg",
                                        "imageWidth": 196,
                                        "imageHeight": 267
                                    }
                                ],
                                "tags": [
                                    "FixedText"
                                ]
                            }
                        ],
                        "pageContentSchemaId": "182189299",
                        "sortIndex": 0,
                        "pageContentSchemaRuntimeId": "346698481",
                        "isNeedPreset": false,
                        "structVersion": 3
                    }
                ],
                "pageContentQty": 10,
                "mappingIndex": [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9
                ],
                "sort": 1,
                "designMethod": "RANDOM",
                "photoLibIds": [346714770]
            },
            {
                "_id": "346698598",
                "name": "卡牌 正面",
                "pageContents": [
                    {
                        "_id": "346714179",
                        "idReference": "PageContent",
                        "clazz": "com.qpp.cgp.domain.bom.runtime.PageContent",
                        "createdDate": 1769591305481,
                        "createdBy": "47304273",
                        "modifiedDate": 1769591305484,
                        "index": "0",
                        "code": "Card_Front",
                        "name": "卡牌 正面",
                        "width": 196,
                        "height": 267,
                        "layers": [
                            {
                                "display": true,
                                "description": "背景層",
                                "readOnly": false,
                                "_id": 50775437,
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "clazz": "Picture",
                                        "_id": 50775447,
                                        "readOnly": false,
                                        "tags": [],
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "printFile": "3d0659ac95b8f2b09a944eb54f4018c5.jpg",
                                        "imageName": "3d0659ac95b8f2b09a944eb54f4018c5.jpg",
                                        "originalName": "3d0659ac95b8f2b09a944eb54f4018c5.jpg",
                                        "originalWidth": 235,
                                        "originalHeight": 215,
                                        "imageWidth": 292,
                                        "imageHeight": 267,
                                        "contentTransform": [
                                            1,
                                            0,
                                            0,
                                            1,
                                            -48,
                                            0
                                        ],
                                        "imageId": "346698525",
                                        "uniqueId": "346698535"
                                    }
                                ],
                                "effectType": "Printing",
                                "tags": [
                                    "Background"
                                ]
                            },
                            {
                                "display": true,
                                "description": "設計層（自由元素）",
                                "readOnly": false,
                                "_id": 50775430,
                                "clazz": "Layer",
                                "items": [],
                                "effectType": "Printing",
                                "tags": [
                                    "Design"
                                ]
                            },
                            {
                                "display": true,
                                "description": "前景層",
                                "readOnly": true,
                                "_id": 50775424,
                                "clazz": "Layer",
                                "items": [],
                                "effectType": "Printing",
                                "tags": [
                                    "Foreground"
                                ]
                            },
                            {
                                "display": true,
                                "description": "定制-品红色出血縣",
                                "readOnly": true,
                                "_id": 19198324,
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "clazz": "ShapeObject",
                                        "_id": 50774336,
                                        "readOnly": false,
                                        "tags": [],
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "shape": {
                                            "clazz": "Path",
                                            "d": "M0 0 L195.8173 0 L195.8173 266.6835 L0 266.6835 L0 0",
                                            "_id": "50774002"
                                        },
                                        "strokeStyle": {
                                            "clazz": "SolidColorStroke",
                                            "color": 9502720,
                                            "width": 1,
                                            "dash": []
                                        }
                                    }
                                ],
                                "tags": [
                                    "Builder-Bleeds"
                                ]
                            },
                            {
                                "display": true,
                                "description": "定制-灰色刀線",
                                "readOnly": true,
                                "_id": 50774736,
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "clazz": "ShapeObject",
                                        "_id": 50893621,
                                        "readOnly": false,
                                        "tags": [],
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "shape": {
                                            "clazz": "Path",
                                            "d": "M17.1213 8.6173 L178.6961 8.6173 C183.3927 8.6173 187.2 12.4247 187.2 17.1213 L187.2 249.5622 C187.2 254.2588 183.3927 258.0661 178.6961 258.0661 L17.1213 258.0661 L17.1213 258.0661 C12.4247 258.0661 8.6173 254.2588 8.6173 249.5622 L8.6173 17.1213 C8.6173 12.4247 12.4247 8.6173 17.1213 8.6173",
                                            "_id": "50893619"
                                        },
                                        "strokeStyle": {
                                            "clazz": "SolidColorStroke",
                                            "color": "15073298",
                                            "width": 1,
                                            "dash": []
                                        }
                                    }
                                ],
                                "tags": [
                                    "Builder-Cut"
                                ]
                            },
                            {
                                "display": true,
                                "description": "定制-安全線",
                                "readOnly": true,
                                "_id": 50775419,
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "clazz": "ShapeObject",
                                        "_id": 50893714,
                                        "readOnly": false,
                                        "tags": [],
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "shape": {
                                            "clazz": "Path",
                                            "d": "M19.9559 15.7039 L175.8614 15.7039 C178.2097 15.7039 180.1134 17.6076 180.1134 19.9559 L180.1134 246.7276 C180.1134 249.0759 178.2097 250.9795 175.8614 250.9795 L19.9559 250.9795 C17.6076 250.9795 15.7039 249.0759 15.7039 246.7276 L15.7039 19.9559 C15.7039 17.6076 17.6076 15.7039 19.9559 15.7039",
                                            "_id": "50893682"
                                        },
                                        "strokeStyle": {
                                            "clazz": "SolidColorStroke",
                                            "color": "13172864",
                                            "width": 1,
                                            "dash": [
                                                6,
                                                4
                                            ]
                                        }
                                    }
                                ],
                                "tags": [
                                    "Safe"
                                ]
                            },
                            {
                                "display": true,
                                "description": "出血位遮罩圖（透明度由功能決定）",
                                "readOnly": true,
                                "_id": 50775450,
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "clazz": "Image",
                                        "_id": 50775454,
                                        "readOnly": false,
                                        "alpha": 0.4,
                                        "tags": [],
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "printFile": "",
                                        "imageName": "4211be7ad85cc6fb5981970025a5b5d9.svg",
                                        "imageWidth": 196,
                                        "imageHeight": 267
                                    }
                                ],
                                "tags": [
                                    "Mask"
                                ]
                            },
                            {
                                "display": false,
                                "description": "固定文字信息",
                                "readOnly": true,
                                "_id": 50775457,
                                "clazz": "Layer",
                                "items": [
                                    {
                                        "clazz": "Image",
                                        "_id": 50775460,
                                        "readOnly": false,
                                        "tags": [],
                                        "x": 0,
                                        "y": 0,
                                        "width": 196,
                                        "height": 267,
                                        "printFile": "",
                                        "imageName": "5131acb533a2ec2f156ccca4d44be70f.svg",
                                        "imageWidth": 196,
                                        "imageHeight": 267
                                    }
                                ],
                                "tags": [
                                    "FixedText"
                                ]
                            }
                        ],
                        "pageContentSchemaId": "182189296",
                        "sortIndex": 0,
                        "pageContentSchemaRuntimeId": "346698480",
                        "isNeedPreset": false,
                        "structVersion": 3
                    }
                ],
                "pageContentQty": 10,
                "mappingIndex": [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9
                ],
                "sort": 0,
                "designMethod": "RANDOM",
                "photoLibIds": [346714769, 346714768]
            }
        ];*/

        var controller = this,
            newType = controller.getRandomCardType(materialViews),
            result = controller.getRandomCardDataConversion(newType, materialViews);

        return result;
    },

    // 单行预览数与图片大小
    previewImageQtyAndImageSizeFun: function (columnQty, fitMode) {
        return {
            eventId: JSGetUUID(),
            type: 'qp.builder.production.updateView',
            single: 'qtyAndSize',
            columnQty: columnQty,
            fitMode: fitMode //auto
        }
    },

    // 预览图片
    previewImageFun: function (previewMode) {
        return {
            eventId: JSGetUUID(),
            type: 'qp.builder.production.changeSortModel',
            sortModel: previewMode
        }
    },

    // 集合初始化数据
    mainQueryFun: function (compItem, type, sign) {
        var controller = this,
            result = [],
            mergeData = {};

        // 完整数据
        compItem.forEach(item => {
            if (item.name) {
                const value = item.diyGetValue();
                // 当循环到中间颜色栏时 和 左边的选中栏
                if (['centerColor', 'leftSingleSelect'].includes(item.itemId)) {
                    result = Ext.Array.merge(result, value)
                } else {
                    result.push(item.diyGetValue())
                }
            }
        })

        //单请求时
        if (!Ext.isEmpty(sign)) {
            var newResult = [],
                {nameArray} = sign;

            result.forEach(item => {
                const {single} = item;
                nameArray.forEach(arrayItem => {
                    if (JSON.stringify(single) === JSON.stringify(arrayItem)) {
                        newResult.push(item);
                    }
                })
            })

            result = newResult;
        }

        return {
            eventId: JSGetUUID(),
            type: 'qp.builder.production.' + type,
            operations: result
        }
    },

    // 向iframe中传递数据
    callChild: function (data, callFn) {
        var controller = this,
            isCount = false,
            builderView = document.getElementById('builderView'),
            authIframe = builderView.getElementsByTagName('iframe')[0];

        console.log(data);
        authIframe.contentWindow.postMessage(JSON.stringify(data), '*');

        controller.getIframeInfoFn('事件请求超时,请重试!', function (e, loadTime) {
            let data = e.data;
            typeof data === 'string' && (data = JSON.parse(data));

            if (!isCount && data?.type === 'qp.builder.production.afterViewChanged' && data?.args) {
                callFn();
                isCount = true;
            }

            clearTimeout(loadTime);
            if (data?.args === false && data?.type) {
                const error = {
                    'qp.builder.production.onInit': function () {
                        Ext.Msg.alert('提示', '程序初始化失败', function () {
                            callFn();
                        });
                    },
                    'qp.builder.production.afterChecked': function () {
                        Ext.Msg.alert('提示', '检查数据格式失败', function () {
                            callFn();
                        });
                    },
                    'qp.builder.production.onViewChange': function () {
                        Ext.Msg.alert('提示', '页面初始化失败', function () {
                            callFn();
                        });
                    },
                    'qp.builder.production.afterViewChanged': function () {
                        Ext.Msg.alert('提示', '页面初始化未完成', function () {
                            callFn();
                        });
                    },
                }
                error[data.type]();
            }
        }, 20000)
    },

    // 接收iframe信息
    getIframeInfoFn: function (text, callBack, overTime) {
        // 设置加载超时处理
        var loadTime = setTimeout(() => {
            JSSetLoading(false);
            Ext.Msg.alert('提示', text, function () {
                location.reload();
            });
        }, overTime)

        window.addEventListener('message', function (e) {
            try {
                // 清理超时定时器
                callBack && callBack(e, loadTime);
            } catch (error) {
                console.log(error);
            }
        });
    },

    // 设置工具栏遮罩层
    setToolsMark: function (loadMask, isShow) {
        isShow ? loadMask.show() : loadMask.hide();
    },

    // 监听窗口大小
    onWindowResize: function (callFn) {
        Ext.EventManager.onWindowResize(function (width, height) {
            callFn(width, height);
        });
    },

    // 验证双数正整数
    isEvenPositiveInteger: function (value) {
        return typeof value === 'number' &&
            Number.isInteger(value) &&
            value > 0 &&
            value % 2 === 0;
    },

    // 添加换行符
    addLineBreaks: function (data) {
        function addLineBreaksAndConvertToString(obj) {
            const keys = Object.keys(obj);
            const result = keys.map(key => `${key}: ${JSON.stringify(obj[key])}`).join('<br>');
            return result;
        }

        return data.map((item, index) => {
            const prefox = index + 1 + '. '
            return `${prefox}{<br>${JSON.stringify(addLineBreaksAndConvertToString(item))}<br>}<br>`;
        }).join('<br>');
    },
});