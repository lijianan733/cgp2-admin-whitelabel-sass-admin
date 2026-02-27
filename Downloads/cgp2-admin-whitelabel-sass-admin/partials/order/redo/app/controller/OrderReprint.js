Ext.define('CGP.orderreprint.controller.OrderReprint', {
    extend: 'Ext.app.Controller',

    models: [
        'OrderReprint',
        'OrderLineItem'
    ],

    stories: [
        'OrderLineItem'
    ],

    views: [
        'Apply'
    ],

    refs: [{
        ref: 'apply',
        selector: 'reprintapply'
    }],

    init: function () {

        var me = this;

        this.control({
            'reprintapply': {
                afterrender: me.initValue
            },
            'reprintapply button[action=save]': {
                click: me.saveApply
            }
        });

    },




    initValue: function () {

        var me = this;




        var searcher = Ext.Object.fromQueryString(location.search);

        //有orderId没有id 属于申请过程
        if (searcher.orderId && !searcher.id) {

            me.orderId = Ext.Number.from(searcher.orderId);

            Ext.Ajax.request({
                method: 'GET',
                url: adminPath + 'api/orders/' + searcher.orderId + '/redoInfo',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (resp, operation) {
                    var response = Ext.JSON.decode(resp.responseText);
                    if (response.success) {

                        var orderReprint = Ext.create('CGP.orderreprint.model.OrderReprint', response.data);
                        var apply = me.getApply();
                        apply.setValue(orderReprint, true);

                    } else {
                        Ext.Msg.alert(i18n.getKey('prompt'), response.data.message);
                    }
                },
                failure: function (resp, operation) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });

        } else if (searcher.id) {

            Ext.Ajax.request({
                method: 'GET',
                url: adminPath + 'api/orders/redo/' + searcher.id,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (resp, operation) {
                    var response = Ext.JSON.decode(resp.responseText);
                    if (response.success) {

                        var orderReprint = Ext.create('CGP.orderreprint.model.OrderReprint', response.data);
                        var apply = me.getApply();
                        apply.setValue(orderReprint);

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

    saveApply: function () {

        var me = this;
        var apply = me.getApply();

        if (!apply.isValid())
            return;

        var data = apply.getValue();


        Ext.Ajax.request({
            method: 'POST',
            url: adminPath + 'api/orders/' + me.orderId + '/redo',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success) {

                    var orderReprint = Ext.create('CGP.orderreprint.model.OrderReprint', response.data);
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                    var apply = me.getApply();
                    apply.setValue(orderReprint, true);

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


});