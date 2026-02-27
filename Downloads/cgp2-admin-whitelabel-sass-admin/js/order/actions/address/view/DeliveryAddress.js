Ext.Loader.setPath({
    enabled: true,
    "CGP.orderdetails": path + "partials/order/details/app"
});
Ext.Loader.syncRequire([
    'CGP.orderdetails.store.Country'
])
Ext.define('CGP.order.actions.address.view.DeliveryAddress', {
    extend: 'Ext.ux.form.Panel',

    requires: ['CGP.order.actions.address.model.DeliveryAddress', 'CGP.order.actions.address.store.Country', 'CGP.order.actions.address.store.LocationType', 'CGP.order.actions.address.store.ShippingMethod'],


    model: 'CGP.order.actions.address.model.DeliveryAddress',
    config: {
        labelAlign: 'right',
        msgTarget: 'side',
        validateOnChange: false,
        columnCount: 1,
        width: 500,
        border: false,
        plugins: [{
            ptype: 'uxvalidation'
        }]

    },

    constructor: function (config) {

        var me = this;


        config = config || {};

        config = Ext.apply(me.config, config);

        var countryStore = Ext.create('CGP.order.actions.address.store.Country');
        config.model = me.model;
        config.items = [{
            xtype: 'displayfield',
            value: '<b>' + i18n.getKey('deliveryAddress') + '</b>',
            itemId: 'deliveryTitle'
        }, {
            xtype: 'displayfield',
            itemId: 'blank'
        }, {
            xtype: 'numberfield',
            insertVisible: false,
            name: 'id',
            hidden: true,
            itemId: 'id'
        }, {
            name: 'firstName',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('firstName'),
            allowBlank: false,
            itemId: 'firstName'
        }, {
            name: 'lastName',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('lastName'),
            allowBlank: false,
            itemId: 'lastName'
        }, {
            name: 'countryCode2',
            xtype: 'combo',
            displayField: 'name',
            valueField: 'isoCode2',
            value: 'US',
            editable: false,
            store: Ext.create('CGP.orderdetails.store.Country'),
            fieldLabel: i18n.getKey('country'),
            allowBlank: false,
            itemId: 'countryCode2'
        }, {
            name: 'locationType',
            xtype: 'combobox',
            store: Ext.create('CGP.order.action.address.store.LocationType'),
            displayField: 'description',
            valueField: 'code',
            editable: false,
            fieldLabel: i18n.getKey('locationType'),
            itemId: 'locationType'
        }, {
            name: 'streetAddress1',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('streetAddress1'),
            allowBlank: false,
            itemId: 'streetAddress1'
        }, {
            name: 'streetAddress2',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('streetAddress2'),
            itemId: 'streetAddress2'
        }, {
            name: 'state',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('state'),
            allowBlank: false,
            itemId: 'state'
        }, {
            name: 'city',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('city'),
            allowBlank: false,
            itemId: 'city'
        }, {
            name: 'suburb',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('suburb'),
            itemId: 'suburb'
        }, {
            name: 'company',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('company'),
            itemId: 'company'
        }, {
            name: 'postcode',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('postCode'),
            itemId: 'postCode'
        }, {
            name: 'emailAddress',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('emailAddress'),
            allowBlank: false,
            itemId: 'emailAddress'
        }, {
            name: 'telephone',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('telephone'),
            allowBlank: true,
            itemId: 'telephone'
        }, {
            name: 'mobile',
            xtype: 'textfield',
            fieldLabel: i18n.getKey('mobile'),
            allowBlank: false,
            itemId: 'mobile'
        }];


        me.callParent([config]);

    },

    save: function (url, fn) {
        var me = this;
        var data = me.form.getValuesByModel(me.model);
        data.sortOrder = 1;
        delete data.country;
        Ext.Ajax.request({
            method: 'PUT',
            url: url,
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response, options) {
                var r = Ext.JSON.decode(response.responseText);
                if (!r.success) {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), r.data.message);
                    return;
                }
                fn();
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    }
})
