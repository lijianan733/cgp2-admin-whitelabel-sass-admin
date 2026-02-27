Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.ShipmentInfoItem', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.shipmentInfoItem',
    layout: {
        type: 'table',
        columns: 3
    },
    defaults: {
        labelAlign: 'left',
        labelWidth: 90,
        width: 250,
        // flex: 1,
        msgTarget: 'under',
    },
    readOnly: false,
    border: false,
    getShippingMethodCode: function (shippingMethod) {
        var controller = Ext.create('CGP.orderstatusmodify.view.orderitemsmultipleaddress.controller.Controller'),
            url = adminPath + `api/shipmentOrders/availableActualShippingMethods?page=1&limit=1000`,
            shippingMethodData = controller.getQuery(url),
            result = shippingMethod;

        if (shippingMethod) {
            shippingMethodData.forEach(item => {
                if (item.code === shippingMethod) {
                    result = item.title || shippingMethod;
                }
            })
        }

        return result;
    },
    initComponent: function () {
        var me = this,
            {record, data} = me,
            {shipmentRequirement, shipmentOrder} = data,
            {shipmentMethod} = shipmentRequirement,
            shippingMethod = record.get('shippingMethodCode') || record.get('shippingMethod'),
            info = record.get('shipmentInfo'),
            newShipmentNo = '',
            baseCustomsAmount = '',
            trackingNo = '',
            controller = Ext.create('CGP.orderstatusmodify.view.orderitemsmultipleaddress.controller.Controller');


        if (info) {
            var {weight, deliveryNo, deliveryDate, cost, shippingMethodCode, firstTrackingNo} = info;
            deliveryDate && (deliveryDate = new Date(info.deliveryDate));
        }

        if (shipmentOrder) {
            var {shipmentNo} = shipmentOrder;
            newShipmentNo = shipmentNo;
            trackingNo = shipmentOrder.trackingNo;
            firstTrackingNo = shipmentOrder.firstTrackingNo;
            baseCustomsAmount = shipmentOrder.baseCustomsAmount;
        }

        me.defaults = Ext.Object.merge({
            readOnly: me.readOnly
        }, me.defaults);

        me.items = [
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('发货方式'),
                hidden: !shipmentMethod,
                value: shipmentMethod
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('shippingMethod'),
                hidden: !(shippingMethod || shippingMethodCode),
                value: me.getShippingMethodCode(shippingMethod || shippingMethodCode)
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('weight') + '(g)',
                hidden: !weight,
                value: weight
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('deliveryNo'),
                hidden: !deliveryNo,
                value: deliveryNo
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('delivery') + i18n.getKey('time'),
                hidden: !deliveryDate,
                value: controller.getTimestampFromDateString({
                    date: deliveryDate,
                    type: 'beijingTime'
                }, 'formatDateTime')
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('shippingCost'),
                hidden: cost === 0 || !cost,
                value: cost
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('统一发货单号'),
                hidden: !newShipmentNo,
                value: newShipmentNo
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('firstTrackingNo'),
                hidden: !firstTrackingNo,
                value: firstTrackingNo
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('trackingNo'),
                hidden: !trackingNo,
                value: trackingNo
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('出口报关金额'),
                hidden: !baseCustomsAmount,
                value: baseCustomsAmount
            },
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var data = {};
        data.clazz = 'com.qpp.cgp.domain.order.ShipmentInfo';
        me.items.each(function (item) {
            if (!item.disabled) {
                if (item.name === 'deliveryDate') {
                    data[item.name] = new Date(item.getValue()).getTime();
                } else
                    data[item.name] = item.getValue();
            }
        });
        return data;
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.each(function (item) {
            if (!item.isValid()) {
                isValid = false;
            }
        });

        return isValid;
    },
    //隐藏发货日期字段
    hideDeliveryDate: function (status) {
        var me = this;
        var deliverDate = me.getComponent('deliveryDate');
        if (status == 107) {
            deliverDate.setVisible(true);
            deliverDate.setDisabled(false);
            me.setVisible(false);
            me.setVisible(true);
        } else {
            deliverDate.setVisible(false);
            deliverDate.setDisabled(true);
            me.setVisible(false);
            me.setVisible(true);
        }
    },
    getExpressWay: function (orderId) {
        var expressWay = {venno: ''};
        Ext.Ajax.request({
            method: 'GET',
            url: adminPath + 'api/orders/' + orderId + '/expressInfo',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            async: false,
            success: function (response) {
                var r = Ext.JSON.decode(response.responseText);
                if (r.success) {
                    expressWay = r.data.expressInfos[0];
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), '获取快递方式失败！');
                }

            },
            failure: function (response) {
                var r = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('prompt'), r.message);
            }
        });
        return expressWay;
    },
    //根据需要装箱产品的数量来判断是否需要填写快递信息,全外派的订单就没需要装箱产品
    setVisible: function () {
        var me = this;
        if (me.record.get('needPackingQty') == 0) {
            me.hide();
        } else {
            me.callParent(arguments)
        }
    }
})
