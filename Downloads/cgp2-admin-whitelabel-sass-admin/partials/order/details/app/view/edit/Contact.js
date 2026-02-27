Ext.define('CGP.orderdetails.view.edit.Contact', {

    extend: 'Ext.window.Window',
    alias: 'widget.contacteditor',
    mixins: ['Ext.ux.util.ResourceInit', 'CGP.orderdetails.view.interface.Syncable'],


    url: adminPath + 'api/orders/{0}/billingAddress',



    modal: true,
    bodyStyle: 'padding:10px',

    initComponent: function () {

        var me = this;



        me.items = {
            xtype: 'form',
            itemId:'form',
            border:false,
            items: [
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('linkman'),
                allowBlank: false,
                name: 'billingName',
                itemId: 'firstName'
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('telephone'),
                name: 'billingTelephone',
                itemId: 'telephone',
                allowBlank: false
            }
        ]};

        me.title = i18n.getKey('linkman');

        me.bbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                action: 'save'
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function () {
                    me.close();
                }
            }
        ]

        me.callParent(arguments);
        me.form = me.getComponent('form');

    },

    getSyncData: function () {
        var me = this;
        if(!me.form.isValid()) {
            throw new Error('error');
        }
        return {
            id: me.order.get('billingAddressId'),
            firstName: me.form.getComponent('firstName').getValue(),
            telephone: me.form.getComponent('telephone').getValue(),
            sortOrder: 1
        };
    },

    syncCallback: function (data) {
        var me = this;
        me.order.set('billingAddressId', data.billingAddressId);
    },
    setValue: function (order) {
        var me = this;
        me.order = order;
        if (me.setEditable) {
            me.setEditable(order);
        }
        me.form.items.each(function (item) {
            item.setValue(order.get(item.name));
        });
    },
    getValue: function () {
        var me = this;
        if (me.sync)
            me.sync();
        var value = {};
        me.form.items.each(function (item) {
            value[item.name] = item.getValue();
        });
        return value;
    }


})
