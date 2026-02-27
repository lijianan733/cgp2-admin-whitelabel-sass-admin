/**
 *详细页
 **/
Ext.Loader.syncRequire(["CGP.shipmentrequirement.model.DeliverLineItem"]);
Ext.define('CGP.shipmentrequirement.edit', {
    extend: 'Ext.panel.Panel',
    layout: {
        type: 'vbox',
        align: 'left'
    },
    region: 'center',
    autoScroll: true,
    defaults: {
        width: '100%'
    },
    bodyPadding: '0 10 20 10',
    isValid: function () {
        var me = this;
        var isValid = true;
        var deliveryItemGrid = me.getComponent('deliveryAddress');
        var deliveryAddress = me.getComponent('deliveryItemGrid');
        if (deliveryItemGrid.isValid() == false) {
            isValid = false;
            Ext.Msg.alert(i18n.getKey('prompt'), '收货地址信息未完备');
        } else if (deliveryAddress.isValid() == false) {
            isValid = false;
            Ext.Msg.alert(i18n.getKey('prompt'), '发货项不允许为空');
        }
        return isValid;
    },
    initComponent: function () {
        var me = this;
        var configModel = null;
        var configModelId = JSGetQueryString('id');
        var isReadOnly = JSGetQueryString('isReadOnly') === 'true';
        var controller = Ext.create('CGP.shipmentrequirement.controller.Controller');
        var editOrNew = '';
        me.configModelId = configModelId;
        if (Ext.isEmpty(configModelId)) {
            editOrNew = 'new';
        } else {
            editOrNew = 'edit';
        }
        me.editOrNew = editOrNew;
        if (!Ext.isEmpty(configModelId)) {
            configModel = Ext.ModelManager.getModel("CGP.shipmentrequirement.model.DeliverLineItem");
        }
        me.tbar = {
            xtype: 'toolbar',
            border: '0 0 0 0',
            disabled: isReadOnly,
            items: [
                {
                    xtype: 'button',
                    margin: '0 0 0 10',
                    itemId: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function (btn) {
                        var panel = btn.ownerCt.ownerCt;
                        if (panel.isValid()) {
                            var data = panel.getValue();
                            if (data) {
                                controller.saveRecord(data, panel.configModelId, panel.editOrNew, panel);
                            }
                        }
                    }
                }
            ]
        };
        me.items = [
            Ext.create('CGP.shipmentrequirement.view.DeliveryAddress', {
                itemId: 'deliveryAddress',
                readOnly: isReadOnly,
                defaults: {
                    margin: '5 25 5 25',
                    labelWidth: 80,
                    width: 350,
                    msgTarget: 'side',
                    readOnly: isReadOnly
                }
            }),
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                style: {
                    borderColor: '#157fcc'
                },
                items: [
                    {
                        xtype: 'displayfield',
                        value: JSCreateFont('green', true, i18n.getKey('备注'))
                    }
                ]
            },
            {
                xtype: 'uxfieldcontainer',
                itemId: 'remarkContainer',
                layout: 'hbox',
                width: '100%',
                defaults: {
                    allowBlank: true,
                },
                items: [
                    {
                        xtype: 'textarea',
                        name: "shipRemark",
                        itemId: 'shipRemark',
                        margin: '5 25 5 25',
                        height: 80,
                        width: 350,
                        labelWidth: 90,
                        fieldLabel: i18n.getKey('发货备注')
                    },
                    {
                        xtype: 'textarea',
                        name: "customsClearanceRemark",
                        itemId: 'customsClearanceRemark',
                        margin: '5 25 5 25',
                        height: 80,
                        width: 350,
                        labelWidth: 90,
                        fieldLabel: i18n.getKey('清关备注')
                    },
                ]
            },
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                style: {
                    borderColor: '#157fcc'
                },
                items: [
                    {
                        xtype: 'displayfield',
                        value: JSCreateFont('green', true, i18n.getKey('发货信息'))
                    }
                ]
            },
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('走货方式'),
                name: 'orderDeliveryMethod',
                itemId: 'orderDeliveryMethod',
                valueField: 'key',
                displayField: 'value',
                editable: false,
                width: 350,
                margin: '5 25 5 25',
                labelWidth: 80,
                msgTarget: 'side',
                store: {
                    fields: ['key', 'value'],
                    data: [
                        {
                            key: 'ULGS',
                            value: '统一配送'
                        },
                        {
                            key: 'SELF_SUPPORT',
                            value: '自营配送'
                        }
                    ]
                },
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('生产基地'),
                name: 'finalManufactureCenter',
                itemId: 'finalManufactureCenter',
                fieldStyle: 'background-color: silver',
                hidden: true,
                readOnly: true,
                width: 350,
                labelWidth: 80,
                margin: '5 25 5 25', //仅做展示 不做提交
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        var {text} = controller.getManufactureCenterText(data),
                            result = text + '生产基地';

                        me.setValue(result);
                    }
                    me.setVisible(!!data);
                }
            },
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('发货方式'),
                name: 'shipmentMethod',
                itemId: 'shipmentMethod',
                valueField: 'code',
                displayField: 'code',
                editable: false,
                margin: '5 25 5 25',
                width: 350,
                labelWidth: 80,
                msgTarget: 'side',
                readOnly: isReadOnly,
                allowBlank: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['id', 'code'],
                    proxy: {
                        type: 'uxrest',
                        url: adminPath + 'api/shippingModules?websiteId=11&page=1&limit=1000',
                        reader: {
                            type: 'json',
                            root: 'data'
                        }
                    }
                }),
            },
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('税费承担方'),
                name: 'dutyType',
                itemId: 'dutyType',
                valueField: 'key',
                displayField: 'value',
                editable: false,
                allowBlank: false,
                width: 350,
                margin: '5 25 5 25',
                labelWidth: 90,
                msgTarget: 'side',
                store: {
                    fields: ['key', 'value'],
                    data: [
                        {
                            key: 'U',
                            value: '收件人支付'
                        },
                        {
                            key: 'P',
                            value: '寄件方支付'
                        }
                    ]
                },
            },
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                style: {
                    borderColor: '#157fcc'
                },
                items: [
                    {
                        xtype: 'displayfield',
                        value: JSCreateFont('green', true, i18n.getKey('发货项'))
                    }
                ]
            },
            Ext.create('CGP.shipmentrequirement.view.DeliveryItemGridV2', {
                configModelId: configModelId,
                margin: '5 25 5 25',
                editOrNew: editOrNew,
                itemId: 'deliveryItemGrid',
                configModel: configModel,
                readOnly: isReadOnly,
                width: '80%',
                maxHeight: 450,
            }),

        ];
        me.listeners = {
            render: function () {
                var me = this;
                if (!Ext.isEmpty(me.configModelId)) {
                    configModel.load(Number(me.configModelId), {
                        success: function (record, operation) {
                            configModel = record;
                            var form = me.down('form'),
                                shipmentMethod = me.getComponent('shipmentMethod'),
                                orderDeliveryMethod = me.getComponent('orderDeliveryMethod'),
                                deliveryItemGrid = me.getComponent('deliveryItemGrid'),
                                remarkContainer = me.getComponent('remarkContainer'),
                                finalManufactureCenter = me.getComponent('finalManufactureCenter'),
                                shipRemark = remarkContainer.getComponent('shipRemark'),
                                customsClearanceRemark = remarkContainer.getComponent('customsClearanceRemark'),
                                dutyType = me.getComponent('dutyType'),
                                address = record.get('address');

                            deliveryItemGrid.setValue(record.get('items'));
                            form.setValue(address);
                            shipRemark.setValue(record.get('shipRemark'));
                            customsClearanceRemark.setValue(record.get('customsClearanceRemark'));
                            shipmentMethod.setValue(record.get('shipmentMethod'));
                            dutyType.setValue(record.get('dutyType'));
                            orderDeliveryMethod.setValue(record.get('orderDeliveryMethod'));
                            finalManufactureCenter.diySetValue(record.get('finalManufactureCenter'));

                            if (configModelId) {
                                orderDeliveryMethod.setReadOnly(true);
                                orderDeliveryMethod.setFieldStyle('background-color: silver');
                            }
                        }
                    });
                }
            }
        }
        me.callParent(arguments);
        me.form = me.down('form');
    },
    getValue: function () {
        var me = this,
            result = null,
            data = {},
            deliveryItems = [],
            deliveryItemGrid = me.getComponent('deliveryItemGrid');
        deliveryItems = deliveryItemGrid.getValue();
        var address = me.form.getValue();
        var shipmentMethod = me.getComponent('shipmentMethod');
        var dutyType = me.getComponent('dutyType');
        var remarkContainer = me.getComponent('remarkContainer');
        var shipRemark = remarkContainer.getComponent('shipRemark');
        var customsClearanceRemark = remarkContainer.getComponent('customsClearanceRemark');
        var orderDeliveryMethod = me.getComponent('orderDeliveryMethod');
        address.clazz = 'com.qpp.cgp.domain.user.AddressBook';
        data.address = address;
        data.items = deliveryItems;
        data.clazz = 'com.qpp.cgp.domain.shipment.ShipmentRequirementItem';
        data.dutyType = dutyType.getValue();
        data.shipmentMethod = shipmentMethod.getValue();
        data.orderDeliveryMethod = orderDeliveryMethod.getValue();
        data.shipRemark = shipRemark.getValue();
        data.customsClearanceRemark = customsClearanceRemark.getValue();

        // 验证发货项是否合法
        const deliveryItemGridIsValid = deliveryItemGrid.diyIsValid(deliveryItems);

        if (deliveryItemGridIsValid) {
            result = data;
        } else {
            result = null;
        }

        return result;
    }

});
