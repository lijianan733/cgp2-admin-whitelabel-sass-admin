/**
 * @author xiu
 * @date 2023/8/22
 */
//发货项
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.DeliverItem'
])
Ext.define('CGP.orderitemsmultipleaddress.view.singleAddress.deliverItemInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.deliverItemInfo',
    bodyStyle: 'border-top:0;border-color:white;',
    margin: '5 0 25 0',
    diySetValue: Ext.emptyFn,
    order: null,
    initComponent: function () {
        const me = this,
            {order} = me,
            mainRenderer = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            isMultiAddressDelivery = order.get('isMultiAddressDelivery'),
            orderDeliveryMethod = order.get('orderDeliveryMethod'),
            orderId = order.get('id'),
            remark = order.get('remark'),
            status = order.get('status'),
            statusId = status['id'],
            isAuditPending = [110, 101].includes(+statusId), //待审核状态
            suspectedSanction = order.get('suspectedSanction');

        me.items = [
            {
                xtype: 'splitBarTitle',
                title: '发货项信息',
                addButton: [
                    {
                        text: JSCreateFont('blue', false, i18n.getKey('批量审批发货项'), 12, false, true),
                        itemId: 'auditShipmentRequirementBtn',
                        componentCls: "btnOnlyIcon",
                        // hidden: true, //先提交部分　
                        hidden: !isAuditPending,
                        handler: function (btn) {
                            var orderItemList = btn.ownerCt.ownerCt,
                                container = orderItemList.getComponent('container'),
                                deliverItem = container.getComponent('deliverItem'),
                                gridContainer = deliverItem.getComponent('grid'),
                                grid = gridContainer.getComponent('grid'),
                                store = grid.store,
                                selectRecords = grid.getSelectionModel().getSelection(),
                                selectIds = selectRecords?.map(record => {
                                    var shipmentRequirementId = record.get('shipmentRequirement')['id'];
                                    return shipmentRequirementId ? shipmentRequirementId.toString() : '';
                                }),
                                title = i18n.getKey('审批_发货项'),
                                fieldLabel = i18n.getKey('审批范围'),
                                orderTotalCount = grid.store.totalCount;

                            mainRenderer.createExportExcelWindow(title, fieldLabel, selectIds, orderTotalCount, function (win, selModel) {
                                mainRenderer.createOrderItemAuditFormWindow(null, function (win, data) {
                                    var {customerNotify, comment} = data,
                                        selModelGather = {
                                            all: function () {
                                                var proxy = grid.store.proxy,
                                                    queryUrl = proxy.url,
                                                    filterComp = proxy.filter,
                                                    filterParams = filterComp.getQuery(),
                                                    queryData = JSGetQueryAllData(queryUrl, filterParams),
                                                    queryIds = queryData?.map(item => {
                                                        var shipmentRequirementId = item?.shipmentRequirement?.id;

                                                        return shipmentRequirementId ? shipmentRequirementId.toString() : '';
                                                    });

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
                                        url = adminPath + `api/shipmentRequirements/orderLineItem/batchAudit`,
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
                        text: JSCreateFont('blue', false, i18n.getKey('发货细项跟踪'), 12, false, true),
                        componentCls: "btnOnlyIcon",
                        // hidden: true, //先提交部分　
                        handler: function (btn) {
                            JSOpen({
                                id: 'shipmentsItemTailAfterPage',
                                url: path + "partials/orderitemsmultipleaddress/shipmentsItemTailAfterPage.html" +
                                    "?id=" + orderId,
                                title: i18n.getKey('发货细项跟踪'),
                                refresh: true
                            })
                        }
                    },
                    {

                        xtype: 'button',
                        itemId: 'exportBtn',
                        text: i18n.getKey('导出发货项'),
                        iconCls: 'icon_import',
                        // hidden: true, //先提交部分　
                        handler: function (btn) {
                            var url = adminPath + 'api/shipmentRequirements/exportExcel',
                                orderItemList = btn.ownerCt.ownerCt,
                                container = orderItemList.getComponent('container'),
                                deliverItem = container.getComponent('deliverItem'),
                                gridContainer = deliverItem.getComponent('grid'),
                                grid = gridContainer.getComponent('grid'),
                                selectRecords = grid.getSelectionModel().getSelection(),
                                title = i18n.getKey('导出_发货项Excel'),
                                fieldLabel = i18n.getKey('导出范围'),
                                storeUrl = grid.store.proxy.url,
                                gridFilterData = grid.filter.getQuery(),
                                selectIds = selectRecords?.map(record => record.get('shipmentRequirement')['id']),
                                orderTotalCount = grid.store.totalCount;

                            mainRenderer.createExportExcelWindow(title, fieldLabel, selectIds, orderTotalCount, function (win, selModel) {
                                var selModelGather = {
                                        all: function () {
                                            var storeAllData = JSGetQueryAllData(storeUrl, gridFilterData),
                                                storeAllDataId = storeAllData?.map(item => item['shipmentRequirement']['id']),
                                                result = [
                                                    {
                                                        "name": "includeIds",
                                                        "type": "number",
                                                        "value": `[${storeAllDataId}]`
                                                    }
                                                ];

                                            return JSON.stringify(result);
                                        },
                                        selected: function () {
                                            var result = [
                                                {
                                                    "name": "includeIds",
                                                    "type": "number",
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
                            const splitBarTitle = btn.ownerCt,
                                title = splitBarTitle.title,
                                container = me.getComponent('container'),
                                grid = container.getComponent('deliverItem');

                            JSCreateToggleFullscreenWindowGrid(title, grid, {});
                        }
                    },
                ]
            },
            {
                xtype: 'container',
                width: '100%',
                margin: '10 0 5 5',
                itemId: 'container',
                layout: 'fit',
                defaultType: 'displayfield',
                items: [
                    {
                        xtype: 'deliverItem',
                        name: 'deliverItem',
                        itemId: 'deliverItem',
                        width: '100%',
                        orderId: orderId,
                        remark: remark,
                        statusId: status?.id,
                        userName: 'userName',
                        hiddenSanction: !suspectedSanction,
                        orderDeliveryMethod: orderDeliveryMethod,
                        isMultiAddressDelivery: isMultiAddressDelivery
                    },
                ]
            },
        ];
        me.callParent();
    },
})