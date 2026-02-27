Ext.define('CGP.deliveryorder.view.Status', {
    extend: 'Ext.form.Panel',
    alias: 'widget.deliveryorderstatus',
    requires: [
        'CGP.deliveryorder.view.shipment.ShipmentInfo',
        'CGP.deliveryorder.view.shipment.ShipmentBox',
        'CGP.deliveryorder.view.shipment.ShipmentBoxView',
        'CGP.deliveryorder.model.DeliveryInfoModel'
    ],
    
    region: 'center',
    autoScroll: true,
    defaults: {
        labelWidth: 120,
        width: 500,
        msgTarget: 'under',
        labelAlign: 'right',
        readOnly: JSGetQueryString('isReadOnly') === 'true'
    },
    setModifyStatusData: function (record) {
        var me = this,
            result = [],
            statusId = parseInt(JSGetQueryString('statusId')),
            controller = Ext.create('CGP.deliveryorder.controller.Controller'),
            orderDeliveryMethod = record.get('orderDeliveryMethod'),
            orderStatusUrl = adminPath + 'api/shipmentOrderStatus?page=1&limit=100',
            orderStatus = controller.getQuery(orderStatusUrl),
            orderStatusComp = me.getComponent('orderStatus');

        if (orderDeliveryMethod === 'ULGS') {
            if ([121, 122, 106, 107, 108].includes(statusId)) {
                orderStatus.forEach(item => {
                    const {id} = item;
                    if (![121, 122, 106, 107, 108].includes(id)) {
                        result.push(item);
                    }
                })
            }
        } else {
            orderStatus.forEach(item => {
                result.push(item);
            })
        }

        orderStatusComp.store.proxy.data = result;
        orderStatusComp.store.load();
    },
    initComponent: function () {
        var me = this,
            id = me.ordeId,
            controller = Ext.create('CGP.deliveryorder.controller.Controller'),
            resultStatus = [];

        me.isReadOnly = JSGetQueryString('isReadOnly') === 'true';
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                disabled: me.isReadOnly,
                itemId: 'save',
                handler: function () {
                    var data = me.getData();
                    var statusId = data.statusId;
                    if (me.isValid()) {
                        var mask = me.setLoading();
                        controller.saveRecord(me.record, statusId, data, mask);
                    }
                }
            },
            {
                xtype: 'button',
                //hidden: true,
                itemId: 'printLabel',
                text: i18n.getKey('打印label'),
                iconCls: 'icon_audit',
                handler: function (btn) {
                    var record = btn.ownerCt.ownerCt.record;
                    var controller = Ext.create('CGP.order.controller.Order');
                    controller.printLabel(record.get('id'));
                }
            },
            {
                xtype: 'button',
                itemId: 'prompt',
                componentCls: "btnOnlyIcon",
                tooltip: '统一配送状态,不允许直接修改订单',
                text: JSCreateFont('red', true, '提示: ' + '统一配送'),
            }
        ];
        me.items = [
            {
                fieldLabel: i18n.getKey('deliveryAddress'),
                name: 'deliveryAddress',
                xtype: 'displayfield',
                itemId: 'deliveryAddress',
            },
            {
                fieldLabel: i18n.getKey('orderStatus'),
                name: 'status',
                xtype: 'displayfield',
                itemId: 'currentStatus',
                renderer: function (value) {
                    return '<div class="status-field">' + i18n.getKey(value) + '</div>';
                }
            },
            {
                fieldLabel: i18n.getKey('modifyStatus'),
                itemId: 'orderStatus',
                name: 'status',
                xtype: 'combobox',
                editable: false,
                displayField: 'frontendName',
                valueField: 'id',
                allowBlank: false,
                listeners: {
                    select: function (combo, records) {
                        var record = records[0];
                        me.addContentBySelectedStatus(record.get('id'));
                    }
                },
                store: new Ext.data.Store({
                    fields: [
                        {
                            name: 'id',
                            type: 'int'
                        },
                        {name: 'name', type: 'string'}, {
                            name: 'frontendName',
                            type: 'string'
                        }
                    ],
                    proxy: {
                        type: 'memory',
                        data: resultStatus
                    },
                    autoLoad: true
                })
            }, 
            {
                fieldLabel: i18n.getKey('deliveryDate'),
                xtype: 'datefield',
                name: 'deliveryDate',
                itemId: 'deliveryDate',
                hidden: true,
                format: system.config.dateFormat,
                value: new Date(),
                allowBlank: false
            },
            {
                fieldLabel: i18n.getKey('receivedDate'),
                xtype: 'datefield',
                name: 'receivedDate',
                itemId: 'receivedDate',
                hidden: true,
                format: system.config.dateFormat,
                value: new Date(),
                allowBlank: false
            },
            {
                fieldLabel: i18n.getKey('统一发货单号'),
                name: 'shipmentNo',
                hidden: true,
                xtype: 'displayfield',
                itemId: 'shipmentNo',
            },
            {
                xtype: "fieldcontainer",
                border: false,
                fieldLabel: i18n.getKey('orderHistories'),
                itemId: 'orderHistoriesContainer',
                autoScroll: true,
                maxHeight: 300,
                width: 700,
                items: [
                    {
                        fieldLabel: false,
                        name: 'statusHistories',
                        xtype: 'displayfield',
                        width: '100%',
                        itemId: 'orderHistories'
                    }
                ]

            }
        ];
        me.callParent(arguments);
        me.orderHistoriesField = me.getComponent('orderHistoriesContainer').getComponent("orderHistories");
        me.deliveryAddressField = me.getComponent('deliveryAddress');
        me.currentStatusField = me.getComponent('currentStatus');
        me.deliveryNo = me.getComponent('deliveryNo');
        me.deliveryHistory = me.getComponent('deliveryHistory');
    },
    getData: function () {
        var me = this;
        var data = {};
        var status = me.getComponent('orderStatus').getValue();
        //paid date
        var paidDateField = me.getComponent('receivedDate');
        var receivedDate = null;
        if (paidDateField.isVisible()) {
            var receivedDate = paidDateField.getValue().getTime();
        }
        //shipment info
        var shipmentInfoField = me.getComponent('shipmentInfo');
        var shipmentInfo = null;
        if (shipmentInfoField && shipmentInfoField.isVisible()) {
            if (!shipmentInfoField.isValid()) {
                throw new Error('not valid');
            }
            shipmentInfo = shipmentInfoField.getValue();
        }


        //shipment box var
        var shipmentBoxField = me.getComponent('shipmentBox');
        var shipmentBox = null;
        if (shipmentBoxField && shipmentBoxField.isVisible()) {
            if (!shipmentBoxField.isValid()) {
                throw new Error('not valid');
            }
            shipmentBox = shipmentBoxField.getValue();
            Ext.Array.each(shipmentBox, function (shipmentBoxItem) {
                shipmentBoxItem.clazz = 'com.qpp.cgp.domain.shipment.ShipmentBox';
                Ext.Array.each(shipmentBoxItem.productItems, function (boxProductItem) {
                    boxProductItem.clazz = 'com.qpp.cgp.domain.shipment.ShipmentBoxProductItem';
                })
            });
        }
        data = {
            statusId: status,
            receivedDate: receivedDate,
            shipmentInfo: shipmentInfo,
            shipmentBoxes: shipmentBox
        };

        return data;
    },

    setData: function (record) {
        var me = this,
            orderDeliveryMethod = record.get('orderDeliveryMethod'),
            toolbar = me.getDockedItems('toolbar[dock="top"]')[0],
            save = toolbar.getComponent('save'),
            prompt = toolbar.getComponent('prompt'),
            shipmentNo = me.getComponent('shipmentNo')
        ;

        me.record = record;
        me.orderNumber = record.get('orderNumber');
        me.loadRecord(record);
        me.setDeliveryAddress(record);
        me.setOrderHistories(record.get('statusHistories'));
        me.setDeliveryHistory(record);
        me.setOrderStatus(record.get('status'));
        me.setDeliveryHistory(record)
        me.initPrintLabel(record);
        var statusId = record.get('status').id;
        if (Ext.Array.contains([103, 104, 105], statusId)) {
            //.deliveryNo.setVisible(true);
            var shipmentInfo = record.get('shipmentInfo');
            if (!Ext.isEmpty(shipmentInfo)) {
                //me.deliveryNo.setValue(shipmentInfo.deliveryNo);
            }
        }
        //检查是是否处于已交收状态 显示运费信息和装箱信息
        me.setContentByStatusId(statusId);
        me.setModifyStatusData(record);
        //统一配送禁用保存
        save.setDisabled(orderDeliveryMethod === 'ULGS');
        prompt.setVisible(orderDeliveryMethod === 'ULGS');
        shipmentNo.setVisible(orderDeliveryMethod === 'ULGS' && !Ext.isEmpty(record.get('shipmentNo')));
    },
    //设置以往发货历史
    setDeliveryHistory: function (record) {
        var me = this;
        var shipmentInfoHistories = record.get('shipmentInfoHistories');
        if (!shipmentInfoHistories || shipmentInfoHistories.length == 0) {
            return;
        }
        if (me.deliveryHistory._grid.rendered) {
            me.deliveryHistory.show();
            me.deliveryHistory._grid.store.loadData(record.get('shipmentInfoHistories'));
            me.deliveryHistory.setDisabled(false);

        } else {
            me.deliveryHistory._grid.on('afterrender', function (view) {
                me.deliveryHistory.show();
                me.deliveryHistory._grid.store.loadData(record.get('shipmentInfoHistories'));
                me.deliveryHistory.setDisabled(false);
            })
        }
    },
    setContentByStatusId: function (statusId) {
        var me = this,
            record = this.record, shipmentInfo;
        if (Ext.Array.contains([103, 104, 105], statusId)) {
            shipmentInfo = me.initShipmentInfo();
            shipmentInfo.setVisible(true);
            //me.initShipmentBoxView();
        }
    },

    setDeliveryAddress: function (record) {
        var me = this;
        var deliveryAddress = record.get('address');
        var result = JSBuildAddressInfo(deliveryAddress);
        me.deliveryAddressField.setValue('<div class="status-field">' + result + '</div>');
    },

    setOrderHistories: function (histories) {
        var me = this;
        var wrapHis = [];
        var isRedo = JSGetQueryString('isRedo');
        var needRedoNo = 0;
        Ext.Array.each(histories, function (history, index) {
            var his;
            var modifiedUser = history.user;
            if (Ext.isEmpty(modifiedUser)) {
                modifiedUser = {};
                modifiedUser.emailAddress = 'system';
            }
            var statusName = history.shipmentOrderStatus.frontendName;
            statusName = i18n.getKey(statusName);
            var historyDate = Ext.isEmpty(history.createdDate) ? history.modifiedDate : history.createdDate;
            his = '(' + (index + 1) + ')&nbsp;&nbsp;<font color=red>' + modifiedUser.emailAddress + '</font>' + '于' + '<font color=red>' + Ext.Date.format(new Date(historyDate), 'Y/m/d H:i') + '</font>' + '将此订单状态修改为' + '<font color=red>' + statusName + '</font>';
            if (!Ext.isEmpty(history.comment)) {
                his += '<spand style="color:red">[' + history.comment + ']<font/>'
            }

            if (index == (histories.length - 1)) {
                his = '<p>' + his + '</p>'
            } else {
                his = '<p style="border-bottom:1px solid rgba(0,0,0,0.3)">' + his + '</p>';
            }

            wrapHis.push(his);
        });
        if (histories.length != 0) {
            me.orderHistoriesField.setValue('<div class="status-field">' + wrapHis.join('') + '</div>');
        }
    },
    setOrderStatus: function (status) {
        var me = this;
        var isRedo = me.record.get('isRedo');
        var statusId = status.id;
        var statusName = i18n.getKey(status.frontendName);
        if (statusId == 102 || statusId == 103) {
            JSGetQueryString('statusId') && me.getComponent('orderStatus').setValue(statusId);
            me.addContentBySelectedStatus(statusId);
        }
        me.currentStatusField.setValue('<div class="status-field">' + statusName + '</div>');
    },

    //根据用户选择到不同的状态来进行不同内容的展示
    addContentBySelectedStatus: function (statusId) {
        var me = this,
            record = this.record;
        var shipmentInfo = me.getComponent('shipmentInfo');
        var shipmentBox = me.getComponent('shipmentBox');
        //var shipmentBoxView = me.getComponent('shipmentBoxView');
        if (Ext.Array.contains([102, 103, 104, 105], statusId)) {
            if (shipmentInfo == null && statusId != 102) {
                shipmentInfo = me.initShipmentInfo();
                shipmentInfo.setVisible(true);
            } else if (shipmentInfo != null && Ext.Array.contains([101, 102], statusId)) {
                me.remove(shipmentInfo);
            }

            if (shipmentBox == null) {
                shipmentBox = me.initShipmentBox();
            }
            shipmentBox.setVisible(true);

        } else {
            if (shipmentInfo && shipmentInfo.isVisible())
                shipmentInfo.setVisible(false);
            if (shipmentBox && shipmentBox.isVisible())
                shipmentBox.setVisible(false);
            //shipmentBoxView && shipmentBoxView.setVisible(false);
        }
        /*if (statusId == 101) {
            me.getComponent('paidDate').setVisible(true);
            me.getComponent('paidDate').setValue(new Date());
        } else {
            me.getComponent('paidDate').setVisible(false);
        }*/
        if (Ext.Array.contains([103, 104, 105], statusId)) {
            /*if (statusId == 107) {//设在107即已发货时，才显示发货日期
                var shipmentBoxView = me.getComponent('shipmentBoxView');
                shipmentBoxView && shipmentBoxView.setVisible(false);
            }*/
            if (shipmentInfo == null) {
                shipmentInfo = me.initShipmentInfo();
            }
            shipmentInfo.setVisible(true);
            if (statusId == 103) {
                shipmentInfo.getComponent('deliveredDate').setVisible(false);
                shipmentInfo.getComponent('deliveredDate').setDisabled(true);
            } else {
                shipmentInfo.getComponent('deliveredDate').setVisible(true);
                shipmentInfo.getComponent('deliveredDate').setDisabled(false);
            }
            //shipmentInfo.hideDeliveryDate(statusId)
        } else {
            if (shipmentInfo && shipmentInfo.isVisible())
                shipmentInfo.setVisible(false);
        }
    },


    initShipmentInfo: function () {
        var me = this,
            record = this.record;
        var shipmentInfo = Ext.widget({
            xtype: 'shipmentinfo',
            itemId: 'shipmentInfo',
            record: record,
            hidden: true,
            fieldLabel: i18n.getKey('shipmentInfo'),
            labelWidth: 120,
            width: 700,
            labelAlign: 'right',
            readOnly: me.isReadOnly
        });
        me.insert(me.items.getCount() + 1, shipmentInfo);
        return shipmentInfo;
    },

    initShipmentBox: function () {
        var me = this,
            record = this.record;
        var shipmentBox = Ext.widget({
            xtype: 'shipmentbox',
            itemId: 'shipmentBox',
            width: 860,
            record: me.record,
            labelAlign: 'right',
            readOnly: me.isReadOnly
        });
        me.insert(me.items.getCount() + 1, shipmentBox);
        return shipmentBox;
    },
    initShipmentBoxView: function () {
        var me = this,
            record = this.record;
        var shipmentBox = Ext.widget({
            labelAlign: 'right',
            xtype: 'fieldcontainer',
            itemId: 'shipmentBoxView',
            fieldLabel: i18n.getKey('packageInfo'),
            items: [
                {
                    xtype: 'shipmentboxview',
                    itemId: 'shipmentBoxView',
                    width: 630,
                    record: me.record,
                }
            ]
        });
        me.insert(me.items.getCount() + 1, shipmentBox);
        return shipmentBox;
    },
    initPrintLabel: function (record) {
        var me = this;
        var status = record.get('status')
        var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var printLabel = toolbar.getComponent('printLabel');
        printLabel.setVisible(Ext.Array.contains([103, 102], record.get('status').id));
    }
});
