Ext.define('CGP.orderdetails.view.delivery.WholeDelivery', {
    extend: 'Ext.window.Window',
    alias: 'wholedeliverywindow',

    requires: [
        'Ext.ux.form.ErrorStrickForm',
        'CGP.orderdetails.view.shipment.ShipmentInfo',
        'CGP.orderdetails.view.shipment.ShipmentBox'
    ],


    modal: true,
    width: 900,
    height: 450,
    layout: 'fit',
    bodyStyle: 'padding:10px',
    initComponent: function () {

         var me = this,
            record = this.record;

        var orderId = record.get('orderId');
        me.title = i18n.getKey('wholeDelivery');

        me.items = [{
            xtype: 'errorstrickform',
            height: 450,
            autoScroll: true,
            defaults: {
                labelStyle: 'vertical-align:center;'
            },
            border: false,
            items: [{
                xtype: 'textarea',
                itemId: 'comment',
                fieldLabel: i18n.getKey('remark'),
                width: 615,
                labelAlign: 'right'
            }, {
                xtype: 'shipmentinfo',
                record: record,
                itemId: 'shipmentInfo',
                labelAlign: 'right'
            }, {
                xtype: 'shipmentbox',
                itemId: 'shipmentBox',
                record: record,
                labelAlign: 'right'
            }]
        }];

        me.bbar = [{
            xtype: 'button',
            text: i18n.getKey('ok'),
            handler: function () {
                me.editController.deliveryWholeOrder(orderId, me.getData(), me);
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }];

        me.callParent(arguments);
        me.form = me.down('errorstrickform');

    },

    getData: function () {
        var me = this;
        if (!me.validateForm()) {
            throw new Error('validate false');
        }
        var data = {};
        me.form.items.each(function (item) {
            data[item.itemId] = item.getValue();
        });
        return data;
    },

    validateForm: function () {
        var me = this;
        var boxInfoField = me.form.getComponent('shipmentBox');
        if (me.form.isValid() && boxInfoField.isValid()) {
            return true;
        }
        return false;
    }

})