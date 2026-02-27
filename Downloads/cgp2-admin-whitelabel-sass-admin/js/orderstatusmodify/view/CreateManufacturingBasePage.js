/**
 * @author xiu
 * @date 2025/4/22
 */
// 命名空间
Ext.Loader.setPath({
    enabled: true,
    "CGP.orderdetails": path + "partials/order/details/app"
});
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.Order',
    'CGP.orderdetails.view.render.OrderLineItemRender',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.OrderLineItem',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.orderItemListV2',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.addressInfo',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.newOrderItemList',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.shippingInfo',
])
Ext.define('CGP.orderstatusmodify.view.CreateManufacturingBasePage', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.manufacturing_base_page',
    layout: 'fit',
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
            result = {
                name: '等待发货',
                id: null
            };
        }

        return result;
    },
    initComponent: function () {
        var me = this,
            mainRenderer = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            controller = Ext.create('CGP.orderstatusmodify.controller.Controller'),
            shippingDetailsId = JSGetQueryString('shippingDetailsId'),
            orderStatusModifyData = mainRenderer.getMultiAddressDeliveryDetailData(shippingDetailsId),
            record = new CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.Order(orderStatusModifyData),
            shipmentRequirement = record.get('shipmentRequirement'),
            statusId = me.getStatusName(record).id,
            {isLock, id, finalManufactureCenter} = shipmentRequirement,
            testMergeTableCellStore = mainRenderer.createTestMergeTableCellStore(id, finalManufactureCenter);

        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                disabled: isLock,
                handler: function (btn) {
                    var me = btn.ownerCt.ownerCt,
                        form = me.getComponent('form'),
                        orderItem = form.getComponent('orderItem'),
                        {manufactureCenter} = me.getValue(),
                        manufactureCenterText = mainRenderer.getManufactureCenterText(manufactureCenter)['text'];

                    if (form.isValid()) {
                        controller.editManufactureCenterQuery(shippingDetailsId, manufactureCenter, function () {
                            // 设置生产基地文本
                            orderItem.setManufactureCenterText(manufactureCenterText + '生产基地');
                            Ext.Msg.alert('提示', '修改成功!');
                        })
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('refresh'),
                iconCls: 'icon_refresh',
                handler: function (btn) {
                    location.reload();
                }
            },
            {
                xtype: 'button',
                componentCls: "btnOnlyIcon",
                tooltip: '已锁定发货要求,不允许修改生产基地',
                hidden: !isLock,
                text: JSCreateFont('red', true, '(已锁定)'),
            },
        ]
        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                diyGetValue: function () {
                    var result = {},
                        me = this,
                        items = me.items.items;

                    items.forEach(item => {
                        var {name} = item;
                        if (name) {
                            result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                        }
                    })

                    return result;
                },
                defaults: {
                    margin: '40 25 0 25',
                    // allowBlank: false,
                },
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: JSCreateFont('red', 'true', i18n.getKey('生产基地'), 15),
                        name: 'manufactureCenter',
                        itemId: 'manufactureCenter',
                        margin: '30 25 0 45',
                        isLike: false,
                        editable: false,
                        allowBlank: false,
                        // haveReset: true,
                        displayField: 'key',
                        valueField: 'value',
                        labelWidth: 80,
                        width: 300,
                        value: finalManufactureCenter,
                        store: {
                            fields: ['key', 'value'],
                            data: [
                                {
                                    'key': '东莞生产基地',
                                    'value': "PL0001"
                                },
                                {
                                    'key': '越南生产基地',
                                    'value': "PL0003"
                                }
                            ]
                        },
                        listeners: {
                            change: function (comp, value, oldValue) {
                                if (value === 'PL0003') {
                                    controller.verifyManufactureCenterQuery(shippingDetailsId, value, function (data) {
                                        if (data?.length) {
                                            var isFalseItem = data.filter(item => {
                                                    return !item['checkResult'];
                                                }),
                                                orderItemSortArray = isFalseItem.map(item => item['orderItemSort']),
                                                orderItemSortText = JSCreateFont('red', true, orderItemSortArray.join(','));

                                            if (isFalseItem.length) {
                                                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey(`以下订单项序号为 ${orderItemSortText} 的订单不符合去越南生产基地的生产要求,是否继续选择越南生产基地?`), function (selector) {
                                                    if (selector === 'yes') {

                                                    } else {
                                                        comp.setValue(oldValue)
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    },
                    {
                        xtype: 'addressInfo',
                        isLock: true, //默认不可改
                        statusId: statusId,
                        hiddenBillingAddress: true,
                        data: orderStatusModifyData,
                    },
                    {
                        xtype: 'newOrderItemListV2',
                        store: testMergeTableCellStore,
                        itemId: 'orderItem',
                        margin: '20 25',
                        width: 1600,
                        manufactureCenterCoed: finalManufactureCenter,
                        listeners: {
                            afterrender: function (comp) {
                                // 合并表单列
                                testMergeTableCellStore.on('load', () => {
                                    JSMergeCells(comp, 'mergeAssign', [1]);
                                })
                            },
                        }
                    },
                ]
            }
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this,
            form = me.getComponent('form');

        return form.diyGetValue();
    },
    setValue: function (data) {
        var me = this,
            form = me.getComponent('form');

        form.setValue(data);
    }
})