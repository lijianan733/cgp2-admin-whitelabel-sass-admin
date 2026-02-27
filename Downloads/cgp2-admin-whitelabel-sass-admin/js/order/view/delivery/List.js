Ext.define('CGP.order.view.delivery.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.deliverylist',


    plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                edit: function (editor, context) {
                    context.record.commit();
                }
            }
        })
        ],
    //    height: 250,
    width: 640,
    height: 250,
    autoScroll: true,
    initComponent: function () {
         var me = this,
            orderIds = this.orderIds;


        me.store = Ext.create('CGP.order.store.DeliveryInfo', {
            orderIds: orderIds
        });

        me.columns = [{
            dataIndex: 'orderNo',
            text: i18n.getKey('orderNumber'),
            width: 135
        }, {
            dataIndex: 'weight',
            text: i18n.getKey('weight'),
            editor: {
                xtype: 'numberfield',
                allowDecimals: false,
                allowExponential: false,
                minValue: 0,
                allowBlank: false
            }
        }, {
            dataIndex: 'deliveryNo',
            text: i18n.getKey('deliveryNo'),
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            dataIndex: 'deliveryDate',
            xtype: 'datecolumn',
            format: system.config.dateFormat,
            text: i18n.getKey('deliveryDate'),
            editor: {
                xtype: 'datefield',
                allowBlank: false
            }
        }, {
            dataIndex: 'shippingCost',
            text: i18n.getKey('cost'),
            editor: {
                xtype: 'numberfield',
                allowExponential: false,
                minValue: 0,
                allowBlank: false
            }
        }, {
            dataIndex: 'shippingMethodName',
            text: i18n.getKey('shippingMethod'),
            width: 80
        }];
        me.callParent(arguments);
    }
})