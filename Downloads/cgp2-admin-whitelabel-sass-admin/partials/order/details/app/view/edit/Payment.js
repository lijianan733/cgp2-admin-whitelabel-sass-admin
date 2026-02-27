Ext.define('CGP.orderdetails.view.edit.Payment', {
    extend: 'Ext.window.Window',
    alias: 'widget.paymenteditor',
    mixins: ['Ext.ux.util.ResourceInit', 'CGP.orderdetails.view.interface.Syncable'],

    url: adminPath + 'api/orders/{0}/paymentMethod',



    modal: true,
    bodyStyle: 'padding:10px',

    initComponent: function () {

        var me = this;





        me.bbar = [{
            xtype: 'button',
            text: i18n.getKey('save'),
            handler: function () {
                me.save();
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }]
        me.title = i18n.getKey('paymentMethod')
        me.callParent(arguments);
    },

    setValue: function (order) {

        var me = this;
        me.order = order;


        var store = Ext.create('CGP.orderdetails.store.PaymentMethod', {
            websiteId: order.get('websiteId'),
            orderId: order.get('id'),
            listeners: {
                load: function () {
                    combo.setValue(order.get('paymentMethodCode'));
                }
            }
        });

        var combo = Ext.widget({
            xtype: 'combobox',
            store: store,
            displayField: 'title',
            valueField: 'code',
            fieldLabel: i18n.getKey('paymentMethod'),
            itemId: 'paymentMethod',
            editable: false
        });



        me.add(combo);
    },

    save: function () {

        var me = this;
        var payment = me.ownerPanel;
        me.sync();
        var combo = me.getComponent('paymentMethod');

        var store = combo.getStore();
        var record = store.findRecord('code',combo.getValue());
        me.order.set('paymentMethod', record.get('title'));
        me.order.set('paymentMethodCode', record.get('code'));
        payment.setValue(me.order);
        me.close();

    },

    getSyncData: function () {
        return {
            code: this.getComponent('paymentMethod').getValue()
        }
    }


})
