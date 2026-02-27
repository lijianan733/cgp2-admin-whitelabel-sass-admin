Ext.define('CGP.replenishment.controller.Replenishment', {
    extend: 'Ext.app.Controller',

    models: [
        'Order'
    ],

    stories: [

    ],

    views: [
        'Replenishment'
    ],

    refs: [{
            ref: 'replenishment',
            selector: 'replenishment'
        }
    ],

    init: function () {
        var me = this;

        this.control({
            'replenishment': {
                afterrender: me.initValue
            },
            'replenishment button[action=save]': {
                click: me.createReplenishment
            }
        });
    },


    createReplenishment: function () {
        var me = this;
        var replenishment = me.getReplenishment();


        if (replenishment.isValid()) {

            Ext.Ajax.request({
                method: 'POST',
                url: adminPath + 'api/orders/' + replenishment.order.get('id') + '/replenishment',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: replenishment.getValue(),
                success: function (resp, operation) {
                    var response = Ext.JSON.decode(resp.responseText);
                    if (response.success) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                        var oldValue = replenishment.getComponent('replenishments').getValue();
                        var newValue;
                        if (Ext.isEmpty(oldValue)) {
                            newValue = oldValue + '<font color=red>' + response.data.orderNumber + '</font>';
                        } else {
                            newValue = oldValue + ',<font color=red>' + response.data.orderNumber + '</font>';
                        }
                        replenishment.getComponent('replenishments').setValue(newValue);
                        replenishment.toReadStatus();
                    } else {
                        Ext.Msg.alert(i18n.getKey('prompt'), response.data.message);
                    }
                },
                failure: function (resp, operation) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });

        }

    },

    initValue: function () {

        var me = this;


        var searcher = Ext.Object.fromQueryString(location.search);
        if (searcher.orderId) {
            var orderId = Ext.Number.from(searcher.orderId);

            Ext.Ajax.request({
                method: 'GET',
                url: adminPath + 'api/orders/' + orderId + '/replenishment',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (resp, operation) {
                    var response = Ext.JSON.decode(resp.responseText);
                    if (response.success) {

                        var order = Ext.create('CGP.replenishment.model.Order', response.data);
                        var replenishment = me.getReplenishment();
                        replenishment.setValue(order);

                    } else {
                        Ext.Msg.alert(i18n.getKey('prompt'), response.data.message);
                    }
                },
                failure: function (resp, operation) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });

        }

    }



})