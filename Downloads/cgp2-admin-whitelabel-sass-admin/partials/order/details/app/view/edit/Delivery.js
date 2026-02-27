Ext.define('CGP.orderdetails.view.edit.Delivery', {

    extend: 'Ext.window.Window',
    alias: 'widget.deliveryeditor',
    mixins: ['Ext.ux.util.ResourceInit', 'CGP.orderdetails.view.interface.Valuable', 'CGP.orderdetails.view.interface.Syncable'],

    url: adminPath + 'api/orders/{0}/deliveryAddress',



    modal: true,
    bodyStyle: 'padding:10px',
    layout: 'fit',

    initComponent: function () {

        var me = this;



        var countryStore = Ext.create('CGP.orderdetails.store.Country');

        me.title = i18n.getKey('deliveryAddress');

        me.items = {
            xtype: 'form',
            itemId: 'form',
            border: false,
            defaults: {
                width: 400
            },
            items: [
                {
                    name: 'deliveryAddressId',
                    xtype: 'numberfield',
                    hidden: true,
                    itemId: 'id'
                },
                {
                    name: 'deliveryFirstName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('firstName'),
                    allowBlank: false,
                    itemId: 'firstName'
                },
                {
                    name: 'deliveryLastName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('lastName'),
                    itemId: 'lastName'
                },
                {
                    name: 'deliveryCountry',
                    xtype: 'combobox',
                    displayField: 'name',
                    valueField: 'id',
                    store: countryStore,
                    fieldLabel: i18n.getKey('country'),
                    allowBlank: false,
                    itemId: 'country'
                },
                {
                    name: 'deliveryLocationType',
                    xtype: 'combobox',
                    store: Ext.create('CGP.orderdetails.store.LocationType'),
                    displayField: 'description',
                    valueField: 'code',
                    editable: false,
                    fieldLabel: i18n.getKey('locationType'),
                    itemId: 'locationType'
                },
                {
                    name: 'deliveryStreetAddress1',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('streetAddress1'),
                    allowBlank: false,
                    itemId: 'streetAddress1'
                },
                {
                    name: 'deliveryStreetAddress2',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('streetAddress2'),
                    itemId: 'streetAddress2'
                },
                {
                    name: 'deliveryCity',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('city'),
                    allowBlank: false,
                    itemId: 'city'
                },
                {
                    name: 'deliveryState',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('state'),
                    allowBlank: false,
                    itemId: 'state'
                },
                {
                    name: 'deliverySuburb',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('suburb'),
                    itemId: 'suburb'
                },
                {
                    name: 'deliveryCompany',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('company'),
                    itemId: 'company'
                },
                {
                    name: 'deliveryPostcode',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('postCode'),
                    itemId: 'postcode'
                },
                {
                    name: 'deliveryEmail',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('emailAddress'),
                    allowBlank: false,
                    itemId: 'emailAddress'
                },
                {
                    name: 'deliveryTelephone',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('telephone'),
                    allowBlank: false,
                    itemId: 'telephone'
                },
                {
                    name: 'deliveryMobile',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('mobile'),
                    allowBlank: false,
                    itemId: 'mobile'
                }
            ]};

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
        ];
        me.callParent(arguments);
        me.form = me.getComponent('form');

    },

    save: function () {

        var me = this;
        var order = me.order;
        var delivery = me.ownerPanel;
        if(!me.form.isValid()) {
            return;
        }
        me.sync();

        var data = me.getSyncData();

        me.form.items.each(function (item) {
            if (item.name == 'deliveryCountry') {
                order.set(item.name, item.getStore().getById(item.getValue()).get('name'));
            } else
                order.set(item.name, item.getValue());
        })

        var name = me.form.getComponent('firstName').getValue() + ' ' + me.form.getComponent('lastName').getValue();
        name = name.replace(/null/g, '');
        order.set('deliveryName', name);

        var address = order.get('deliveryCountry') + " " + order.get('deliveryState') + " "
            + order.get('deliveryCity') + " " + order.get('deliverySuburb') + " " + order.get('deliveryStreetAddress1') + " " + order.get("deliveryStreetAddress2") + " " + order.get('deliveryCompany') + " " + order.get('deliveryName') +
            " " + order.get('deliveryTelephone') + " " + order.get('deliveryEmail');

        address = address.replace(/null/g, '');
        order.set('deliveryAddress', address);
        delivery.setValue(order);
        me.close();

    },

    getSyncData: function () {

        var me = this;

        var data = {
            sortOrder: 1
        };
        me.form.items.each(function (item) {
            if (item.itemId == 'country') {
                data['countryId'] = item.getValue();
                data['countryName'] = item.getRawValue();
            } else {
                data[item.itemId] = item.getValue();
            }

        });
        if (data.id == 0) {
            delete data.id;
        }

        return data;

    },

    setValue: function (order) {
        var me = this;
        me.order = order;
        me.form.items.each(function (item) {
            if (item.name == 'deliveryCountry') {
                item.getStore().on('load', function () {
                    var record = item.getStore().findRecord('name',order.get('deliveryCountry'));
                    if(record){
                        item.setValue(record.getId());
                    }
                    /*if(order.get('deliveryCountryId'))
                        item.setValue(order.get('deliveryCountryId'))*/
                }, item, {
                    single: true
                })
                if(order.get('deliveryCountryId'))
                    item.setValue(order.get('deliveryCountryId'))
            } else
                item.setValue(order.get(item.name));
        });
    }



})
