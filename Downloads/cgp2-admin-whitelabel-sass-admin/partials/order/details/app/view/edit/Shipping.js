Ext.define('CGP.orderdetails.view.edit.Shipping', {
    extend: 'Ext.window.Window',
    alias: 'widget.shippingeditor',
    mixins: ['Ext.ux.util.ResourceInit', 'CGP.orderdetails.view.interface.Syncable'],

    url: adminPath + 'api/orders/{0}/shippingMethod',


    modal: true,
    bodyStyle: 'padding:10px',

    initComponent: function () {

        var me = this;


        me.bbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                handler: function () {
                    me.save();
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function () {
                    me.close();
                }
            }
        ]
        me.title = i18n.getKey('shippingMethod')
        me.callParent(arguments);
    },

    setValue: function (order) {

        var me = this;
        me.order = order;


        var store = Ext.create('CGP.orderdetails.store.ActualShippingMethods', {
            websiteId: order.get('websiteId'),
            orderId: order.get('id'),
            listeners: {
                load: function () {
                    combo.setValue(order.get('shippingModuleCode'));
                }
            }
        });

        var combo = Ext.widget({
            xtype: 'combobox',
            store: store,
            displayField: 'title',
            valueField: 'code',
            fieldLabel: i18n.getKey('shippingMethod'),
            itemId: 'shippingMethod',
            editable: false
        });


        me.add(combo);
    },

    save: function () {

        var me = this;
        var shipping = me.ownerPanel;
        me.sync();
        var combo = me.getComponent('shippingMethod');

        var store = combo.getStore();
        var record = store.findRecord('code', combo.getValue());
        me.order.set('shippingMethod', record.get('title'));
        me.order.set('shippingModuleCode', record.get('code'));
        shipping.setValue(me.order);
        me.close();

    },

    getSyncData: function () {
        return {
            code: this.getComponent('shippingMethod').getValue()
        }
    },
    syncCallback: function (data) {
        var me = this;

        me.orderTotal.setValue(data.orderTotals);
    }


})
