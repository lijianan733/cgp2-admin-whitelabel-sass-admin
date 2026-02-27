Ext.define('CGP.orderdetails.view.shipment.ShipmentInfo', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.shipmentinfo',


    layout: {
        type: 'table',
        columns: 3
    },
    defaults: {
        labelAlign: 'left',
        labelWidth: 60,
        padding: '0 20 0 0'
    },
    border: false,
    initComponent: function () {
        var me = this,
            record = this.record;


        var statusId = record.get('status').id;
        var orderId = record.get('id');
        var websiteId = record.get('websiteId');
        var shippingMethodCode = record.get('shippingMethodCode');
        me.fieldLabel = i18n.getKey('shipmentInfo');
        var info = record.get('shipmentInfo');
        if (info) {
            var weight = info.weight;
            var deliveryNo = info.deliveryNo;
            var deliveryDate = new Date(info.deliveryDate);
            var cost = info.cost;
            var shippingMethod = info.shippingMethodCode;
        }
        me.defaults = {
            readOnly: record.get('hasProducer')
        };
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
                allowBlank: statusId != 106,
                hideTrigger: true,
                name: 'deliveryNo',
                value: deliveryNo
            },
            {
                xtype: 'datetimefield',
                fieldLabel: i18n.getKey('deliveryDate'),
                allowBlank: false,
                width: 300,
                name: 'deliveryDate',
                format: "Y-m-d H:i:s",
                value: deliveryDate || new Date()
            },
            {
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('shippingCost'),
                allowExponential: false,
                minValue: 0,
                allowBlank: statusId != 106,
                hideTrigger: true,
                name: 'shippingCost',
                value: cost
            },
            {
                xtype: 'combo',
                name: 'shippingMethod',
                store: Ext.create('CGP.orderdetails.store.ActualShippingMethods', {
                    websiteId: websiteId,
                    orderId: orderId
                }),
                displayField: 'title',
                valueField: 'code',
                fieldLabel: i18n.getKey('shippingMethod'),
                value: shippingMethod || shippingMethodCode,
                editable: false
            }
        ];
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
    }
})