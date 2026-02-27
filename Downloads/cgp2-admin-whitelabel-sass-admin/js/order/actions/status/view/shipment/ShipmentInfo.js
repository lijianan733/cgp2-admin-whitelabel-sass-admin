Ext.define('Order.status.view.shipment.ShipmentInfo', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.shipmentinfo',
    layout: {
        type: 'table',
        columns: 3
    },
    defaults: {
        labelAlign: 'right',
        labelWidth: 60,
        msgTarget: 'under',
        //allowBlank: false,
        width: 200,
    },
    readOnly: false,
    border: false,
    initComponent: function () {
        var me = this,
            record = this.record;
        var orderId = record.get('id');
        var websiteId = record.get('websiteId');
        var shippingMethodCode = record.get('shippingMethodCode');
        var info = record.get('shipmentInfo');
        if (info) {
            var weight = info.weight;
            var deliveryNo = info.deliveryNo;
            var deliveryDate = null;
            if (info.deliveryDate) {
                deliveryDate = new Date(info.deliveryDate);
            }
            var cost = info.cost;
            var shippingMethod = info.shippingMethodCode;
        }
        me.defaults = Ext.Object.merge({
            readOnly: me.readOnly
        }, me.defaults);
        me.items = [
            {
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('weight') + '(g)',
                allowExponential: false,
                minValue: 0.1,
                allowBlank: false,
                hideTrigger: true,
                name: 'weight',
                value: weight
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('deliveryNo'),
                allowBlank: record.get('status').id !== 106,
                hideTrigger: true,
                name: 'deliveryNo',
                value: deliveryNo
            },
            {
                xtype: 'datetimefield',
                fieldLabel: i18n.getKey('delivery') + i18n.getKey('time'),
                allowBlank: false,
                width: 250,
                hidden: record.get('status').id !== 107,
                disabled: record.get('status').id !== 107,
                itemId: 'deliveryDate',
                //disabled: record.get('status').id == 106,
                name: 'deliveryDate',
                format: 'Y-m-d H:i:s',
                value: deliveryDate || new Date()
            },
            {
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('shippingCost'),
                allowExponential: false,
                minValue: 0,
                allowBlank: record.get('status').id !== 106,
                hideTrigger: true,
                name: 'cost',
                value: cost
            },
            {
                xtype: 'combo',
                name: 'shippingMethodCode',
                store: Ext.create('Order.status.store.ShippingMethod', {
                    websiteId: websiteId,
                    orderId: orderId
                }),
                itemId: 'shippingMethodCode',
                allowBlank: false,
                displayField: 'title',
                //readOnly: true,
                valueField: 'code',
                fieldLabel: i18n.getKey('shippingMethod'),
                value: shippingMethod || shippingMethodCode,
                editable: false
            }
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var data = {};
        data.clazz = 'com.qpp.cgp.domain.order.ShipmentInfo';
        me.items.each(function (item) {
            if (!item.disabled) {
                if (item.name == 'deliveryDate') {
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
