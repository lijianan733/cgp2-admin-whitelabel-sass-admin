Ext.define('CGP.orderlineitem.view.status.view.shipment.ShipmentBoxView', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.shipmentboxview',
    requires: ['CGP.orderlineitem.view.status.store.ShipmentBox'],





    initComponent: function () {

         var me = this,
            record = this.record;

        me.model = Ext.ModelManager.getModel('CGP.orderlineitem.view.status.model.ShipmentBox');
        me.store = Ext.create('CGP.orderlineitem.view.status.store.ShipmentBox', {
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