/**
 * @author xiu
 * @date 2025/3/26
 */
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.splitBarTitle',
    'CGP.customerordermanagement.store.CustomerOrderItemStore',
    'CGP.customerordermanagement.store.CustomerOrderTotalInfoStore',
    'CGP.customerordermanagement.view.CreateCustomerOrderTotalComp'
])
Ext.define('CGP.customerordermanagement.view.CreateCustomerOrderInfo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.customer_order_info',
    // title: i18n.getKey('店铺订单详情'),
    layout: 'fit',
    autoScroll: true,
    symbolLeft: '',
    totalWeight: '',
    initComponent: function () {
        var me = this,
            customerId = JSGetQueryString('customerId'),
            controller = Ext.create('CGP.customerordermanagement.controller.Controller'),
            {config, test} = Ext.create('CGP.customerordermanagement.defaults.CustomerordermanagementDefaults'),
            customerRecord = controller.getCustomerOrderData(customerId),
            customerCode = customerRecord.get('customerCode'),
            customerStatus = customerRecord.get('customerStatus'),
            bindOrderNumber = customerRecord.get('bindOrderNumber'),
            {customer_order_info} = config,
            {columnsText, filtersText} = customer_order_info,
            columns = controller.getColumnsType(columnsText),
            filters = controller.getFiltersType(filtersText),
            isPopUpType = customerCode === 'PopUp',
            isCancelStatus = customerStatus === 'cancelled',
            orderTotalStore = Ext.create('CGP.customerordermanagement.store.CustomerOrderTotalInfoStore'),
            orderItemStore = Ext.create('CGP.customerordermanagement.store.CustomerOrderItemStore', {
                customerId: customerId,
            });

        me.tbar = {
            defaults: {
                margin: '2 10'
            },
            items: [
               /* {
                    xtype: 'displayfield',
                    labelWidth: 70,
                    value: JSCreateFont('#000', true, bindOrderNumber, 20)
                },*/
                {
                    xtype: 'button',
                    text: i18n.getKey('进入网店后台查看订单'),
                    toolTip: '仅限于pop-up store订单',
                    iconCls: 'icon_grid',
                    hidden: !isPopUpType,
                    handler: function (btn) {
                        Ext.Msg.alert('提示','该功能还在开发中...')
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('下载发票'),
                    iconCls: 'icon_export',
                    hidden: true,
                    handler: function (btn) {
                        Ext.Msg.confirm('提示', '是否确定下载发票？', function (select) {
                            if (select === 'yes') {

                            }
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('refresh'),
                    iconCls: 'icon_refresh',
                    handler: function (btn) {
                        location.reload();
                    }
                }
            ]
        }
        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                defaults: {
                    margin: '2 10',
                    minWidth: 700,
                },
                items: [
                    {
                        xtype: 'splitBarTitle',
                        title: '店铺订单信息',
                        margin: '5 10',
                        btnSetContainerHideId: 'orderInfoContainer'
                    },
                    {
                        xtype: 'uxfieldcontainer',
                        itemId: 'orderInfoContainer',
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        defaults: {
                            xtype: 'displayfield',
                            labelWidth: 150,
                            margin: '2 25',
                            fontSize: 15,
                            fontColor: '#666',
                            diySetValue: function (data) {
                                var me = this,
                                    {fontColor, fontSize} = me,
                                    text = data || ''

                                me.setValue(controller.getText(fontColor, text, fontSize));
                                me.setVisible(!!data);
                            }
                        },
                        width: '100%',
                        items: [
                            {
                                fieldLabel: controller.getText('#666', '店铺单状态', 20),//Shopify Status
                                value: 'paid',
                                margin: '25 25 15 25',
                                fontSize: 20,
                                fontColor: '#666',
                                name: 'shopifyStatus',
                                itemId: 'shopifyStatus',
                            },
                            {
                                fieldLabel: controller.getText('#000', '总计', 30), //Total
                                value: 'US$ 554.22',
                                float: 'right',
                                labelWidth: 80,
                                margin: '5 25 15 600',
                                fontSize: 30,
                                fontColor: 'red',
                                name: 'total',
                                itemId: 'total',
                                minWidth: 300
                            },
                            {
                                fieldLabel: controller.getText('#000', '店铺名称', 15), //Store name
                                value: 'leveilee-prod',
                                colspan: 2,
                                name: 'storeName',
                                itemId: 'storeName',
                            },
                            {
                                fieldLabel: controller.getText('#000', '账单地址', 15), //Billing address
                                colspan: 2,
                                name: 'billingAddress',
                                itemId: 'billingAddress',
                            },
                            {
                                fieldLabel: controller.getText('#000', '收件人地址', 15), //Shipping address
                                colspan: 2,
                                name: 'shippingAddress',
                                itemId: 'shippingAddress',
                            },
                            {
                                fieldLabel: controller.getText('#000', '发货方式', 15), //Delivery type
                                colspan: 2,
                                name: 'deliveryType',
                                itemId: 'deliveryType',
                            },
                        ],
                        listeners: {
                            afterRender: function (comp) {
                                if (customerRecord) {
                                    var customerName = customerRecord.get('customerName'),
                                        storeOrderAmount = customerRecord.get('storeOrderAmount'),
                                        customerStatus = customerRecord.get('customerStatus'),
                                        deliveryAddressText = customerRecord.get('deliveryAddressValue'),
                                        billingAddressText = customerRecord.get('billingAddressValue'),
                                        shippingMethod = customerRecord.get('shippingMethod'),
                                        totalWeight = customerRecord.get('totalWeight'),
                                        symbolLeft = customerRecord.get('symbolLeft');

                                    me.totalWeight = totalWeight;
                                    me.symbolLeft = symbolLeft;

                                    comp.setValue({
                                        shopifyStatus: i18n.getKey(customerStatus),
                                        total: storeOrderAmount,
                                        storeName: customerName,
                                        billingAddress: billingAddressText,
                                        shippingAddress: deliveryAddressText,
                                        deliveryType: shippingMethod,
                                    });
                                }
                            }
                        }
                    },
                    {
                        xtype: 'splitBarTitle',
                        title: '订单项列表',
                        margin: '25 10',
                        btnSetContainerHideId: 'orderItemListContainer',
                        addButton: [
                            {
                                xtype: 'button',
                                iconCls: 'icon_expandAll',
                                text: '切换全屏',
                                handler: function (btn) {
                                    var fieldset = btn.ownerCt.ownerCt,
                                        orderItemListContainer = fieldset.getComponent('orderItemListContainer'),
                                        grid = orderItemListContainer.getComponent('grid');

                                    JSCreateToggleFullscreenWindowGrid('订单项列表', grid, {
                                        tbar: {
                                            hidden: true
                                        }
                                    })
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'uxfieldcontainer',
                        itemId: 'orderItemListContainer',
                        layout: 'vbox',
                        margin: '2 10 25 10',
                        defaults: {
                            margin: '0 25',
                            width: '80%',
                            minWidth: 700,
                        },
                        width: '100%',
                        items: [
                            {
                                xtype: 'grid',
                                itemId: 'grid',
                                store: orderItemStore,
                                maxHeight: 450,
                                columns: Ext.Array.merge([
                                    {
                                        xtype: 'rownumberer',
                                        tdCls: 'vertical-middle',
                                        align: 'center',
                                        width: 60
                                    }
                                ], columns || []),
                                bbar: {
                                    xtype: 'pagingtoolbar',
                                    store: orderItemStore,
                                    displayInfo: true, // 是否 ? 示， 分 ? 信息
                                    displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                    emptyText: i18n.getKey('noDat')
                                }
                            },
                            {
                                xtype: 'toolbar',
                                itemId: 'orderTotalContainer',
                                padding: 0,
                                layout: 'hbox',
                                border: false,
                                minWidth: 700,
                                items: [
                                    {//店铺订单零售价
                                        xtype: 'customer_order_total',
                                        itemId: 'customerOrderTotal',
                                        border: false,
                                        margin: 0,
                                        header: false,
                                        width: '50%',
                                        minWidth: 500,
                                        store: orderTotalStore,
                                        listeners: {
                                            afterrender: function (comp) {
                                                controller.getCustomerOrderTotalInfo(customerId, me.totalWeight, me.symbolLeft, function (data) {
                                                    comp.store.proxy.data = data;
                                                    comp.store.load();
                                                })
                                            }
                                        }
                                    },
                                    '->',
                                    {
                                        xtype: 'uxfieldcontainer',
                                        itemId: 'buttonContainer',
                                        layout: 'vbox',
                                        defaults: {
                                            xtype: 'button',
                                            width: 150,
                                            height: 30,
                                            margin: '5 0 5 0',
                                            ui: 'default-toolbar-small',
                                        },
                                        items: [
                                            {
                                                text: JSCreateFont('red', true, i18n.getKey('删除')),
                                                margin: '0 0 5 0',
                                                iconCls: 'icon_delete',
                                                handler: function (btn) {
                                                    Ext.Msg.confirm('提示', '是否删除该订单？', function (select) {
                                                        if (select === 'yes') {
                                                            controller.deleteCustomerOrderFn(customerId, function () {
                                                                var tabs = top.Ext.getCmp('tabs'),
                                                                    panel = tabs.getActiveTab();

                                                                me.jumpOpenPage();
                                                                tabs.remove(panel);
                                                            })
                                                        }
                                                    });
                                                }
                                            },
                                            {
                                                text: i18n.getKey('取消订单'),
                                                hidden: isCancelStatus || !isPopUpType,
                                                iconCls: 'icon_cancel',
                                                handler: function (btn) {
                                                    Ext.Msg.confirm(i18n.getKey('prompt'), '是否取消该订单!', function (selector) {
                                                        if (selector === 'yes') {
                                                            controller.cancelCustomerOrderFn(customerId, function () {
                                                                location.reload();
                                                            })
                                                        }
                                                    });
                                                }
                                            },
                                            {
                                                text: i18n.getKey('退款'),
                                                tooltip: '仅限于pop-up store订单',
                                                hidden: isCancelStatus || !isPopUpType,
                                                iconCls: 'icon_refund',
                                                handler: function (btn) {
                                                    Ext.Msg.confirm('提示', '是否确定退款？', function (select) {
                                                        if (select === 'yes') {
                                                            JSOpen({
                                                                id: 'customer_orderrefund_edit',
                                                                url: path + 'partials/custormer_order_refund/edit.html' +
                                                                    '?customerOrderId=' + customerId +
                                                                    '&refundOrderType=' + 'CustomerOrder',
                                                                title: i18n.getKey('create') + i18n.getKey('refundApply'),
                                                                refresh: true
                                                            });
                                                        }
                                                    });
                                                }
                                            },
                                        ]
                                    }
                                ]
                            }
                        ],
                    }
                ]
            }
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this,
            form = me.getComponent('form');
        return form.getValue();
    },
    setValue: function (data) {
        var me = this,
            form = me.getComponent('form');
        form.setValue(data);
    }
})