/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.define('CGP.orderitemsmultipleaddress.controller.Controller', {
    //修改
    editQuery: function (url, jsonData, isEdit) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, true, jsonData, successMsg, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
                    console.log(data);
                }
            }
        }, true);
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, Msg, attributeVersionId) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess',
            newMsg = Msg || successMsg;

        JSAjaxRequest(url, method, true, jsonData, newMsg, callFn, true, attributeVersionId);
    },

    //查询
    getQuery: function (url) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
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

    getShipmentRequirementsInfo: function (orderNumber) {
        var controller = this,
            url = adminPath + 'api/shipmentRequirements?page=1&limit=10000&filter=' + Ext.JSON.encode([
                {
                    "name": "orderNumber",
                    "operator": "exactMatch",
                    "value": `${orderNumber}`,
                    "type": "string"
                },
                {
                    "name": "customerProperty",
                    "value": "%United States%",
                    "type": "string"
                }
            ]),
            queryData = controller.getQuery(url);

        return queryData;
    },

    // 获取报关Id
    getCustomsDeclarationIds: function (arr, customsDeclarationTypeId) {
        var arrStr = [];
        Ext.Array.each(arr, function (item) {
            Ext.Array.each(item.items, function (itema) {
                var {orderItem} = itema,
                    {_id, alternativeCustomCategoryIds} = orderItem;

                // 过滤存在该选项的订单项
                if (alternativeCustomCategoryIds?.includes(customsDeclarationTypeId)) {
                    arrStr.push(_id);
                }
            });
        });
        return arrStr;
    },

    // 获取美国地址订单项
    getUnitedStatesOrderItemInfo: function (orderId) {
        var controller = this,
            url = adminPath + `api/orders/${orderId}/lineItems/v2?page=1&limit=10000&filter=` + Ext.JSON.encode([
                {
                    "name": "customerProperty",
                    "value": `%United States%`,
                    "type": "string"
                }
            ]),
            queryData = controller.getQuery(url);

        return queryData;
    },

    // 获取报关Id
    getCustomsDeclarationIdsV2: function (arr, customsDeclarationTypeId) {
        var arrStr = [];
        arr.forEach(item => {
            var {_id, customsCategoryDTOList} = item,
                alternativeCustomCategoryIds = customsCategoryDTOList?.map(listItem => {
                    return listItem['_id']
                })

            // 过滤存在该选项的订单项
            if (alternativeCustomCategoryIds?.includes(customsDeclarationTypeId)) {
                arrStr.push(_id);
            }
        });
        return arrStr;
    },

    //获取修改报关数据
    getCustomsDeclarationResult: function (customsDeclarationIds, customsDeclarationTypeId) {
        var controller = this,
            result = [];
        customsDeclarationIds.forEach(item => {
            result.push({
                orderLineItemId: item,
                customCategoryId: customsDeclarationTypeId
            })
        })
        return result;
    },
    // 创建批量报关分类
    createCustomsCategory: function (gridParams) {
        var controller = this,
            mainRenderer = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            {
                order,
                store,
                originStore
            } = gridParams,
            orderId = order.get('_id');

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            width: 1000,
            minHeight: 400,
            maxHeight: 600,
            title: i18n.getKey('批量报关分类'),
            items: [
                {
                    xtype: 'grid',
                    itemId: 'grid',
                    store: store,
                    columns: [
                        {
                            text: i18n.getKey('订单项序号'),
                            dataIndex: 'seqNo',
                            align: 'center',
                            width: 120,
                        },
                        {
                            dataIndex: 'productImageUrl',
                            text: i18n.getKey('image'),
                            xtype: 'componentcolumn',
                            width: 140,
                            renderer: function (value, metadata, record) {
                                var thumbnailInfo = record.get('thumbnailInfo');
                                var status = thumbnailInfo?.status;
                                var thumbnail = thumbnailInfo?.thumbnail;
                                if (['', undefined].includes(thumbnail) && !['FAILURE', 'RUNNING'].includes(status)) {
                                    status = 'NULL'
                                }
                                var statusGather = {
                                    SUCCESS: function () {
                                        return '查看图片';
                                    },
                                    FAILURE: function () {
                                        return '图片生成失败';
                                    },
                                    INIT: function () {
                                        return '查看图片';
                                    },
                                    RUNNING: function () {
                                        return '图片正在生成中';
                                    },
                                    NULL: function () {
                                        return '图片为空';
                                    }
                                }
                                metadata.tdAttr = `data-qtip=${statusGather[status]()}`
                                return mainRenderer.rendererImage(value, metadata, record, {
                                    changeUserDesignBtn: false,
                                    builderPageBtn: false,
                                    customsCategoryBtn: false,
                                    viewUserStuffBtn: false,
                                    buildPreViewBtn: false,
                                    contrastImgBtn: false,
                                    builderCheckHistoryBtn: false
                                });
                            }
                        },
                        {
                            dataIndex: 'productName',
                            text: i18n.getKey('product') + ' | ' + i18n.getKey('material'),
                            width: 300,
                            renderer: function (value, metadata, record) {
                                return mainRenderer.renderProductInfo(value, metadata, record);
                            }
                        },
                        {
                            xtype: 'componentcolumn',
                            dataIndex: 'customsCategoryDTOList',
                            text: i18n.getKey('报关分类'),
                            flex: 1,
                            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                                var oneValue = value[0],
                                    storeData = store.proxy.data,
                                    id = record.get('_id'),
                                    productSku = record.get('productSku'),
                                    isCustomsClearance = record.get('isCustomsClearance'),
                                    customsCategoryId = record.get('customsCategoryId'),
                                    _id = oneValue?._id,
                                    grid = view.ownerCt

                                storeData.forEach(item => {
                                    if (!item['customsCategoryId']) {
                                        item['customsCategoryId'] = (customsCategoryId || _id);
                                    }
                                })

                                if (isCustomsClearance) {
                                    return {
                                        xtype: 'uxfieldcontainer',
                                        itemId: 'container_' + record.getId(),
                                        layout: 'hbox',
                                        productSku: productSku,
                                        diySetValue: function (data) {
                                            var me = this,
                                                customsCategoryDTOList = me.getComponent('customsCategoryDTOList');
                                            customsCategoryDTOList.setValue(data);
                                        },
                                        diyGetValue: function () {
                                            var me = this,
                                                customsCategoryDTOList = me.getComponent('customsCategoryDTOList'),
                                                value = customsCategoryDTOList.getValue();

                                            return {
                                                orderLineItemId: id,
                                                customCategoryId: value
                                            }
                                        },
                                        items: [
                                            {
                                                xtype: 'combo',
                                                name: 'customsCategoryDTOList',
                                                itemId: 'customsCategoryDTOList',
                                                valueField: '_id',
                                                displayField: 'outName',
                                                editable: false,
                                                allowBlank: false,
                                                width: 200,
                                                margin: '0 5 0 10',
                                                store: {
                                                    fields: [
                                                        '_id', 'outName'
                                                    ],
                                                    data: value
                                                },
                                                listeners: {
                                                    afterrender: function (field) {
                                                        field.setValue(customsCategoryId || _id);
                                                    },
                                                    change: function (field, newValue, oldValue) {
                                                        var storeData = store.proxy.data,
                                                            recordIndex = storeData.findIndex(item => item['_id'] === id);

                                                        storeData[recordIndex]['customsCategoryId'] = newValue;
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'button',
                                                componentCls: "btnOnlyIcon",
                                                margin: '0 5 0 5',
                                                text: JSCreateFont('blue', false, i18n.getKey('同步到相同SKU'), 12, false, true),
                                                tooltip: '将当前订单项的选项同步到,该订单列表内所有相同sku的订单项的报关分类',
                                                //原方法是无分页 通过组件修改选项
                                                /*handler: function (btn) {
                                                    var container = btn.ownerCt,
                                                        storeData = store.proxy.data,
                                                        customsCategoryDTOList = container.getComponent('customsCategoryDTOList'),
                                                        value = customsCategoryDTOList.getValue(),
                                                        containers = grid.query('uxfieldcontainer');

                                                    containers.forEach(item => {
                                                        var targetProductSku = item.productSku;
                                                        if (targetProductSku === productSku) {
                                                            item.diySetValue(value);
                                                        }
                                                    })

                                                }*/
                                                //现在需要通过数据 修改选项
                                                handler: function (btn) {
                                                    var container = btn.ownerCt,
                                                        storeData = Ext.clone(store.proxy.data),
                                                        customsCategoryDTOList = container.getComponent('customsCategoryDTOList'),
                                                        value = customsCategoryDTOList.getValue();

                                                    storeData.forEach(item => {
                                                        if (item['productSku'] === productSku) {
                                                            item['customsCategoryId'] = value;
                                                        }
                                                    })

                                                    store.proxy.data = storeData;
                                                    store.load();
                                                }
                                            }
                                        ]
                                    }
                                } else {
                                    return '无需报关'
                                }
                            },
                        }
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: store,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyText: i18n.getKey('noDat'),
                    }
                }
            ],
            loadStore: function () {
                var queryData = controller.getCustomsCategoryListData(orderId);

                store.proxy.data = queryData;
                store.load();
            },
            bbar: {
                xtype: 'bottomtoolbar',
                lastStepBtnCfg: {
                    text: i18n.getKey('一键报关美国彩卡'),
                    iconCls: 'icon_save',
                    hidden: false,
                    tooltip: '临时使用,仅报关拥有彩卡选项的美国地址订单项!',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            customsDeclarationTypeId = '931703', //彩卡
                            url = adminPath + 'api/orderItems/checkCustomsCategories',
                            unitedStatesOrderItemInfo = controller.getUnitedStatesOrderItemInfo(orderId),
                            customsDeclarationIds = controller.getCustomsDeclarationIdsV2(unitedStatesOrderItemInfo, customsDeclarationTypeId),
                            customsDeclarationResult = controller.getCustomsDeclarationResult(customsDeclarationIds, customsDeclarationTypeId);

                        if (customsDeclarationResult?.length) {
                            controller.asyncEditQuery(url, customsDeclarationResult, true, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText),
                                        msg = responseText.success ? '报关成功!' : '报关失败!';

                                    Ext.Msg.alert('提示', msg);
                                    win.loadStore();
                                    originStore.load();
                                }
                            }, true)
                        } else {
                            Ext.Msg.alert('提示', '未获取到美国地址订单项!')
                        }
                    }
                },
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            value = controller.getCustomsCategoryValueV2(store.proxy.data);

                        controller.queryCustomsCategory(value, function () {
                            win.close();
                            originStore.load();
                        })
                    }
                }
            },
        }).show();
    },

    // 创建批量报关分类
    createCustomsCategoryV2: function (gridParams) {
        var controller = this,
            mainRenderer = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            {
                order,
                store,
                originStore
            } = gridParams,
            orderId = order.get('_id');

        store.on('beforeload', function () {
            var view = grid.getView();
            if (view && view.scroller) {
                console.log(1);
                view.scroller.suspendEvents();
            }
        });
        store.on('load', function () {
            var view = grid.getView();
            if (view && view.scroller) {
                console.log(2);
                view.scroller.resumeEvents();
            }
        });

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            width: 1000,
            minHeight: 400,
            maxHeight: 600,
            title: i18n.getKey('批量报关分类'),
            items: [
                {
                    xtype: 'grid',
                    itemId: 'grid',
                    store: store,
                    verticalScroller: {
                        xtype: 'bufferedrenderer', // 启用滚动加载插件
                        activePrefetch: true          // 是否预取
                    },
                    loadMask: true,                   // 加载时显示加载提示
                    columns: [
                        {
                            text: i18n.getKey('订单项序号'),
                            dataIndex: 'seqNo',
                            align: 'center',
                            width: 120,
                        },
                        {
                            xtype: 'imagecolumn',
                            tdCls: 'vertical-middle',
                            width: 150,
                            dataIndex: 'thumbnailInfo',
                            text: i18n.getKey('image'),
                            buildUrl: function (value, metadata, record) {
                                var thumbnailInfo = record.get('thumbnailInfo'),
                                    thumbnail = thumbnailInfo?.thumbnail;

                                return projectThumbServer + thumbnail;
                            },
                            buildPreUrl: function (value, metadata, record) {
                                var thumbnailInfo = record.get('thumbnailInfo'),
                                    thumbnail = thumbnailInfo?.thumbnail;

                                return projectThumbServer + thumbnail + '/100/100';
                            },
                            buildTitle: function (value, metadata, record) {
                                if (value) {
                                    var thumbnailInfo = record.get('thumbnailInfo'),
                                        thumbnail = thumbnailInfo?.thumbnail;
                                    return `${i18n.getKey('check')} < ${thumbnail} > 预览图`;
                                }
                            }
                        },

                        /*{
                            dataIndex: 'productImageUrl',
                            text: i18n.getKey('image'),
                            xtype: 'componentcolumn',
                            width: 140,
                            renderer: function (value, metadata, record) {
                                var thumbnailInfo = record.get('thumbnailInfo');
                                var status = thumbnailInfo?.status;
                                var thumbnail = thumbnailInfo?.thumbnail;
                                if (['', undefined].includes(thumbnail) && !['FAILURE', 'RUNNING'].includes(status)) {
                                    status = 'NULL'
                                }
                                var statusGather = {
                                    SUCCESS: function () {
                                        return '查看图片';
                                    },
                                    FAILURE: function () {
                                        return '图片生成失败';
                                    },
                                    INIT: function () {
                                        return '查看图片';
                                    },
                                    RUNNING: function () {
                                        return '图片正在生成中';
                                    },
                                    NULL: function () {
                                        return '图片为空';
                                    }
                                }
                                metadata.tdAttr = `data-qtip=${statusGather[status]()}`
                                return mainRenderer.rendererImage(value, metadata, record, {
                                    changeUserDesignBtn: false,
                                    builderPageBtn: false,
                                    customsCategoryBtn: false,
                                    viewUserStuffBtn: false,
                                    buildPreViewBtn: false,
                                    contrastImgBtn: false,
                                    builderCheckHistoryBtn: false
                                });
                            }
                        },*/
                        {
                            dataIndex: 'productName',
                            text: i18n.getKey('product') + ' | ' + i18n.getKey('material'),
                            width: 300,
                            renderer: function (value, metadata, record) {
                                return mainRenderer.renderProductInfo(value, metadata, record);
                            }
                        },
                        {
                            xtype: 'componentcolumn',
                            dataIndex: 'customsCategoryDTOList',
                            text: i18n.getKey('报关分类'),
                            flex: 1,
                            renderer: function (value, metaData, record, rowIndex, colIndex, gridStore, view) {
                                var oneValue = value[0],
                                    storeData = store.proxy.data,
                                    id = record.get('_id'),
                                    productSku = record.get('productSku'),
                                    isCustomsClearance = record.get('isCustomsClearance'),
                                    customsCategoryId = record.get('customsCategoryId'),
                                    _id = oneValue?._id,
                                    grid = view.ownerCt

                                storeData?.forEach(item => {
                                    if (!item['customsCategoryId']) {
                                        item['customsCategoryId'] = (customsCategoryId || _id);
                                    }
                                })

                                if (isCustomsClearance) {
                                    return {
                                        xtype: 'uxfieldcontainer',
                                        itemId: 'container_' + record.getId(),
                                        layout: 'hbox',
                                        productSku: productSku,
                                        diySetValue: function (data) {
                                            var me = this,
                                                customsCategoryDTOList = me.getComponent('customsCategoryDTOList');
                                            customsCategoryDTOList.setValue(data);
                                        },
                                        diyGetValue: function () {
                                            var me = this,
                                                customsCategoryDTOList = me.getComponent('customsCategoryDTOList'),
                                                value = customsCategoryDTOList.getValue();

                                            return {
                                                orderLineItemId: id,
                                                customCategoryId: value
                                            }
                                        },
                                        items: [
                                            {
                                                xtype: 'combo',
                                                name: 'customsCategoryDTOList',
                                                itemId: 'customsCategoryDTOList',
                                                valueField: '_id',
                                                displayField: 'outName',
                                                editable: false,
                                                allowBlank: false,
                                                width: 200,
                                                margin: '0 5 0 10',
                                                store: {
                                                    fields: [
                                                        '_id', 'outName'
                                                    ],
                                                    data: value
                                                },
                                                listeners: {
                                                    afterrender: function (field) {
                                                        field.setValue(customsCategoryId || _id);
                                                    },
                                                    change: function (field, newValue, oldValue) {
                                                        var storeData = store.proxy.data,
                                                            recordIndex = storeData?.findIndex(item => item['_id'] === id);

                                                        storeData[recordIndex]['customsCategoryId'] = newValue;
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'button',
                                                componentCls: "btnOnlyIcon",
                                                margin: '0 5 0 5',
                                                text: JSCreateFont('blue', false, i18n.getKey('同步到相同SKU'), 12, false, true),
                                                tooltip: '将当前订单项的选项同步到,该订单列表内所有相同sku的订单项的报关分类',
                                                //原方法是无分页 通过组件修改选项
                                                /*handler: function (btn) {
                                                    var container = btn.ownerCt,
                                                        storeData = store.proxy.data,
                                                        customsCategoryDTOList = container.getComponent('customsCategoryDTOList'),
                                                        value = customsCategoryDTOList.getValue(),
                                                        containers = grid.query('uxfieldcontainer');

                                                    containers.forEach(item => {
                                                        var targetProductSku = item.productSku;
                                                        if (targetProductSku === productSku) {
                                                            item.diySetValue(value);
                                                        }
                                                    })

                                                }*/
                                                //现在需要通过数据 修改选项
                                                handler: function (btn) {
                                                    var container = btn.ownerCt,
                                                        storeData = Ext.clone(store.proxy.data),
                                                        customsCategoryDTOList = container.getComponent('customsCategoryDTOList'),
                                                        value = customsCategoryDTOList.getValue();

                                                    storeData.forEach(item => {
                                                        if (item['productSku'] === productSku) {
                                                            item['customsCategoryId'] = value;
                                                        }
                                                    })

                                                    store.proxy.dataChanged = true; // 标记数据改变
                                                    store.proxy.data = storeData;
                                                    store.load();
                                                }
                                            }
                                        ]
                                    }
                                } else {
                                    return ''
                                }
                            },
                        }
                    ],
                    /*bbar: {
                        xtype: 'pagingtoolbar',
                        store: store,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyText: i18n.getKey('noDat'),
                    },*/
                }
            ],
            loadStore: function () {
                var queryData = controller.getCustomsCategoryListData(orderId);

                store.proxy.data = queryData;
                store.load();
            },
            bbar: {
                xtype: 'bottomtoolbar',
                lastStepBtnCfg: {
                    text: i18n.getKey('一键报关美国彩卡'),
                    iconCls: 'icon_save',
                    hidden: false,
                    tooltip: '临时使用,仅报关拥有彩卡选项的美国地址订单项!',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            customsDeclarationTypeId = '931703', //彩卡
                            url = adminPath + 'api/orderItems/checkCustomsCategories',
                            unitedStatesOrderItemInfo = controller.getUnitedStatesOrderItemInfo(orderId),
                            customsDeclarationIds = controller.getCustomsDeclarationIdsV2(unitedStatesOrderItemInfo, customsDeclarationTypeId),
                            customsDeclarationResult = controller.getCustomsDeclarationResult(customsDeclarationIds, customsDeclarationTypeId);

                        if (customsDeclarationResult?.length) {
                            controller.asyncEditQuery(url, customsDeclarationResult, true, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText),
                                        msg = responseText.success ? '报关成功!' : '报关失败!';

                                    Ext.Msg.alert('提示', msg);
                                    win.loadStore();
                                    originStore.load();
                                }
                            }, true)
                        } else {
                            Ext.Msg.alert('提示', '未获取到美国地址订单项!')
                        }
                    }
                },
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            value = controller.getCustomsCategoryValueV2(store.proxy.data);

                        controller.queryCustomsCategory(value, function () {
                            win.close();
                            originStore.load();
                        })
                    }
                }
            },
        }).show();
    },

    //原方法是无分页 通过组件获取报关数据
    getCustomsCategoryValue: function (containers) {
        var result = [];
        containers.forEach(item => {
            result.push(item.diyGetValue())
        })

        return result;
    },

    //现方法通过store数据获取报关数据
    getCustomsCategoryValueV2: function (array) {
        var result = [];

        array.forEach(item => {
            var {_id, customsCategoryId} = item;
            result.push({
                orderLineItemId: _id,
                customCategoryId: customsCategoryId
            })
        })

        return result;
    },

    queryCustomsCategory: function (result, call) {
        var controller = this,
            url = adminPath + 'api/orderItems/checkCustomsCategories';

        /*  controller.asyncEditQuery(url, result, true, function (require, success, response) {
              if (success) {
                  var responseText = Ext.JSON.decode(response.responseText);
                  if (responseText.success) {
                      call && call()
                  }
              }
          }, '批量报关分类成功');*/
        JSAsyncEditQuery(url, result, true, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    call && call()
                }
            }
        }, '批量报关分类成功', {timeout: 120000})
    },

    // 获取订单销售sku数据
    getOrderSellSKUData: function (orderId, isFilterCancelItem) {
        var controller = this,
            url = adminPath + `api/orders/${orderId}/product/Info?filterCancelItem=${isFilterCancelItem}`,
            data = controller.getQuery(url) || [];

        return data;
    },

    // 将数组字符串拷贝到剪贴板
    copyArrayToClipboard: function (stringArray) {
        if (stringArray?.length) {
            // 替换每个字符串中的 </br> 为换行符
            const modifiedArray = stringArray.map(str => str.replace(/<\/br>/g, '\n'));

            // 合并数组中的字符串，使用换行符隔开
            const contentToCopy = modifiedArray.join('\n\n-------------------------------------------------------------\n\n'); // 用两个换行符隔开每个字符串

            // 创建一个临时文本区域以拷贝内容
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = contentToCopy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();

            // 拷贝到剪贴板
            document.execCommand('copy');
            document.body.removeChild(tempTextArea); // 移除临时文本区域

            JSShowNotification({
                type: 'success',
                title: '拷贝成功',
            });
        } else {
            JSShowNotification({
                type: 'info',
                title: '可拷贝内容为空',
            });
        }
    },

    // 创建订单销售sku统计
    createOrderSellSKUStatisticsGridWindow: function (orderId, callBack) {
        var controller = this,
            data = controller.getOrderSellSKUData(orderId, true),
            store = Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'productInfo',
                        type: 'object',
                    },
                    {
                        name: 'qty',
                        type: 'number',
                    },
                    {
                        name: 'productDescription',
                        type: 'string',
                    },
                ],
                pageSize: 10000,
                proxy: {
                    type: 'pagingmemory',
                },
                data: data
            });

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey(`订单销售sku统计(${orderId})`),
            width: 1000,
            height: 600,
            items: [
                {
                    xtype: 'searchcontainer',
                    name: 'searchcontainer',
                    itemId: 'searchcontainer',
                    filterCfg: {
                        height: 60,
                        hidden: true,
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        defaults: {
                            isLike: false
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: '_id',
                                itemId: 'id',
                                fieldLabel: i18n.getKey('id'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'name',
                                itemId: 'name',
                                fieldLabel: i18n.getKey('name'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'displayName',
                                fieldLabel: i18n.getKey('displayName'),
                                itemId: 'displayName'
                            },
                        ]
                    },
                    gridCfg: {
                        editAction: false,
                        deleteAction: false,
                        store: store,
                        columnDefaults: {
                            renderer: function (value, metadata, record) {
                                var result = value || '';
                                metadata.tdAttr = 'data-qtip ="' + result + '"';
                                return result;
                            }
                        },
                        selModel: 'SIMPLE',
                        tbar: [
                            {
                                iconCls: 'icon_copy',
                                text: i18n.getKey('拷贝所有'),
                                tooltip: '拷贝所有数据至粘贴板',
                                handler: function (btn) {
                                    var data = store.proxy.data,
                                        result = data.map(item => {
                                            var {productInfo, qty, productDescription} = item,
                                                sku = productInfo?.sku,
                                                additionalContent = `sku: ${sku}, qty: ${qty},\n\n`,
                                                text = additionalContent + productDescription;

                                            return text;
                                        })

                                    controller.copyArrayToClipboard(result);
                                }
                            },
                            {
                                xtype: 'displayfield',
                                margin: '0 0 0 10',
                                value: i18n.getKey('过滤取消订单项:'),
                            },
                            {
                                xtype: 'togglebutton',
                                itemId: 'disabledBtn',
                                margin: 0,
                                tooltip: '当前已过滤被取消订单项',
                                value: false,//初始化时，是否是禁用
                                listeners: {
                                    afterrender: function (btn) {
                                        btn.setValueAndImage(true);
                                    }
                                },
                                handler: function (btn) {
                                    var newData = controller.getOrderSellSKUData(orderId, btn.value),
                                        tooltip = btn.value ? '当前已过滤被取消订单项' : '当前未过滤被取消订单项'

                                    JSSetLoading(true);
                                    setTimeout(() => {
                                        store.proxy.data = newData;
                                        store.load();

                                        btn.setTooltip(tooltip);
                                        JSSetLoading(false);
                                    }, 1000)
                                }
                            }
                        ],
                        columns: [
                            {
                                xtype: 'actioncolumn',
                                tdCls: 'vertical-middle',
                                align: 'center',
                                items: [
                                    {
                                        iconCls: 'icon_copy',
                                        tooltip: '拷贝',
                                        handler: function (view, rowIndex, colIndex, a, b, record) {
                                            var qty = record.get('qty'),
                                                productInfo = record.get('productInfo'),
                                                {sku} = productInfo,
                                                productDescription = record.get('productDescription'),
                                                additionalContent = `sku: ${sku}, qty: ${qty},\n\n`,
                                                text = additionalContent + productDescription;

                                            controller.copyArrayToClipboard([text]);
                                        }
                                    }
                                ]
                            },
                            {
                                text: i18n.getKey('产品 | 物料'),
                                dataIndex: 'productInfo',
                                flex: 1,
                                renderer: function (value, metadata, record) {
                                    var result = [
                                        {
                                            title: i18n.getKey('SKU'),
                                            value: i18n.getKey(value['sku'])
                                        },
                                        {
                                            title: i18n.getKey('name'),
                                            value: i18n.getKey(value['name'])
                                        }
                                    ]
                                    return JSCreateHTMLTable(result, 'align');
                                }
                            },
                            {
                                xtype: 'componentcolumn',
                                text: i18n.getKey('产品属性'),
                                dataIndex: 'productDescription',
                                flex: 1,
                                renderer: function (value, metaData, record) {
                                    var productInfo = record.get('productInfo'),
                                        {sku} = productInfo,
                                        qty = record.get('qty');

                                    if (value) {
                                        return {
                                            xtype: 'container',
                                            width: '100%',
                                            value: value,
                                            layout: 'column',
                                            items: [
                                                {
                                                    xtype: 'component',
                                                    itemId: 'url',
                                                    html: JSAutoWordWrapStr(value),
                                                    // columnWidth: 0.8
                                                },
                                                /*{
                                                    xtype: 'button',
                                                    iconCls: 'icon_copy',
                                                    itemId: 'copyBtn',
                                                    componentCls: 'btnOnlyIconV2',
                                                    ui: 'default-toolbar-small',
                                                    width: 30,
                                                    margin: '0px 5px',
                                                    tooltip: '拷贝',
                                                    handler: function (btn, Msg) {
                                                        const dom = btn.ownerCt.getComponent('url').el.dom;

                                                        // 获取原始内容
                                                        const originalContent = dom.innerText || dom.textContent;

                                                        // 要添加的内容
                                                        const additionalContent = `sku: ${sku},\nqty: ${qty},\n`;

                                                        // 合并内容
                                                        const contentToCopy = additionalContent + originalContent;

                                                        // 创建一个临时文本区域以拷贝内容
                                                        const tempTextArea = document.createElement('textarea');
                                                        tempTextArea.value = contentToCopy;
                                                        document.body.appendChild(tempTextArea);
                                                        tempTextArea.select();
                                                        document.execCommand('copy'); // 拷贝选中的文字到剪贴板
                                                        document.body.removeChild(tempTextArea); // 移除临时文本区域

                                                        Msg && JSShowNotification({
                                                            type: 'success',
                                                            title: '拷贝成功',
                                                        });
                                                    }
                                                },*/
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                text: i18n.getKey('数量'),
                                dataIndex: 'qty',
                                align: 'center',
                                width: 120,
                            },
                        ],
                        pagingBar: false
                    },
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    hidden: true,
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;

                        win.close();
                    }
                },
                cancelBtnCfg: {
                    text: i18n.getKey('关闭')
                }
            },
        }).show();
    },

    // 获取报关分类列表 订单
    getCustomsCategoryListData: function (orderId) {
        var url = adminPath + `api/orders/${orderId}/lineItems/v2?page=1&limit=10000`,
            queryData = JSGetQuery(url);

        return queryData;
    },

    //获得报关分类列表 发货要求
    getCustomsCategoryListDataV2: function (shippingDetailsId) {
        var url = adminPath + `api/order/shipmentRequirement/${shippingDetailsId}/orderItems?page=1&limit=10000`,
            queryData = JSGetQuery(url);

        return queryData;
    }
})