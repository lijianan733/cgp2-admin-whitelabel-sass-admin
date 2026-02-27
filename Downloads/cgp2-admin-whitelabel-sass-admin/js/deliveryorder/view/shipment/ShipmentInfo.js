Ext.define('CGP.deliveryorder.view.shipment.ShipmentInfo', {
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
        width: 200
    },
    border: false,
    readOnly: false,
    initComponent: function () {
        var me = this,
            {record} = me,
            orderId = record.get('id'),
            firstTrackingNo = record.get('firstTrackingNo'),
            info = record.get('shipmentInfo'),
            websiteId = record.get('websiteId'),
            shippingMethodCode = record.get('shipmentMethod'),
            selectedShipmentMethod = record.get('selectedShipmentMethod');

        me.defaults = Ext.Object.merge({
            readOnly: me.readOnly
        }, me.defaults);

        if (info) {
            var weight = info.weight,
                trackingNo = info.trackingNo,
                shipmentCost = info.shipmentCost,
                shippingMethod = info.shipmentMethod,
                deliveryDate = null;
            if (info.deliveryDate) {
                deliveryDate = new Date(info.deliveryDate);
            }
        }

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
                allowBlank: record.get('status').id !== 103 || record.get('status').id !== 104,
                hideTrigger: true,
                name: 'trackingNo',
                value: trackingNo
            },
            {
                xtype: 'datetimefield',
                fieldLabel: i18n.getKey('deliveryDate'),
                allowBlank: record.get('status').id !== 104,
                width: 250,
                hidden: record.get('status').id !== 103 && record.get('status').id !== 104,
                disabled: record.get('status').id !== 103 && record.get('status').id !== 104,
                itemId: 'deliveredDate',
                //disabled: record.get('status').id == 106,
                name: 'deliveredDate',
                format: 'Y-m-d H:i:s',
                value: deliveryDate || new Date().getTime()
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('发货方式'),
                hideTrigger: true,
                readOnly: true,
                fieldStyle: 'background-color: silver',
                name: 'selectedShipmentMethod',
                itemId: 'selectedShipmentMethod',
                value: selectedShipmentMethod
            },
            {
                xtype: 'combo',
                name: 'shipmentMethod',
                store: Ext.create('CGP.deliveryorder.store.ShippingMethod', {
                    orderId: orderId
                }),
                allowBlank: false,
                displayField: 'title',
                valueField: 'code',
                fieldLabel: i18n.getKey('shippingMethod'),
                value: shippingMethod || shippingMethodCode,
                editable: false
            },
            {
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('shippingCost'),
                allowExponential: false,
                minValue: 0,
                allowBlank: record.get('status').id !== 106,
                hideTrigger: true,
                name: 'shipmentCost',
                value: shipmentCost
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('firstTrackingNo'),
                hideTrigger: true,
                readOnly: true,
                fieldStyle: 'background-color: silver',
                name: 'firstTrackingNo',
                itemId: 'firstTrackingNo',
                hidden: !firstTrackingNo,
                value: firstTrackingNo
            },
        ];

        me.callParent(arguments);
    },

    getValue: function () {
        var me = this;
        var data = {};
        me.items.each(function (item) {
            if (!item.disabled) {
                if (item.name == 'deliveredDate') {
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
        /*if (status == 107) {
            deliverDate.show();
            deliverDate.setDisabled(false);
            me.hide();
            me.show();
        } else {
            deliverDate.hide();
            deliverDate.setDisabled(true);
            me.hide();
            me.show();
        }*/
    },
    setReadOnly: function () {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            item.setReadOnly(true);
        })
    }
})
