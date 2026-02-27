Ext.define('CGP.orderdetails.view.shipment.ShipmentBoxInfo', {
    extend: 'Ext.container.Container',
    alias: 'widget.shipmentboxinfo',


    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        flex: 1,
        labelAlign: 'right',
        renderer: function (v) {
            return '<font color="red" style="font-weight:bold;font-size:17px">' + v + '</font>'
        }
    },

    initComponent: function () {
         var me = this,
            record = this.record;

        me.defaults={
            readOnly:record.get('hasProducer'),
            disabled:record.get('hasProducer')
        }
        me.items = [{
            xtype: 'displayfield',
            fieldLabel: i18n.getKey('productQty'),
            value: record.get('needPackingQty')
        }, {
            xtype: 'displayfield',
            fieldLabel: i18n.getKey('packageQty'),
            value: 0,
            itemId: 'packageQty'
        }, {
            xtype: 'displayfield',
            fieldLabel: i18n.getKey('notPackageQty'),
            value: record.get('needPackingQty'),
            itemId: 'notPackageQty'
        }];

        me.callParent(arguments);

        me.packageQtyField = me.getComponent('packageQty');
        me.notPackageQtyField = me.getComponent('notPackageQty');

    },
    setPackageQty: function (qty) {
        var me = this,
            record = this.record;
        me.packageQtyField.setValue(qty);
        me.notPackageQtyField.setValue(record.get('needPackingQty') - qty);
    }
})