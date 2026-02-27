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
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.orderItemListV2'
])
Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.orderItemsAddress', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.orderItemsAddress',
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
    setSaveBtn: function (orderStatusModifyData, orderDeliveryMethod, statusId) {
        const me = this,
            {shipmentOrder} = orderStatusModifyData,
            toolbar = me.getDockedItems('toolbar[dock="top"]')[0],
            shipmentOrderBtn = toolbar.getComponent('shipmentOrder');

        shipmentOrderBtn.setVisible(orderDeliveryMethod === 'ULGS' && !statusId);

        if (shipmentOrder) { //有发货单的情况下
            const {status} = shipmentOrder,
                {id} = status;

            me.isVisibleShipmentOrder = (id === 101); //当前是待装箱状态 依然可以继续装箱
            shipmentOrderBtn.setVisible(id === 101)
        }

        //超信贷额度，不允许完成发货
        if (orderStatusModifyData?.shipmentRequirement?.isLockByCreditOrOverdue == true) {
            shipmentOrderBtn.setDisabled(true);
        }


    },
    initComponent: function () {
        var me = this,
            orderId = JSGetQueryString('id'),
            remark = JSGetQueryString('remark'),
            orderStatusId = JSGetQueryString('orderStatusId'),
            manufactureCenter = JSGetQueryString('manufactureCenter'),
            shippingDetailsId = JSGetQueryString('shippingDetailsId'),
            orderDeliveryMethod = JSGetQueryString('orderDeliveryMethod'),
            controller = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            orderStatusModifyData = controller.getMultiAddressDeliveryDetailData(shippingDetailsId),
            record = new CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.Order(orderStatusModifyData),
            statusId = me.getStatusName(record).id,
            status = me.getStatusName(record).name,
            shipmentRequirement = record.get('shipmentRequirement'),
            {isLock, shipRemark, id, isLockByCreditOrOverdue} = shipmentRequirement,
            isCreateOrderDelivery = statusId !== null ? '已生成' : '未生成',
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
            // 做合并列表项操作
            testMergeTableCellStore = controller.createTestMergeTableCellStore(id, manufactureCenter);


        me.tbar = [
            {
                xtype: 'button',
                width: 100,
                text: '完成生产',
                iconCls: 'icon_save',
                itemId: 'shipmentOrder',
                disabled: isLock || isLockByCreditOrOverdue,//锁发货要求，或者因为信贷额度锁定了订单
                handler: function (btn) {
                    var {id} = shipmentRequirement,
                        url = adminPath + 'api/shipmentOrders/shipmentRequirement?requirementId=' + id,
                        result = {
                            requirementId: id,
                        },
                        width = 900,
                        height = 700,
                        left = (window.screen.availWidth - width) / 2,
                        top = (window.screen.availHeight - height) / 2,
                        newWindow = null;

                    if (me.isVisibleShipmentOrder) {
                        var {shipmentOrder} = orderStatusModifyData,
                            shipmentOrderId = shipmentOrder.id,
                            shipmentOrderUrl = QpDesignPath + 'shipmentmanage/sys_sm_shipment_order_edit.aspx?sri=' + shipmentOrderId;

                        // window.open(shipmentOrderUrl, '_blank', 'width=900,height=700,top=200,left=500');
                        newWindow = window.open(shipmentOrderUrl, '', 'height=' + height + ',width=' + width + ',top=' + top + ',left=' + left + ',directories=no,toolbar=no,menubar=no,copyhistory=no,scrollbars=yes,resizable=no,location=no,status=yes')

                    } else {
                        controller.asyncEditQuery(url, result, false, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    const {id} = responseText.data,
                                        shipmentOrderUrl = QpDesignPath + 'shipmentmanage/sys_sm_shipment_order_edit.aspx?sri=' + id
                                    newWindow = window.open(shipmentOrderUrl, '_blank', 'width=900,height=700,top=200,left=500');
                                    location.reload();
                                }
                            }
                        })
                    }

                    if (newWindow) {
                        btn.setDisabled(true);
                    }

                    var checkWindowClosed = setInterval(function () {
                        if (newWindow?.closed) {
                            // 目标窗口已关闭，执行相应操作
                            btn.setDisabled(false);
                            clearInterval(checkWindowClosed); // 停止定时器
                        }
                    }, 500);
                }
            },
            {
                xtype: 'button',
                componentCls: "btnOnlyIcon",
                tooltip: isCreateOrderDelivery + '发货单',
                text: JSCreateFont('red', true, '状态: ' + status),
            },
            {
                xtype: 'button',
                componentCls: "btnOnlyIcon",
                tooltip: '已锁定发货要求,不允许 完成生产 或 修改收件人地址',
                hidden: !isLock,
                text: JSCreateFont('red', true, '(发货要求已锁定!)'),
            },
            {
                xtype: 'button',
                componentCls: "btnOnlyIcon",
                tooltip: '订单已超信贷额度上限,不允许完成生产',
                hidden: !isLockByCreditOrOverdue,
                text: JSCreateFont('red', true, '(订单已超信贷额度上限,发货要求已锁定!)'),
            },
            {
                xtype: 'displayfield',
                width: 500,
                margin: '0 20 0 60',
                hidden: !remark || remark === 'undefined',
                tooltip: `订单备注: ${remark}`,
                value: JSAutoWordWrapStr(JSCreateFont('red', true, `发货要求备注: ${remark}`, 15))
            },
            {
                xtype: 'displayfield',
                width: 500,
                hidden: !shipRemark || shipRemark === 'undefined',
                tooltip: `发货要求备注: ${shipRemark}`,
                value: JSAutoWordWrapStr(JSCreateFont('red', true, `发货要求备注: ${shipRemark}`, 15))
            },
            '->',
            {
                text: '刷新',
                width: 80,
                iconCls: 'icon_refresh',
                handler: function () {
                    location.reload();
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('操作'),
                margin: '0 60 0 0',
                width: 80,
                menu: [
                    {
                        tooltip: `${text}发货要求`,
                        iconCls: iconCls,
                        text: text,
                        handler: function (btn) {
                            Ext.Msg.confirm(i18n.getKey('prompt'), `是否${text}发货要求`, function (code) {
                                if (code === 'yes') {
                                    me.setLockStatus(id, !isLock);
                                }
                            })
                        }
                    },
                    {
                        tooltip: `修改发货要求`,
                        iconCls: 'icon_edit',
                        text: '修改发货要求',
                        handler: function (btn) {
                            JSOpen({
                                id: 'shipmentrequirement_edit',
                                url: path + "partials/shipmentrequirement/edit.html" +
                                    "?id=" + id +
                                    "&isReadOnly=" + isLock,
                                title: `修改_发货要求(${id})`,
                                refresh: true
                            });
                        }
                    },
                ]
            },
        ];
        me.items = [
            {
                xtype: 'addressInfo',
                data: orderStatusModifyData,
                statusId: statusId,
                isLock: isLock
            },
            {
                xtype: 'shippingInfo',
                shipmentInfo: record.get('shipmentInfo'),
                orderId: orderId,
                record: record,
                data: orderStatusModifyData
            },
            {
                xtype: 'newOrderItemListV2',
                store: testMergeTableCellStore,
                itemId: 'orderItem',
                width: 1600,
                listeners: {
                    afterrender: function (comp) {
                        // 合并表单列
                        testMergeTableCellStore.on('load', () => {
                            JSMergeCells(comp, 'mergeAssign', [1]);
                        })
                    },
                }
            },
        ];

        me.callParent();
        me.on('afterrender', function () {
            me.setSaveBtn(orderStatusModifyData, orderDeliveryMethod, statusId);
        })
    }
})