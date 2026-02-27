Ext.define('CGP.order.actions.address.view.Address', {
    extend: 'Ext.panel.Panel',

    requires: ['CGP.order.actions.address.view.BillingAddress', 'CGP.order.actions.address.view.DeliveryAddress', 'CGP.order.actions.address.model.Order'],



    orderInfo: {},

    config: {
        layout: 'column'
    },

    autoScroll: true,

    constructor: function (config) {
        var me = this;




        config = Ext.apply(me.config, config || {});

        me.callParent([config]);



    },

    initComponent: function () {
        var me = this;

        me.callParent(arguments);
        //add billingAddress
        me.billingAddress = Ext.create('CGP.order.actions.address.view.BillingAddress');
        //add deliveryAddress
        me.deliveryAddress = Ext.create('CGP.order.actions.address.view.DeliveryAddress');
        //add orderInformation
        me.add(me.deliveryAddress, me.billingAddress);

        me.billingAddress.on('sameaddress', function (checked) {
            me.copyAddress(checked, me);
        }, this)

        me.addDocked({
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function () {
                    me.save();
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('grid'),
                iconCls: 'icon_grid',
                handler: function () {
                    JSOpen({
                        id: 'page',
                        url: path + 'partials/order/order.html'
                    });
                }
            }]
        });

        me.initData();
    },

    initData: function () {
        var me = this;
        var searcher = Ext.Object.fromQueryString(location.search);

        if (searcher.orderId) {
            url = adminPath + 'api/orders/' + searcher.orderId + '/addressInfo';
            Ext.Ajax.request({
                method: 'GET',
                url: url,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response, operation) {
                    var r = Ext.JSON.decode(response.responseText);
                    if (r.success) {
                        me.orderInfo = r.data;
                        me.setTitle(i18n.getKey('orderNumber') + ':' + me.orderInfo.orderNumber);

                        me.initDeliveryAddress(searcher.orderId);
                        me.initBillingAddress(searcher.orderId);
                        me.initShippingMethod();

                    }else{
                        Ext.Msg.alert(i18n.getKey('requestFailed'), r.data.message);
                    }
                },
                failure: function (resp, options) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
        }
    },
    initBillingAddress: function (orderId) {
        var me = this;
        var url = adminPath + 'api/orders/' + orderId + '/billingAddress';
        Ext.Ajax.request({
            method: 'GET',
            url: url,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response, operation) {
                var r = Ext.JSON.decode(response.responseText);
                if (!r.success) {
                    Ext.Msg.alert('info', r.data.message);
                    return;
                }

                r.data.country = {
                    isoCode2: r.data.countryCode2,
                    name: r.data.countryName
                }
                var address = Ext.create('CGP.order.actions.address.model.BillingAddress', r.data);
                me.billingAddress.form.setValuesByModel(address);

            },
            failure: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    initDeliveryAddress: function (orderId) {
        var me = this;
        var url = adminPath + 'api/orders/' + orderId + '/deliveryAddress';
        Ext.Ajax.request({
            method: 'GET',
            url: url,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response, operation) {
                var r = Ext.JSON.decode(response.responseText);
                if (!r.success) {
                    Ext.Msg.alert('info', r.data.message);
                    return;
                }

                r.data.country = {
                    isoCode2: r.data.countryCode2,
                    name: r.data.countryName
                }
                var address = Ext.create('CGP.order.actions.address.model.DeliveryAddress', r.data);
                me.deliveryAddress.form.setValuesByModel(address);

            },
            failure: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    initShippingMethod: function () {
        var me = this;
        var url = adminPath + 'api/orders/' + me.orderInfo.id + '/availableShippingMethods';
        var store = Ext.create('CGP.order.actions.address.store.ShippingMethod');

        store.setProxy({
            type: 'uxrest',
            url: url,
            reader: {
                type: 'json',
                root: 'data'
            }
        });
        store.load();
        me.deliveryAddress.add({
            xtype: 'combobox',
            store: store,
            displayField: 'title',
            valueField: 'code',
            value: me.orderInfo.shippingMethod,
            itemId: 'shippingMethod',
            fieldLabel: i18n.getKey('shippingMethod')
        });
    },

    copyAddress: function (checked, me) {


        if (checked) {
            copy();
        } else {
            clear();
        }

        function copy() {

            var data = me.deliveryAddress.form.getValuesByModel('CGP.order.actions.address.model.DeliveryAddress');
            var billing = Ext.create('CGP.order.actions.address.model.BillingAddress', data);

            me.billingAddress.form.setValuesByModel(billing);
        }

        function clear() {
            var deliveryAddress = me.deliveryAddress.form.getValuesByModel('CGP.order.actions.address.model.DeliveryAddress');
            var billingAddress = me.billingAddress.form.getValuesByModel('CGP.order.actions.address.model.BillingAddress');
            if (deliveryAddress.id == billingAddress.id) {
                me.billingAddress.form.setValuesByModel(Ext.create('CGP.order.actions.address.model.BillingAddress', {}));
            } else {

                me.billingAddress.form.setValuesByModel(Ext.create('CGP.order.actions.address.model.BillingAddress', {
                    id: billingAddress.id
                }));
            }
        }

    },

    save: function () {
        var me = this;
        var mask = me.setLoading(true);
        var delvieryAddressSaveUrl = adminPath + 'api/orders/' + me.orderInfo.id + '/deliveryAddress';
        var billingAddressSaveUrl = adminPath + 'api/orders/' + me.orderInfo.id + '/billingAddress';
        me.deliveryAddress.save(delvieryAddressSaveUrl, function () {
            me.billingAddress.save(billingAddressSaveUrl, function () {
                var url = adminPath + 'api/orders/' + me.orderInfo.id + '/shippingMethod';

                Ext.Ajax.request({
                    method: 'PUT',
                    url: url,
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    jsonData: {
                        code: me.deliveryAddress.getComponent('shippingMethod').getValue()
                    },
                    success: function (response, options) {
                        mask.hide();
                        var r = Ext.JSON.decode(response.responseText);
                        if (!r.success) {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), r.data.message);
                            return;
                        }
                        Ext.Msg.alert('Info', 'Save Success!');
                    },
                    failure: function (resp, operation) {
                        mask.hide();
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
            })
        })

    }
})
