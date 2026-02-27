/**
 * @author xiu
 * @date 2025/12/18
 */
Ext.Loader.setPath({
    enabled: true,
    "CGP.orderdetails": path + "partials/order/details/app"
});
Ext.Loader.syncRequire([
    'CGP.orderdetails.view.render.OrderLineItemRender',
    'CGP.order.controller.Permission',
    'CGP.orderitemsmultipleaddress.model.Order',
    'CGP.orderdetails.view.details.OrderLineItem',
    'CGP.orderitemsmultipleaddress.view.singleAddress.tool.operationBtn',
    'CGP.orderitemsmultipleaddress.view.auditContentGrid',
    'CGP.orderitemsmultipleaddress.store.AuditContentPageStore'
])
Ext.define('CGP.orderitemsmultipleaddress.view.auditContentPage', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.audit_content_page',
    layout: 'fit',
    diySetValue: function (data) {
        const me = this,
            toolbar = me.dockedItems.items[0],
            items = me.items.items;
/*
        items.forEach(item => {
            item.diySetValue(data);
        })*/
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
    /**
     *   设置状态100对应的处理
     */
    setStatus100Config: function (status, data) {
        if (status === 100 && Ext.isEmpty(data.offlinePaymentStatus) === false && JSGetQueryString('orange') === 'bankTransfer') {
            var me = this,
                toolbar = me.getDockedItems('[itemId=order]')[0];

            //隐藏工具栏上操作按钮
            toolbar?.getComponent('operation').hide();
        }
    },
    initComponent: function () {
        var me = this,
            orderId = JSGetQueryString('id'),
            //两个接口取出来的数据不同
            controller = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            data = JSGetQuery(adminPath + 'api/orders/' + orderId + '/v2'),
            permissions = Ext.create('CGP.order.controller.Permission'),
            record = new CGP.orderitemsmultipleaddress.model.Order(data),
            remark = record.get('remark'),
            orderStatusId = record.get('status').id,
            orderLineItemStore = Ext.create('CGP.orderitemsmultipleaddress.store.AuditContentPageStore', {
                orderId: orderId,
            });

        me.orderData = data;

        me.dockedItems = [
            {
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
                        xtype: 'displayfield',
                        margin: '0 0 0 20',
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
                        hidden: true,
                        iconCls: 'icon_edit',
                        permissions: permissions,
                        text: i18n.getKey('操作'),
                    },
                    {
                        xtype: 'button',
                        margin: '0 30 0 10',
                        text: i18n.getKey('刷新'),
                        itemId: 'refresh',
                        iconCls: 'icon_reset',
                        handler: function (button) {
                            location.reload();
                        }
                    }
                ],
            }
        ];

        me.items = [
            {
                xtype: 'container',
                itemId: 'container',
                layout: 'fit',
                width: '100%',
                items: [
                    { //订单项信息
                        xtype: 'audit_content_grid',
                        width: '100%',
                        height: 700,
                        itemId: 'orderLineInfo',
                        diySetValue: Ext.emptyFn,
                        diyGetValue: Ext.emptyFn,
                        getName: Ext.emptyFn,
                        fieldLabel: '',
                        dockedItems: [],
                        hiddenTitle: true,
                        hiddenCustomsCategory: true,
                        selModel: {
                            mode: 'SINGLE'
                        },
                        order: record,
                        remark: remark,
                        orderId: orderId,
                        store: orderLineItemStore,
                        orderStatusId: orderStatusId,
                        isShowClickItem:{
                            changeUserDesignBtn: false,
                            builderPageBtn: false,
                            customsCategoryBtn: false,
                            viewUserStuffBtn: false,
                            buildPreViewBtn: false,
                            contrastImgBtn: false,
                            builderCheckHistoryBtn: false
                        },
                        pageType: 'auditContentGridPage',
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
                ]
            },
        ];

        me.callParent(arguments);
        me.listeners = {
            afterrender: function (comp) {
                if (!Ext.isEmpty(data)) {
                    comp.diySetValue(data);
                    me.setStatus100Config(data.status.id, data);
                }
            }
        }
    }
})