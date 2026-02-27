Ext.define('CGP.orderlineitem.view.status.view.shipment.ShipmentInfo', {
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
        width: 200/*,
        allowBlank: false*/
    },
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
            var deliveryDate = new Date(info.deliveryDate);
            var cost = info.cost;
            var shippingMethod = info.shippingMethodCode;
        }

        me.items = [{
            xtype: 'numberfield',
            fieldLabel: i18n.getKey('weight') + '(g)',
            allowExponential: false,
            minValue: 0.1,
            allowBlank: false,
            hideTrigger: true,
            name: 'weight',
            value: weight
        }, {
            xtype: 'textfield',
            fieldLabel: i18n.getKey('deliveryNo'),
            allowBlank: record.get('status').id!=106,
            hideTrigger: true,
            name: 'deliveryNo',
            value: deliveryNo
        }, {
            xtype: 'datefield',
            fieldLabel: i18n.getKey('deliveryDate'),
            allowBlank: false,
            name: 'deliveryDate',
            format: system.config.dateFormat,
            value: deliveryDate || new Date()
        }, {
            xtype: 'numberfield',
            fieldLabel: i18n.getKey('shippingCost'),
            allowExponential: false,
            minValue: 0,
            allowBlank: record.get('status').id!=106,
            hideTrigger: true,
            name: 'cost',
            value: cost
        }, {
            xtype: 'combo',
            name: 'shippingMethodCode',
            store: Ext.create('CGP.orderlineitem.view.status.store.ShippingMethod', {
                websiteId: websiteId,
                orderId: orderId
            }),
            displayField: 'title',
            valueField: 'code',
            allowBlank: false,
            fieldLabel: i18n.getKey('shippingMethod'),
            value: shippingMethod || shippingMethodCode,
            editable: false
            }];

        me.callParent(arguments);
    },


    getValue: function () {
        var me = this;
        var data = {};
        me.items.each(function (item) {
            if (item.name == 'deliveryDate') {
                data[item.name] = item.getValue().getTime();
            } else
                data[item.name] = item.getValue();
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
    }
})