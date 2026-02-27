/**
 * Created by nan on 2019/8/21.
 */
Ext.define('CGP.order.view.cgpplaceorder.controller.Controller', {
    /**
     * 自定义的上传文件,
     * 因为时异步请求,如果同时传多张同一文件，会报错
     */
    uploadFiles: function (panel) {
        if (panel.rendered == true) {
            //panel.el.mask('上传中..');
            var cgpFormData = new FormData();
            for (var i = 0; i < panel.fileArray.length; i++) {
                cgpFormData.append("files", panel.fileArray[i]);
            }
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (event) {
                if (this.readyState == 4) {
                   ;
                    // panel.el.unmask();
                    if (event.currentTarget.status == 200) {
                        var responseText = event.currentTarget.responseText;
                        var responseData = Ext.JSON.decode(responseText);
                        panel.fireEvent('uploadFilesSuccess', {
                            success: true,
                            data: {
                                files: responseData.data,
                                materialViewType: panel.materialViewType,
                                productMaterialViewType: panel.productMaterialViewType,
                                pageContentSchemaId: panel.materialViewType.pageContentSchema._id
                            }
                        });
                    } else {
                        var item = panel;
                        item.fireEvent('uploadFilesSuccess', {
                            success: false,
                            data: {
                                message: item.title + '上传图片失败'
                            }
                        })
                    }
                }
            };
            xhr.open("POST", adminPath + 'api/files');
            xhr.setRequestHeader('Authorization', 'Bearer ' + Ext.util.Cookies.get('token'));
            xhr.setRequestHeader('Accept', '*/*');
            setTimeout(function () {
                xhr.send(cgpFormData);
            }, 100)
        }
    },
    /**
     * 获取到PageContentSchema
     * @param pageContentSchemaId
     */
    getPageContentSchema: function (pageContentSchemaId) {
        var me = this;
        var pageContentSchema = {};
        Ext.Ajax.request({
            url: adminPath + 'api/pageContentSchemas/' + pageContentSchemaId,
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            async: false,
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    pageContentSchema = responseMessage.data;

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
        return pageContentSchema;
    },
    /**
     * 根据pcs生成pc
     * @param pageContentSchemaId
     * @param files
     */
    createPageContent: function (pageContentSchema, files) {
        var result = [];
        var pageContent = Ext.JSON.decode(Ext.JSON.encode(pageContentSchema));//转码解码一遍，使不会指向原来的对象
        delete pageContent._id;
        delete pageContent.modifiedDate;
        delete pageContent.modifiedBy;
        delete pageContent.pageContentItemPlaceholders;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            pageContent.length = file.length;
            pageContent.width = file.width;
            pageContent.clazz = 'com.qpp.cgp.domain.bom.runtime.PageContent';
            pageContent.layers = [];
            pageContent.layers.push({
                "items": [
                    {
                        "x": 0,
                        "y": 0,
                        "rotation": 0,
                        "width": file.width,
                        "height": file.length,
                        "imageName": file.name.replace('pdf', 'png'),
                        "printFile": file.name,
                        "clazz": "Picture"
                    }
                ],
                "clazz": "Layer"
            })
            Ext.Ajax.request({
                url: adminPath + 'api/pageContents',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                async: false,
                jsonData: pageContent,
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        result.push(responseMessage.data._id);
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            });
        }
        return result;
    },
    /**
     *
     * @param pageContentDataArr
     * @returns {*}
     */
    buildProductInstance: function (pageContentDataArr, tab) {
        var controller = this;
        var jsonData = {
            "_id": JSGetCommonKey() + '',
            "productId": tab.productId + '',
            "productConfigViewId": tab.productConfig.productConfigView.id + '',
            "material": {
                "_id": tab.productConfig.productConfigBom.productMaterialId + '',
                "clazz": "com.qpp.cgp.domain.bom.MaterialSpu"
            },
            "productConfigBomId": tab.productConfig.productConfigBom.id + '',
            "productConfigDesignId": tab.productConfig.productConfigDesign.id + '',
            "productConfigImpositionId": tab.productConfig.productConfigImposition.id + '',
            "productMaterialViews": [],
            "photos": [],
            "clazz": "com.qpp.cgp.domain.bom.runtime.ProductInstance"
        };
        console.log(jsonData);
        var photos = [];
        for (var i = 0; i < pageContentDataArr.length; i++) {
            var item = {
                "_id": JSGetCommonKey() + '',
                "clazz": "com.qpp.cgp.domain.bom.runtime.ProductMaterialView",
                "productMaterialViewType": {
                    "_id": pageContentDataArr[i].productMaterialViewType._id + '',
                    "idReference": "ProductMaterialViewType",
                    "clazz": "com.qpp.cgp.domain.bom.ProductMaterialViewType"
                },
                "materialViewType": {
                    "_id": pageContentDataArr[i].materialViewType._id + '',
                    "idReference": "MaterialViewType",
                    "clazz": "com.qpp.cgp.domain.bom.MaterialViewType"
                },
                "materialPath": pageContentDataArr[i].productMaterialViewType.materialPath,
                "pageContents": []
            };
            for (var j = 0; j < pageContentDataArr[i].pageContentArr.length; j++) {
                item.pageContents.push({
                    "_id": pageContentDataArr[i].pageContentArr[j] + '',
                    "idReference": "PageContent",
                    "clazz": "com.qpp.cgp.domain.bom.runtime.PageContent"
                })
            }
            jsonData.productMaterialViews.push(item);
            photos.push({
                materialViewTypeId: pageContentDataArr[i].materialViewType._id + '',
                productMaterialViewTypeId: pageContentDataArr[i].productMaterialViewType.productMaterialViewTypeId + '',
                productMaterialViewType_id: pageContentDataArr[i].productMaterialViewType._id + '',
                files: pageContentDataArr[i].files,
                width: pageContentDataArr[i].width,
                height: pageContentDataArr[i].height
            })
        }
        jsonData.photos = photos;//记录上传的图片
        var result = null;
        result = controller.createProductInstance(jsonData);
        return result;
    },
    /**
     *
     * @param productId
     * @returns {*}
     */
    getProductInfo: function (productId) {
        var result = null;
        Ext.Ajax.request({
            url: adminPath + "api/products/" + productId,
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    result = responseMessage.data;
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
        return result;

    },
    /**
     * 使用cookie来跨iframe存储数据
     * @param productInstance
     */
    createDiyOrderItem: function (productInstance) {
        var controller = this;
        var cgpOrderItemArr = Ext.JSON.decode(Ext.util.Cookies.get('cgpOrderItemArr')) || [];
        var productInfo = controller.getProductInfo(productInstance.productId)
        var item = {
            thumbnail: productInstance.thumbnail,
            qty: 1,
            canEdit: productInstance.productMaterialViews.length > 0,//是否有需要定制的页面
            productInstanceId: productInstance._id,
            productId: productInstance.productId,
            productInfo: {
                ProductId: productInfo.id,
                price: productInfo.salePrice,
                name: productInfo.model,
                sku: productInfo.sku,
                model: productInfo.model
            }
        }
        cgpOrderItemArr.push(item);
        Ext.util.Cookies.set('cgpOrderItemArr', Ext.JSON.encode(cgpOrderItemArr));
    },
    /**
     *
     * @param lineItems
     */
    createNewOrder: function (bindOrderNumbers, lineItems, address, orderSource, panel) {
        panel.up('viewport').el.mask('创建中..');
        var jsonData = {
            "bindOrderNumbers": [
                "111"
            ],
            "orderCommnet": "test123",
            "lineItems": lineItems,
            "deliveryAddress": address,
            'salesSourceInfo': orderSource
        };
        Ext.Ajax.request({
            url: adminPath + 'api/insideOrders',
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: jsonData,
            success: function (response) {
                panel.up('viewport').el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    var orderId = responseMessage.data.id;
                    var statusId = responseMessage.data.status.id;
                    Ext.Msg.confirm(i18n.getKey('prompt'), '成功生成订单：'
                        + responseMessage.data.orderNumber + '<br>' + '是否查看订单详情？',
                        function (select) {
                            if (select == 'yes') {
                                JSOpen({
                                    id: 'orderDetails',
                                    refresh: true,
                                    url: path + 'partials/orderitemsmultipleaddress/main.html?id=' + orderId + '&status=' + statusId+ '&orderNumber=' + orderNumber,
                                    title: i18n.getKey('orderDetails')
                                })
                            }
                        });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                panel.up('viewport').el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    /**
     *  获取指定产品实例
     * @param productInstanceId
     */
    getProductInstance: function (productInstanceId) {
        var result = null;
        Ext.Ajax.request({
            url: adminPath + 'api/bom/productInstances/' + productInstanceId + '/V2?includeReferenceEntity=true&includeMaterialReferenceEntity=true',
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    result = responseMessage.data;
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
        return result;
    },
    /**
     * 创建产品实例
     */
    createProductInstance: function (jsonData) {
        var result = null;
        Ext.Ajax.request({
            url: adminPath + 'api/bom/productInstances',
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            async: false,
            jsonData: jsonData,
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    result = responseMessage.data;
                    console.log(responseMessage.data)
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
        return result;
    },
    /**
     * 根据产品是否需要定制跳转不同页面
     */
    jumpOtherPage: function (productId) {
        //获取最新的产品配置
        var controller = this;
        var productConfig = null;
        Ext.Ajax.request({
            url: adminPath + 'api/productConfigs/' + productId + '/latest?context=PC',
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                console.log(responseMessage)
                if (responseMessage.success) {
                    productConfig = responseMessage.data;
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
        if (productConfig) {
            var productMaterialViewTypes = productConfig.libraries.productMaterialViewTypes;
            if (productMaterialViewTypes && productMaterialViewTypes.length > 0) {
                //有需要定制页面
                var placeOrderOutTab = Ext.getCmp('placeOrderOutTab');
                var diyPmvtPanel = placeOrderOutTab.getComponent('diyPmvtPanel');
                placeOrderOutTab.remove(diyPmvtPanel);
                var outPanel = Ext.create('CGP.order.view.cgpplaceorder.view.OutPanel', {
                    itemId: 'diyPmvtPanel',
                    productMaterialViewTypes: productMaterialViewTypes,
                    materialViewTypes: productConfig.libraries.materialViewTypes,
                    productConfig: productConfig,
                    productId: productId
                });
                var centerPanel = Ext.create('Ext.panel.Panel', {
                    itemId: 'centerPanel',
                    region: 'center',
                    layout: 'fit',
                    flex: 1,
                });
                var leftPanel = Ext.create('CGP.order.view.cgpplaceorder.view.LeftTreePanel', {
                    productMaterialViewTypes: productMaterialViewTypes,
                    materialViewTypes: productConfig.libraries.materialViewTypes,
                    productConfig: productConfig,
                    itemId: 'leftTreePanel',
                    productId: productId,
                });
                outPanel.add([leftPanel, centerPanel]);
                placeOrderOutTab.add(outPanel);
                placeOrderOutTab.setActiveTab(outPanel);
            } else {//无需要定制的页面
                var jsonData = {
                    "_id": JSGetCommonKey() + '',
                    "productId": productId + '',
                    "productConfigViewId": productConfig.productConfigView.id + '',
                    "material": {
                        "_id": productConfig.productConfigBom.productMaterialId + '',
                        "clazz": "com.qpp.cgp.domain.bom.MaterialSpu"
                    },
                    "productConfigImpositionId": productConfig.productConfigImposition.id + '',
                    "productMaterialViews": [],
                    "photos": [],
                    "clazz": "com.qpp.cgp.domain.bom.runtime.ProductInstance"
                };
                //新建产品实例
                var productInstance = controller.createProductInstance(jsonData);
                controller.createDiyOrderItem(productInstance);
                var placeOrderOutTab = Ext.getCmp('placeOrderOutTab');
                var orderItemGrid = placeOrderOutTab.getComponent('orderItemGrid');
                orderItemGrid.refreshData();
            }
        }

    }
})
