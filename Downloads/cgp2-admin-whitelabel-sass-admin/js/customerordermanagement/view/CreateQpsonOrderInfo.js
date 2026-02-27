/**
 * @author xiu
 * @date 2025/3/26
 */
Ext.Loader.syncRequire([
    'CGP.orderitemsmultipleaddress.view.singleAddress.infoPreview',
    'CGP.orderitemsmultipleaddress.view.singleAddress.orderRemark',
    'CGP.orderitemsmultipleaddress.view.singleAddress.shippingInfo',
    'CGP.orderitemsmultipleaddress.view.singleAddress.tool.operationBtn',
    'CGP.customerordermanagement.view.CreateShippingContainerComp',
    'CGP.orderitemsmultipleaddress.view.PayInfo',
    'CGP.orderitemsmultipleaddress.model.Order',
    'CGP.order.controller.Permission',
    'CGP.customerordermanagement.view.CreateQpsonOrderTotalComp'
])
Ext.define('CGP.customerordermanagement.view.CreateQpsonOrderInfo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.qpson_order_info',
    layout: {
        type: 'vbox',
        align: 'left'
    },
    defaults: {
        width: '100%',
        margin: '5 0 5 0',
    },
    bodyPadding: '0 10 20 10',
    orderData: null,
    autoScroll: true,
    diySetValue: function (data) {
        const me = this,
            toolbar = me.dockedItems.items[0],
            items = me.items.items;
        items.forEach(item => {
            var {name} = item;
            if (name) {
                item.diySetValue ? item.diySetValue(data) : item.setValue(data);
            }
        })
        toolbar.diySetValue(data);
        me.setBottomBar();
    },
    /**
     * 代付款状态下，上传了交易凭证，且未审核的，显示该按钮
     */
    setBottomBar: function () {
        var me = this,
            status = me.orderData.status.id,
            paymentStatus = me.orderData.offlinePaymentStatus,
            paymentStatusName = paymentStatus?.code,
            totalPriceString = me.orderData.totalPriceString,
            bbar = {
                xtype: 'toolbar',
                dock: 'bottom',
                itemId: 'bottom',
                hidden: !(status == '100' && paymentStatusName == 'WAITING_CONFIRM_STATUS'),
                items: [
                    {
                        text: '审核确认',
                        iconCls: 'icon_agree',
                        handler: function () {
                            var win = Ext.create('Ext.window.Window', {
                                title: '确认付款信息',
                                modal: true,
                                constrain: true,
                                layout: 'fit',
                                items: [
                                    {
                                        xtype: 'errorstrickform',
                                        defaults: {
                                            width: 450,
                                            margin: '5 25'
                                        },
                                        itemId: 'form',
                                        items: [
                                            {
                                                xtype: 'displayfield',
                                                fieldLabel: '订单金额',
                                                itemId: 'price',
                                                name: 'price',
                                                value: `<font color="red" style="font-weight: bold">${totalPriceString}</font>`
                                            },
                                            {
                                                xtype: 'hiddenfield',
                                                fieldLabel: 'orderId',
                                                itemId: 'orderId',
                                                name: 'orderId',
                                                value: JSGetQueryString('id')

                                            },
                                            {
                                                xtype: 'textarea',
                                                fieldLabel: '备注',
                                                itemId: 'remark',
                                                name: 'remark',
                                            }
                                        ]
                                    }
                                ],
                                bbar: {
                                    xtype: 'bottomtoolbar',
                                    saveBtnCfg: {
                                        handler: function (btn) {
                                            var win = btn.ownerCt.ownerCt;
                                            var form = win.getComponent('form');
                                            var url = adminPath + `api/orders/${JSGetQueryString('id')}/payment/audit`;
                                            var jsonData = form.getValue();
                                            JSAjaxRequest(url, 'POST', true, jsonData, '审核完成', function (require, success, response) {
                                                if (success) {
                                                    var responseText = Ext.JSON.decode(response.responseText);
                                                    if (responseText.success) {
                                                        Ext.Msg.alert('提醒', '审核完成', function () {
                                                            location.reload();
                                                        });
                                                    }
                                                }
                                            }, true);
                                        }
                                    }
                                }
                            });
                            win.show();
                        }
                    },
                    {
                        text: '返回列表',
                        iconCls: 'icon_grid',
                        handler: function () {
                            JSOpen({
                                id: 'page',
                                url: path + '/partials/order/order.html?statusId=101'
                            });
                        }
                    },
                    {
                        text: '刷新',
                        iconCls: 'icon_refresh',
                        handler: function () {
                            location.reload();
                        }
                    }
                ]
            };
        me.addDocked(bbar);
    },
    initComponent: function () {
        const me = this,
            orderId = JSGetQueryString('id'),
            //两个接口取出来的数据不同
            controller = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            data = controller.getQuery(adminPath + 'api/orders/' + orderId + '/v2'),
            permissions = Ext.create('CGP.order.controller.Permission'),
            record = new CGP.orderitemsmultipleaddress.model.Order(data),
            isSuccessPay = record.get('isSuccessPay');


        me.orderData = data;

        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            style: 'background-color:white;',
            color: 'black',
            itemId: 'order',
            name: 'order',
            bodyStyle: 'border-color:white;',
            diySetValue: function (data) {
                const me = this,
                    items = me.items.items;
                items.forEach(item => {
                    if (item.name) {
                        item.diySetValue ? item.diySetValue(data[item.name]) : item.setValue(data[item.name]);
                    }
                })
            },
            defaults: {
                margin: '0 0 0 30',
            },
            items: [
                {
                    margin: '0 0 0 20',
                    xtype: 'displayfield',
                    labelStyle: 'font-weight: bold',
                    labelWidth: 50,
                    fieldLabel: i18n.getKey('订单号'),
                    name: 'orderNumber',
                    itemId: 'orderNumber',
                    fieldStyle: 'color:red;font-weight: bold',
                },
                {
                    xtype: 'displayfield',
                    labelStyle: 'font-weight: bold',
                    labelWidth: 70,
                    fieldLabel: i18n.getKey('下单日期'),
                    name: 'datePurchased',
                    itemId: 'datePurchased',
                    fieldStyle: 'color:red;font-weight: bold',
                    renderer: function (value) {
                        return value ? (Ext.Date.format(new Date(+value), 'Y-m-d H:i:s')) : ('未获取到时间信息!');
                    }
                },
                {
                    xtype: 'displayfield',
                    labelStyle: 'font-weight: bold',
                    labelWidth: 40,
                    itemId: 'status',
                    name: 'status',
                    fieldLabel: i18n.getKey('状态'),
                    fieldStyle: 'color:red;font-weight: bold',
                    diySetValue: function (data) {
                        const me = this;
                        me.setValue(i18n.getKey(data.name));
                    }
                },
                '->',
                {
                    xtype: 'operationBtn',
                    record: record,
                    isMain: false,
                    margin: '0 0 0 10',
                    itemId: 'operation',
                    // hidden: top.pageType === 'preview',
                    hidden: true,
                    iconCls: 'icon_edit',
                    permissions: permissions,
                    text: i18n.getKey('操作'),
                },
                {
                    xtype: 'button',
                    margin: '0 30 0 10',
                    text: i18n.getKey('刷新'),
                    // hidden: true,
                    itemId: 'refresh',
                    iconCls: 'icon_reset',
                    handler: function (button) {
                        location.reload();
                    }
                }
            ],
        }];

        me.items = [
            {
                xtype: 'infoPreview',
                name: 'infoPreview',
                itemId: 'infoPreview'
            },
            {
                xtype: 'orderRemark',
                name: 'orderRemark',
                itemId: 'orderRemark'
            },
            {
                xtype: 'shippingInfo',
                name: 'shippingInfo',
                itemId: 'shippingInfo',
            },
            {
                xtype: 'pay_info',
                hidden: !isSuccessPay,
                name: 'payInfo',
                itemId: 'payInfo',
            },
            {
                xtype: 'shipping_container',
                name: 'shippingContainer',
                itemId: 'shippingContainer',
                margin: '5 0 10 0',
            },
            {
                xtype: 'qpson_order_total',
                order: record,
                orderId: orderId,
                itemId: 'orderTotal',
                border: false,
                header: false,
                viewConfig: {
                    style: {
                        'display': 'flex',
                        'flex-direction': 'row-reverse'
                    }
                },
            }
        ];

        me.callParent();
        me.scrollData = {
            left: 0,
            top: 0
        };
        me.compTopData = [];
        me.listeners = {
            afterrender: function (comp) {
                if (!Ext.isEmpty(data)) {
                    comp.diySetValue(data);
                    me.setStatus100Config(data.status.id, data);
                }
            },
        }
    },
    /**
     *   设置状态100对应的处理
     */
    setStatus100Config: function (status, data) {
        if (status == 100 && Ext.isEmpty(data.offlinePaymentStatus) == false && JSGetQueryString('orange') == 'bankTransfer') {
            var me = this;
            //隐藏不需要信息
            var infoPreview = me.getComponent('infoPreview');
            var orderRemark = me.getComponent('orderRemark');
            var shippingInfo = me.getComponent('shippingInfo');
            infoPreview.hide();
            orderRemark.hide();
            shippingInfo.hide();
            //隐藏工具栏上操作按钮
            var toolbar = me.getDockedItems('[itemId=order]')[0];
            toolbar?.getComponent('operation').hide();
        }
    }
})