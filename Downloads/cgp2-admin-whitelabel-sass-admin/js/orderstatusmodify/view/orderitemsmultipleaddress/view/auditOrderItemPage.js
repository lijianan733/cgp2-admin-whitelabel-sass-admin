/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.Loader.setPath({
    enabled: true,
    "CGP.orderdetails": path + "partials/order/details/app"
});
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.addressInfo',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.newOrderItemList',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.shippingInfo',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.Order',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.orderItemListV2',
    'CGP.orderv2.model.OrderListModel',
    'CGP.orderstatusmodify.view.Sanction',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.auditOrderItem.createAuditOrderItemComp',
    'CGP.orderlineitemv2.store.OrderLineItemByOrderStore',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.auditOrderItem.createOrderLineItemContainerComp'
])
Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.auditOrderItemPage', {
    extend: 'Ext.form.Panel',
    alias: 'widget.auditOrderItemPage',
    layout: {
        type: 'vbox',
        align: 'left'
    },
    autoScroll: true,
    defaults: {
        width: '100%'
    },
    bodyPadding: '0 10 20 10',
    isVisibleShipmentOrder: false,
    setLockStatus: function (id, isLock) {
        var url = adminPath + `api/shipmentRequirements/${id}/lock?isLock=${isLock}`,
            isLockText = isLock ? '锁定' : '解锁',
            controller = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender');

        controller.asyncEditQuery(url, {}, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    location.reload();
                }
            }
        }, isLockText + '成功')
    },
    windowCloseFun: function () {
        const me = this,
            tools = me.getDockedItems('toolbar[dock="top"]')[0],
            shipmentOrder = tools.getComponent('shipmentOrder');

        window.addEventListener('message', function (event) {
            var message = event.data;
            if (message === 'N' || message === 'Y') {
                shipmentOrder.setDisabled(false);
                location.reload();
            }
        });
    },
    getNewStatusName: function (record) {
        var result = null,
            shipmentOrders = record.get('shipmentOrders'),
            shipmentOrder = shipmentOrders.filter(item => {
                return item['manufactureCenter'] === JSGetQueryString('manufactureCenter')
            })

        if (shipmentOrder[0]) {
            var {status} = shipmentOrder[0],
                {frontendName, id} = status;
            if (id === 101) {
                frontendName = '待装箱'
            }

            result = {
                name: i18n.getKey(frontendName),
                id: id
            };
        } else {
            result = {
                name: '等待发货',
                id: null
            };
        }

        return result;
    },
    getStatusName: function (record) {
        var result = null,
            shipmentOrder = record.get('shipmentOrder');

        if (shipmentOrder) {
            var {status} = shipmentOrder,
                {frontendName, id} = status;

            if (id === 101) {
                frontendName = '待装箱'
            }

            result = {
                name: i18n.getKey(frontendName),
                id: id
            };
        } else {
            //默认叫已生产
            result = {
                name: '已生产',
                id: null
            };
        }

        return result;
    },
    initComponent: function () {
        var me = this,
            isSanction = JSGetQueryString('isSanction') === 'true',
            orderId = JSGetQueryString('orderId'),
            pageType = JSGetQueryString('pageType'),
            orderNumber = JSGetQueryString('orderNumber'),
            shippingDetailsId = JSGetQueryString('shippingDetailsId'),
            controller = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            orderStatusModifyData = controller.getMultiAddressDeliveryDetailData(shippingDetailsId),
            record = new CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.Order(orderStatusModifyData),
            statusId = me.getStatusName(record).id,
            isCanAudit = record.get('isCanAudit'),
            shipmentRequirement = record.get('shipmentRequirement'),
            {isLock, shipRemark, id, finalManufactureCenter} = shipmentRequirement,
            lockGather = {
                true: {
                    text: '解锁',
                    iconCls: 'icon_unlock'
                },
                false: {
                    text: '锁定',
                    iconCls: 'icon_lock'
                }
            },
            {text, iconCls} = lockGather[isLock],
            orderNumberData = controller.getOrderNumberData(orderNumber),
            orderRecord = new CGP.orderv2.model.OrderListModel(orderNumberData),
            orderRecordId = orderRecord.get('_id'),
            testMergeTableCellStore = controller.createTestMergeTableCellStore(id, finalManufactureCenter);

        me.tbar = {
            hidden: !isLock && (!shipRemark || shipRemark === 'undefined'),
            items: [
                {
                    xtype: 'button',
                    componentCls: "btnOnlyIcon",
                    hidden: !isLock,
                    text: JSCreateFont('red', true, '( 发货要求已锁定,禁止审核! )'),
                },
                {
                    xtype: 'displayfield',
                    width: 500,
                    hidden: !shipRemark || shipRemark === 'undefined',
                    tooltip: `发货要求备注: ${shipRemark}`,
                    value: JSAutoWordWrapStr(JSCreateFont('red', true, `发货要求备注: ${shipRemark}`, 15))
                },
            ]
        }

        me.items = [
            {
                xtype: 'addressInfo',
                isLock: isLock,
                statusId: statusId,
                data: orderStatusModifyData,
            },
            {
                xtype: 'shippingInfo',
                shipmentInfo: record.get('shipmentInfo'),
                record: record,
                data: orderStatusModifyData
            },
            {
                xtype: 'audit_order_item',
                itemId: 'audit_order_item',
                hidden: !isCanAudit,
                isSanction: isSanction,
            },
            {
                xtype: 'order_line_item_container',
                itemId: 'order_line_item_container',
                width: '100%',
                isLock: isLock,
                orderRecord: orderRecord,
                store: testMergeTableCellStore,
            },
        ];

        me.bbar = [
            {
                xtype: 'button',
                text: isCanAudit ? i18n.getKey('提交审核结果') : i18n.getKey('当前状态不可审核!'),
                width: 140,
                iconCls: 'icon_agree',
                disabled: !isCanAudit,
                hidden: isLock,
                handler: function (btn) {
                    var panel = btn.ownerCt.ownerCt,
                        audit_order_item = panel.getComponent('audit_order_item'),
                        getValue = audit_order_item.diyGetValue(),
                        url = adminPath + `api/shipmentRequirements/${id}/orderLineItem/audit`;

                    // 验证审核信息
                    if (audit_order_item.isValid()) {
                        /*// 验证报关分类 
                        if (controller.checkCustomElementComplete(orderRecordId)) {

                            
                        } else {
                            JSShowNotification({
                                type: 'info',
                                title: '当前订单中有未选定报关分类的订单项，请检查配置!',
                            });
                        }*/

                        JSAsyncEditQuery(url, getValue, true, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText),
                                    data = responseText?.data;
                                if (responseText.success) {

                                    JSShowNotification({
                                        type: 'success',
                                        title: '订单项审核完成!',
                                    })

                                    setTimeout(() => {
                                        location.reload();
                                    }, 3500);
                                    
                                } else {
                                    var errorCode = data?.code,
                                        errorParams = data?.errorParams,
                                        orderItemIds = errorParams?.orderItemIds,
                                        codeGather = {
                                            108000358: orderItemIds?.length ? `下列订单项随机状态未完成:\n ${orderItemIds} ` : '订单项随机状态未完成',
                                            108000359: `审核前需完成报关分类,下列订单项未完成报关:\n ${orderItemIds} `,
                                            108000360: '关联的订单未完成后续数据处理!'
                                        }     

                                    if ([108000358, 108000359, 108000360].includes(errorCode)) {
                                        Ext.Msg.alert('提示', codeGather[errorCode]);
                                    }
                                }
                            }
                        }, true)
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('返回'),
                iconCls: 'icon_arrow_undo',
                handler: function (btn) {
                    if (pageType === 'deliverItem') { //从生产详细进 shipmentrequirement
                        JSOpen({ //回生产详细
                            id: 'modifyStatusV2',
                            url: path + 'partials/orderstatusmodify/main.html' +
                                '?id=' + orderId +
                                '&orderNumber=' + orderNumber,
                            title: i18n.getKey('生产详细'),
                            refresh: true
                        })
                    } else {
                        JSOpen({//回发货要求
                            id: 'shipmentrequirementpage',
                            url: path + 'partials/shipmentrequirement/main.html' +
                                '?id=' + shippingDetailsId,
                            title: i18n.getKey('shipmentRequirement'),
                            refresh: true
                        })
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('刷新'),
                iconCls: 'icon_refresh',
                handler: function (btn) {
                    location.reload();
                }
            }
        ];


        me.callParent();
    }
})