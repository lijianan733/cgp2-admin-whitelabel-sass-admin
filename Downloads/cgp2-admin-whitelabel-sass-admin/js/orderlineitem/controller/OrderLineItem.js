Ext.Loader.syncRequire(['CGP.common.model.ProductModel', 'CGP.common.model.MaterialModel']);
Ext.define('CGP.orderlineitem.controller.OrderLineItem', {
    searcher: Ext.emptyString,
    constructor: function () {

        this.searcher = Ext.Object.fromQueryString(location.search);
        this.callParent(arguments);
    },
    showOrderDetails: function (id, orderNumber) {
        var me = this;

        JSOpen({
            id: 'orderDetails',
            url: path + 'partials/orderitemsmultipleaddress/main.html?id=' + id + '&orderNumber=' + orderNumber,
            title: i18n.getKey('orderDetails') + '(' + i18n.getKey('orderNumber') + ':' + orderNumber + ')',
            refresh: true
        })

    },
    /**
     * 查看產品詳情
     * @param {Number} productId 产品编号
     */
    checkProduct: function (productId) {
        JSOpen({
            id: 'productpage',
            url: path + 'partials/product/product.html?id=' + productId,
            title: i18n.getKey('product'),
            refresh: true
        });
    },
    /**
     * 在产品BOM配置中从物料ID直接点击查看物料详情
     * @param {String} materialId
     */
    checkMaterial: function (materialId) {
        var name;
        var id;
        var isLeaf;
        Ext.Ajax.request({
            url: adminPath + 'api/materials/' + materialId,
            method: 'GET',
            async: false,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    var data = response.data;
                    name = data.name;
                    id = data['_id'];
                    isLeaf = data['leaf'];
                } else {
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
        JSOpen({
            id: 'material' + '_edit',
            url: path + "partials/material/edit.html?materialId=" + id + '&isLeaf=' + isLeaf + '&parentId= &isOnly=true',
            title: i18n.getKey('materialInfo') + '(' + i18n.getKey('id') + ':' + id + ')',
            refresh: true
        });
    },
    /**
     *预览订单详情
     * @param orderId
     * @param orderLineItemId
     * @param statusName
     * @param isRedo
     */
    modifyOrderLineItemStatus: function (orderId, orderLineItemId, statusName, isRedo, statusId) {
        JSOpen({
            id: 'modifyOrderLineItemStatus',
            url: path + 'partials/orderlineitem/status.html?id=' + orderId + '&orderLineItemId=' + orderLineItemId + '&statusName=' + statusName + '&isRedo=' + isRedo + '&statusId=' + statusId,
            title: i18n.getKey('orderLineItem') + ' ' + i18n.getKey('modifyStatus'),
            refresh: true
        })
    },
    checkWorkItems: function (orderLineItemId) {

        JSOpen({
            id: 'workpage',
            url: path + 'partials/work/work.html?orderLineItem.id=' + orderLineItemId,
            title: i18n.getKey('productionManager') + ' ' + i18n.getKey('allStatus'),
            refresh: true
        })
    },

    asyncEditQuery: function (url, jsonData, isEdit, callFn, msg) {
        var method = isEdit ? 'PUT' : 'POST';

        JSAjaxRequest(url, method, true, jsonData, msg, callFn, true);
    },

    //处理url查询参数
    proccessUrlSearcherParams: function (page) {
        var me = this,
            searcher = this.searcher,
            filter = page.filter,
            grid = page.grid,
            store = page.grid.getStore();

        if (searcher.statusId) {
            var statusId = Ext.Number.from(searcher.statusId);
            if (statusId !== 0) {
                var statusIdFilter = filter.getComponent('statusId');
                statusIdFilter.setValue(statusId);
                statusIdFilter.setVisible(false);
            }
        }
        if (searcher.orderNumber) {
            filter.getComponent('orderNumber').setValue(searcher.orderNumber);
        }
        if (searcher.id) {
            filter.getComponent('id').setValue(searcher.id);
        }
        if (searcher.productId) {
            var model = Ext.ModelManager.getModel('CGP.common.model.ProductModel');
            model.load(Number(searcher.productId), {
                success: function (record, operation) {
                    filter.getComponent('productSearch').setValue(record.data);
                    //store.loadPage(1);
                }
            });
        }
        if (searcher.materialId) {
            var model = Ext.ModelManager.getModel('CGP.common.model.MaterialModel');
            model.load(Number(searcher.materialId), {
                success: function (record, operation) {
                    filter.getComponent('material').setValue(record.data);
                    //store.loadPage(1);
                }
            });
        }
        /*if(searcher.productId){
         filter.getComponent('product.id').setValue(parseInt(searcher.productId));
         }
         if(searcher.materialId){
         filter.getComponent('materialId').setValue(searcher.materialId);
         }*/
        //store.loadPage(1);
        me.addReportButton(page);
    },
    /**
     * 添加打印生产报表功能
     * @param p
     */
    addReportButton: function (p) {
        var me = this;


        var produceReportButton = Ext.widget({
            xtype: 'button',
            text: i18n.getKey('printProduceReport'),
            width: 120,
            iconCls: 'icon_audit',
            handler: function () {
                var records = p.grid.getSelectionModel().getSelection();
                if (records.length == 0) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '请先选择订单项！');
                    return;
                }
                var ids = [];
                Ext.Array.each(records, function (record) {
                    ids.push(record.get('orderId'));
                });
                var url = adminPath + 'api/order/reports/pdf?ids=' + ids.join(',');
                JSAjaxRequest(url, 'POST', true, {
                    reportName: 'WorkOrder'
                }, false, function (require, success, response) {
                    var resp = Ext.JSON.decode(response.responseText);
                    if (resp.success) {
                        window.open(resp.data, "_blank")
                    }
                }, true);
            }
        });
        p.toolbar.add(produceReportButton);
    },
    /**
     *
     */
    searchProduct: function () {
        var queries = [];
        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();
        for (var i = 0; i < items.length; i++) {
            var query = {};
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            query.name = items[i].name;
            if (!Ext.isEmpty(items[i].isLike) && !items[i].isLike) {
                query.value = items[i].getValue();
            } else if (Ext.isEmpty(items[i].isLike) || items[i].isLike) {
                query.value = '%' + items[i].getValue() + '%'
            }
            query.type = 'string';
            queries.push(query);
        }

        if (queries.length > 0) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(queries)
            }
        } else {
            store.proxy.extraParams = null;
        }
        store.loadPage(1);
    },
    clearParams: function () {
        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();
        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }
        store.proxy.extraParams = null;
    },
    printAgain: function (orderItemId) {
        var me = this;
        //获取订单项userparameter
        var itemUserParams = Ext.create('CGP.orderlineitem.view.status.store.UserParams', {
            storeId: 'itemUserParams',
            orderItemId: orderItemId,
            listeners: {
                load: function (records, operation, success) {
                    if (success) {
                        //创建重新排版window
                        var wind = Ext.create('CGP.orderlineitem.view.status.view.UserImpositionParams', {
                            title: i18n.getKey('printAgain'),
                            orderItemId: orderItemId,
                            confirmHandler: me.confirmRePrint //提交userParameter值触发重新排版
                        });
                        wind.show();
                    }
                }
            }
        });
        // itemUserParams.load();
    },
    confirmRePrint: function (btn) {
        var win = btn.ownerCt.ownerCt;
        if (!win.isValid()) {
            return false;
        }
        var data = win.getValue();
        var mask = win.setLoading(i18n.getKey('loading'));
        var url = adminPath + 'api/orderLineitems/' + win.orderItemId + '/printAgain', method = 'POST';
        var callback = function (require, success, response) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                win.hide();
            }
            mask.hide();
        };
        JSAjaxRequest(url, method, true, data, i18n.getKey('printAgain') + i18n.getKey('success'), callback)
    },
    // 重新请求订单缩略图
    reloadImage: function (productInstanceId, store, orderItemId) {
        const controller = this,
            url = adminPath + 'api/composingPreview/retry?productInstanceId=' + productInstanceId;
        JSAjaxRequest(url, 'GET', false, null, '重新生成缩略图请求发起成功!', function (require, success, response) {
            const responseMessage = Ext.JSON.decode(response.responseText);
            if (responseMessage.success) {
                controller.requestLineItems(orderItemId, store)
                return responseMessage.data;
            }
        });
    },
    //重新排版 仅在生产中状态之前有效
    rePrint: function (orderId, orderItemId, successMsg, callback) {
        var url = adminPath + `api/orders/${orderId}/composing/retry?scope=assigned_orderitems&orderItemIds=${orderItemId}`;

        JSAjaxRequest(url, 'POST', false, null, successMsg, function (require, success, response) {
            const responseMessage = Ext.JSON.decode(response.responseText);
            if (responseMessage.success) {
                callback()
            } else {
                Ext.Msg.alert('提示', `重排请求发起失败`)
            }
        });
    },
    //实时获取订单项缩略图状态
    requestLineItems: function (orderItemId, store) {
        const controller = this,
            lineItemsUrl = adminPath + 'api/orderItemThumbnailInfos?orderItemId=' + orderItemId;
        var status = null;
        JSAjaxRequest(lineItemsUrl, 'GET', false, null, null, function (require, success, response) {
            const responseMessage = Ext.JSON.decode(response.responseText);
            if (responseMessage.success) {
                if (!['SUCCESS', 'FAILURE'].includes(responseMessage.data.status)) {
                    setTimeout(() => {
                        controller.requestLineItems(orderItemId, store);
                    }, 20000)
                } else {
                    store.load();
                }
            }
        })
        return status
    },
    /**
     * 获取指定订单数据,使用旧接口
     */
    getOrder: function (id) {
        var result = null;
        var url = adminPath + 'api/orders/' + id + '/v2';
        JSAjaxRequest(url, 'GET', false, false, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                result = responseText.data;
                result.id = result._id;

            }
        });
        return result;
    },
});
