/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.splitBarTitle',
])
//账单地址信息
Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.addressInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.addressInfo',
    bodyStyle: 'border-top:0;border-color:white;',
    defaults: {
        labelAlign: 'left',
    },
    margin: '5 0 5 0',
    layout: 'hbox',
    data: null,
    hiddenDeliveryAddress: false,
    hiddenBillingAddress: false,
    diySetValue: function (data) {
        const me = this,
            {statusId} = me,
            items = me.items.items;

        items?.forEach(item => {
            if (item?.name && data) {
                item?.diySetValue(data[item?.name]);
            }
        })
    },
    initComponent: function () {
        const me = this,
            {statusId, data, isLock} = me,
            {shipmentOrder, shipmentRequirement} = data,
            isHiddenEditAddressBtn = isLock || !!shipmentOrder  //1.锁单的 2.存在发货单的

        me.items = [
            //收件人地址信息
            {
                xtype: 'container',
                layout: 'vbox',
                flex: 1,
                itemId: 'deliveryAddress',
                name: 'deliveryAddress',
                hidden: me.hiddenDeliveryAddress,
                defaults: {
                    margin: '5 0 5 20',
                },
                diySetValue: function (data) {
                    const me = this,
                        container = me.getComponent('container');
                    container.diySetValue(data)
                },
                items: [
                    {
                        xtype: 'splitBarTitle',
                        margin: '0 0 3 6',
                        title: '收件人地址信息',
                        addButton: [
                            /*{
                                xtype: 'button',
                                itemId: 'editAddress',
                                isSpread: true,
                                text: '修改地址',
                                hidden: isHiddenEditAddressBtn,
                                handler: function (btn) {
                                    var controller = Ext.create('CGP.orderstatusmodify.view.orderitemsmultipleaddress.controller.Controller'),
                                        {data} = me,
                                        {shipmentOrder, deliveryAddress} = data,
                                        deliveryAddress1 = {
                                            "shipmentOrderId": shipmentOrder?.id,
                                            "addressBook": deliveryAddress,
                                            "shipMethod": shipmentOrder?.selectedShipmentMethod
                                        }
                                    controller.editReceiverAddress(deliveryAddress1, function () {
                                        location.reload();
                                    });
                                }
                            },*/
                            {
                                xtype: 'button',
                                itemId: 'editShipmentRequirement',
                                isSpread: true,
                                text: '修改地址',
                                hidden: isHiddenEditAddressBtn,
                                handler: function (btn) {
                                    var controller = Ext.create('CGP.orderstatusmodify.view.orderitemsmultipleaddress.controller.Controller'),
                                        shipmentRequirementId = shipmentRequirement?.id;

                                    controller.editShipmentRequirementAddress(shipmentRequirementId, function () {
                                        location.reload();
                                    });
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        width: '100%',
                        itemId: 'container',
                        layout: 'vbox',
                        defaultType: 'displayfield',
                        defaults: {
                            margin: '5 0 5 20',
                            width: '90%',
                        },
                        diySetValue: function (data) {
                            var me = this;
                            if (data) {
                                var result = JSBuildAddressInfo(data);
                                var addressInfo = me.getComponent('addressInfo');
                                addressInfo.setValue(result);
                            }
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                itemId: 'addressInfo'
                            }
                        ]
                    },
                ]
            },
            //账单地址信息
            {
                xtype: 'container',
                itemId: 'billingAddress',
                name: 'billingAddress',
                layout: 'vbox',
                flex: 1,
                hidden: me.hiddenBillingAddress,
                defaults: {
                    margin: '5 0 5 20',
                },
                diySetValue: function (data) {
                    const me = this,
                        container = me.getComponent('container');
                    container.diySetValue(data);
                    if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
                        me.hide();
                    }
                },
                items: [
                    {
                        xtype: 'splitBarTitle',
                        margin: '0 0 3 6',
                        title: '账单地址信息'
                    },
                    {
                        xtype: 'container',
                        width: '100%',
                        itemId: 'container',
                        layout: 'vbox',
                        defaultType: 'displayfield',
                        defaults: {
                            margin: '5 0 5 20',
                            width: '90%',
                        },
                        diySetValue: function (data) {
                            var me = this;
                            if (data) {
                                var result = JSBuildAddressInfo(data);
                                var addressInfo = me.getComponent('addressInfo');
                                addressInfo.setValue(result);
                            }
                        },
                        items: [{
                            xtype: 'displayfield',
                            itemId: 'addressInfo'
                        }]
                    },
                ]
            },
        ];
        me.callParent();
        me.listeners = {
            afterrender: function (comp) {
                comp.diySetValue(comp.data);
            }
        }
    },
})