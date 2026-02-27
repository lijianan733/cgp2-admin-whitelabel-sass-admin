/**
 *修改订单付款方式
 *
 */

Ext.onReady(function () {





    var model = Ext.define('CGP.model.PaymentMethod', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'id',
            type: 'int'
        }, {
            name: 'websiteId',
            type: 'int'
        }, 'orderNumber', 'paymentMethod']
    })

    function returnGrid() {
        JSOpen({
            id: 'page',
            url: path + 'partials/order/order.html',
            title: i18n.getKey('order')
        });
    }

    function submit() {

        var form = this.ownerCt.ownerCt;
        var data = form.form.getValuesByModel('CGP.model.PaymentMethod');
        Ext.Ajax.request({
            url: adminPath + 'api/websites/' + data.websiteId + '/orders/' + data.id + '/paymentMethod',
            method: 'PUT',
            jsonData: {
                code: data.paymentMethod
            },
            success: function (response, options) {

                var resp = Ext.JSON.decode(response.responseText);
                if (!resp.success) {
                    Ext.Msg.alert('Info', resp.data.message);
                    return;
                }

                Ext.Msg.alert('Info', 'Save success!');
            },
            failure: function (resp, options) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });

    }

    var page = Ext.widget({
        xtype: 'uxeditpage',
        formCfg: {
            bodyStyle: 'padding:10px',
            fieldDefaults: {
                labelAlign: 'right',
                width: 380,
                msgTarget: 'side',
                labelWidth: 130,
                validateOnChange: false,
                plugins: [{
                    ptype: 'uxvalidation'
            }]
            },
            columnCount: 1,
            tbar: [{
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: submit
            }, {
                xtype: 'button',
                text: i18n.getKey('grid'),
                iconCls: 'icon_grid',
                handler: returnGrid
            }],
            model: model.getName(),
            items: [{
                xtype: 'hidden',
                name: 'id',
                itemId: 'id'
            }, {
                xtype: 'hidden',
                name: 'websiteId',
                itemId: 'websiteId'
            }, {
                xtype: 'displayfield',
                name: 'orderNumber',
                itemId: 'orderNumber',
                fieldLabel: i18n.getKey('orderNumber')
            }, {
                xtype: 'combo',
                name: 'paymentMethod',
                itemId: 'paymentMethod',
                editable: false,
                fieldLabel: i18n.getKey('paymentMethod'),
                displayField: 'title',
                valueField: 'code'
            }]
        },
        listeners: {
            afterload: function (p) {
                var searcher = Ext.Object.fromQueryString(location.search);
                if (Ext.Object.isEmpty(searcher)) {
                    return;
                }

                var id = searcher.orderId;
                Ext.Ajax.request({
                    url: adminPath + 'api/orders/' + id + '/paymentMethod',
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (response, options) {

                        var resp = Ext.JSON.decode(response.responseText);
                        if (!resp.success) {
                            Ext.Msg.alert('Info', resp.data.message);
                            return;
                        }



                        var data = new CGP.model.PaymentMethod(resp.data);
                        data.set('orderNumber', '<div class="status-field">' + data.get('orderNumber') + '</div>');
                        p.form.form.setValuesByModel(data);
                        var paymentMethod = p.form.getComponent('paymentMethod');
                        var store = new Ext.data.Store({
                            fields: ['code', 'title'],
                            proxy: {
                                type: 'uxrest',
                                url: adminPath + 'api/websites/' + data.get('websiteId') + '/orders/' + data.get('id') + '/availablePaymentMethods',
                                reader: {
                                    type: 'json',
                                    root: 'data'
                                }
                            }
                        });
                        paymentMethod.bindStore(store);
                    },
                    failure: function (resp, options) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
            }
        }
    });

});
