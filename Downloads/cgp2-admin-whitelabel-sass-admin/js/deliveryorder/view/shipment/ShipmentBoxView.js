Ext.define('CGP.deliveryorder.view.shipment.ShipmentBoxView', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.shipmentboxview',
    requires: ['CGP.deliveryorder.store.ShipmentBox'],





    initComponent: function () {

         var me = this,
            record = this.record;

        me.model = Ext.ModelManager.getModel('CGP.deliveryorder.model.ShipmentBox');
        me.store = Ext.create('CGP.deliveryorder.store.ShipmentBox', {
            data: record.get('shipmentBoxes')
        });

        me.columns = {
            defaults: {
                sortable: false,
                menuDisabled: true
            },
            items: [{
                    dataIndex: 'productQty',
                    width: 80,
                    text: i18n.getKey('productQty')
            }, {
                    dataIndex: 'boxQty',
                    text: i18n.getKey('boxQty'),
                    width: 60,
            },
                {
                    text: i18n.getKey('boxSize'),
                    width: 120,
                    renderer: function (v, m, r) {
                        return r.get('boxLength') + ' X ' + r.get('boxWidth') + ' X ' + r.get('boxHeight') + ' ' + r.get('boxSizeUnit') || 'CM' + ' ';
                    }
            },
                {
                    dataIndex: 'totalWeight',
                    width: 80,
                    text: i18n.getKey('weight'),
                    renderer: function (v, m, r) {
                        return v + ' G';
                    }
            },
                {
                    dataIndex: 'productWeight',
                    width: 80,
                    text: i18n.getKey('suttle'),
                    renderer: function (v, m, r) {
                        return v + ' G';
                    }
            },
                {
                    dataIndex: 'packageType',
                    width: 153,
                    text: i18n.getKey('packageType')
            }]
        };

        me.callParent(arguments);
    }
})