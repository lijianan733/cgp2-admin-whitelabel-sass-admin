/**
 * @author xiu
 * @date 2023/8/22
 */
//订单项列表
Ext.Loader.setPath({
    enabled: true,
    "CGP.orderdetails": path + "partials/order/details/app"
});
Ext.Loader.syncRequire([
    'CGP.orderdetails.view.details.OrderLineItem',
    'CGP.order.view.order.OrderTotal'
])

Ext.define('CGP.orderitemsmultipleaddress.view.singleAddress.orderItemList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.orderItemList',
    bodyStyle: 'border-top:0;border-color:white;',
    margin: '5 0 25 0',
    order: null,
    diySetValue: function (data) {
        const me = this,
            container = me.getComponent('container')
    },
    initComponent: function () {
        const me = this,
            mainRenderer = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            orderId = JSGetQueryString('id'),
            orderNumber = JSGetQueryString('orderNumber'),
            remark = me.order.get('remark'),
            orderStatusId = me.order.get('status').id,
            isAuditPending = [110, 101].includes(orderStatusId), //待审核状态
            orderLineItemStore = Ext.create('CGP.orderlineitemv2.store.OrderLineItemByOrderStore', {
                orderId: orderId,
            });

        me.items = [
            {
                xtype: 'splitBarTitle',
                title: '订单项列表',
                border: '0 0 1 0',
                addButton: [
                    {
                        xtype: 'button',
                        itemId: 'customsDeclarationBtn',
                        text: JSCreateFont('blue', false, i18n.getKey('批量报关分类'), 12, false, true),
                        hidden: !Ext.Array.contains(['43', '100', '110', '101', '113', '116', '117', '118', '300', '301'], String(orderStatusId)),
                        componentCls: "btnOnlyIcon",
                        handler: function (btn) {
                            var controller = Ext.create('CGP.orderitemsmultipleaddress.controller.Controller'),
                                url = adminPath + `api/orders/${orderId}/lineItems/v2?page=1&limit=10000`;

                            JSAjaxRequest(url, 'GET', true, null, null, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        var data = responseText?.data?.content || responseText?.data,
                                            newOrderLineItemStore = Ext.create('CGP.orderlineitemv2.store.OrderLineItemByOrderStore', {
                                                pageSize: 25,
                                                proxy: {
                                                    type: 'pagingmemory',
                                                    reader: {
                                                        type: 'json',
                                                        root: 'data',
                                                        totalProperty: 'total'
                                                    }
                                                },
                                                data: data,
                                                /* buffered: true,                 // 开启缓冲（懒加载）
                                                 pageSize: 100,                  // 每次加载多少条数据
                                                 leadingBufferZone: 300,         // 提前请求的缓冲范围，避免滚动停顿*/
                                            }),
                                            gridParams = {
                                                order: me.order,
                                                remark: remark,
                                                orderId: orderId,
                                                orderStatusId: orderStatusId,
                                                store: newOrderLineItemStore,
                                                originStore: orderLineItemStore,
                                            };

                                        controller.createCustomsCategory(gridParams);
                                    }
                                }
                            },true);
                        }
                    },
                    {
                        xtype: 'button',
                        itemId: 'auditOrderItemBtn',
                        componentCls: "btnOnlyIcon",
                        // hidden: true, //先提交部分　
                        hidden: !isAuditPending,
                        text: JSCreateFont('blue', false, i18n.getKey('批量审批订单项'), 12, false, true),
                        handler: function (btn) {
                            var orderItemList = btn.ownerCt.ownerCt,
                                container = orderItemList.getComponent('container'),
                                orderLineInfo = container.getComponent('orderLineInfo'),
                                grid = orderLineInfo.grid,
                                store = grid.store,
                                proxy = store.proxy,
                                queryUrl = proxy.url,
                                filterComp = proxy.filter,
                                filterParams = filterComp.getQuery(),
                                selectRecords = grid.getSelectionModel().getSelection(),
                                filterSelectRecord = selectRecords.filter(record => {
                                    var statusId = record.get('statusId'); //待审核状态
                                    return [110, 101].includes(+statusId);
                                }),
                                selectIds = filterSelectRecord?.map(record => {
                                    return record.get('_id').toString();
                                }),
                                title = i18n.getKey('审批_订单项'),
                                fieldLabel = i18n.getKey('审批范围'),
                                orderTotalCount = mainRenderer.getAuditStatusOrderTotalCount(queryUrl, filterParams, true);
                            // orderTotalCount = orderLineItemStore.totalCount;

                            mainRenderer.createExportExcelWindow(title, fieldLabel, selectIds, orderTotalCount, function (win, selModel) {
                                mainRenderer.createOrderItemAuditFormWindow(null, function (win, data) {
                                    var {customerNotify, comment} = data,
                                        selModelGather = {
                                            all: function () {
                                                var proxy = grid.store.proxy,
                                                    queryUrl = proxy.url,
                                                    filterComp = proxy.filter,
                                                    filterParams = filterComp.getQuery(),
                                                    queryData = mainRenderer.getAuditStatusOrderTotalData(queryUrl, filterParams),
                                                    queryIds = queryData?.map(item => item._id.toString());

                                                return {
                                                    "ids": queryIds,
                                                    "customerNotify": customerNotify,
                                                    "comment": comment
                                                }
                                            },
                                            selected: function () {

                                                return {
                                                    "ids": selectIds,
                                                    "customerNotify": customerNotify,
                                                    "comment": comment
                                                }
                                            }
                                        },
                                        url = adminPath + `api/orderItems/audit/batch`,
                                        putData = selModelGather[selModel]();

                                    JSAsyncEditQuery(url, putData, true, function (require, success, response) {
                                        if (success) {
                                            var responseText = Ext.JSON.decode(response.responseText),
                                                data = responseText?.data;

                                            if (responseText.success) {
                                                if (Ext.Object.isEmpty(data)) {
                                                    win.close();
                                                    store.load();
                                                    JSShowNotification({
                                                        type: 'success',
                                                        title: '审批成功!',
                                                    });
                                                } else {
                                                    //需报关id
                                                    var auditCodes = Object.keys(data),
                                                        codeArr = ['108000358', '108000359', '108000360'],
                                                        idText = i18n.getKey('id'),
                                                        codeGather = {
                                                            '108000358': `下列订单项(${idText})随机状态未完成:<br>`,
                                                            '108000359': `下列订单项(${idText})的报关分类未完备:<br>`,
                                                            '108000360': `下列订单项(${idText})关联的订单未完成后续数据处理:<br>`
                                                        },
                                                        errorTexts = []

                                                    auditCodes.forEach(item => {
                                                        var isExist = codeArr.includes(item),
                                                            auditIds = data[item],
                                                            errorText = isExist ? codeGather[item] : '下列订单项存在问题(请询问开发人员):<br>';

                                                        errorTexts.push(`${errorText} ${auditIds}`);
                                                    });

                                                    mainRenderer.createAuditErrorTextWindow(errorTexts, function (win, formData) {
                                                        win.close();
                                                    });
                                                }
                                                store.load();
                                            }
                                        }
                                    }, true)
                                })
                                win.close();
                            });
                        }
                    },
                    {
                        xtype: 'button',
                        itemId: 'auditContentBtn',
                        componentCls: "btnOnlyIcon",
                        // hidden: !isAuditPending,　　
                        // hidden: true, //先提交部分　
                        text: JSCreateFont('blue', false, i18n.getKey('批量审批内容'), 12, false, true),
                        handler: function (btn) {
                            JSOpen({
                                id: 'orderitemauditcontent',
                                url: path + "partials/orderitemsmultipleaddress/auditContentPage.html" +
                                    "?id=" + orderId +
                                    "&status=" + orderStatusId +
                                    "&orderNumber=" + orderNumber,
                                title: i18n.getKey(`批量审批订单项内容 (${orderId})`),
                                refresh: true
                            })
                        }
                    },
                    {
                        xtype: 'button',
                        itemId: 'exportBtn',
                        text: i18n.getKey('导出订单项'),
                        iconCls: 'icon_import',
                        // hidden: true, //先提交部分　
                        handler: function (btn) {
                            var url = adminPath + 'api/orderItems/exportExcel',
                                orderItemList = btn.ownerCt.ownerCt,
                                container = orderItemList.getComponent('container'),
                                orderLineInfo = container.getComponent('orderLineInfo'),
                                grid = orderLineInfo.grid,
                                selectRecords = grid.getSelectionModel().getSelection(),
                                title = i18n.getKey('导出_订单项Excel'),
                                fieldLabel = i18n.getKey('导出范围'),
                                storeUrl = grid.store.proxy.url,
                                gridFilterData = grid.filter.getQuery(),
                                selectIds = selectRecords?.map(record => record.get('_id')),
                                orderTotalCount = orderLineItemStore.totalCount;

                            mainRenderer.createExportExcelWindow(title, fieldLabel, selectIds, orderTotalCount, function (win, selModel) {
                                var selModelGather = {
                                        all: function () {
                                            var storeAllData = JSGetQueryAllData(storeUrl, gridFilterData),
                                                storeAllDataId = storeAllData?.map(item => item['_id']),
                                                result = [
                                                    {
                                                        "name": "includeIds",
                                                        "type": "string",
                                                        "value": `[${storeAllDataId}]`
                                                    }
                                                ];

                                            return JSON.stringify(result);
                                        },
                                        selected: function () {
                                            var result = [
                                                {
                                                    "name": "includeIds",
                                                    "type": "string",
                                                    "value": `[${selectIds}]`
                                                }
                                            ]

                                            return JSON.stringify(result);
                                        }
                                    },
                                    filterArray = selModelGather[selModel]();

                                mainRenderer.downloadOriginalFn(url, filterArray, grid, function () {
                                    win.close();
                                });
                            });
                        }
                    },
                    {
                        text: i18n.getKey('切换全屏'),
                        iconCls: 'icon_expandAll',
                        handler: function (btn) {
                            const orderItemList = btn.ownerCt.ownerCt,
                                splitBarTitle = btn.ownerCt,
                                title = splitBarTitle.title,
                                container = orderItemList.getComponent('container'),
                                orderLineInfo = container.getComponent('orderLineInfo');

                            JSCreateToggleFullscreenWindowGrid(title, orderLineInfo, {});
                        }
                    },
                ]
            },
            {
                xtype: 'container',
                itemId: 'container',
                layout: 'vbox',
                width: '100%',
                margin: '10 0 5 5',
                items: [
                    { //订单项信息
                        xtype: 'detailsorderlineitem',
                        width: '100%',
                        height: 700,
                        itemId: 'orderLineInfo',
                        diySetValue: Ext.emptyFn,
                        diyGetValue: Ext.emptyFn,
                        getName: Ext.emptyFn,
                        fieldLabel: '',
                        dockedItems: [],
                        order: me.order,
                        hiddenTitle: true,
                        hiddenCustomsCategory: true,
                        remark: remark,
                        orderId: orderId,
                        store: orderLineItemStore,
                        orderStatusId: orderStatusId,
                        pageType: 'orderItemsMultipleAddress',
                        getFieldLabel: function () {
                            return '订单项列表';
                        },
                        getDeliverItemGrid: function (me) {
                            var form = me.ownerCt.ownerCt.ownerCt,
                                deliverItemInfo = form.getComponent('deliverItemInfo'),
                                container = deliverItemInfo.getComponent('container'),
                                deliverItem = container.getComponent('deliverItem'),
                                grid = deliverItem.getComponent('grid');

                            return grid.grid;
                        },
                    },
                    { //订单总数
                        xtype: 'ordertotal',
                        width: '100%',
                        orderId: orderId,
                        itemId: 'orderTotal',
                        border: false,
                        header: false,
                        order: me.order,
                        viewConfig: {
                            style: {
                                'display': 'flex',
                                'flex-direction': 'row-reverse'
                            }
                        },
                    }
                ]
            },
        ];
        me.callParent(arguments);
    },
})