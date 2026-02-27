Ext.define('CGP.common.reprint.view.Apply', {
    extend: 'Ext.window.Window',
    alias: 'widget.reprintapply',
    requires: [
        'CGP.common.reprint.controller.Controller',
        'CGP.common.reprint.view.Reason'
    ],


    bodyStyle: 'padding:10px;',
    modal: true,
    defaults: {
        style: 'margin:10px'
    },

    initComponent: function () {
        var me = this,
            reprintWindow = this.reprintWindow,
            itemId = this.itemId,
            maxQty = this.maxQty,
            paramName = this.paramName;

        reprintWindow.close();


        me.controller = Ext.create('CGP.common.reprint.controller.Controller');

        me.title = i18n.getKey('applyReprint');

        me.items = {
            xtype: 'form',
            border: false,
            itemId: 'form',
            items: [{
                xtype: 'numberfield',
                allowDecimals: false,
                allowExponential: false,
                msgTarget: 'side',
                minValue: 1,
                itemId: 'qty',
                fieldLabel: i18n.getKey('qty'),
                hideTrigger: true,
                allowBlank: false,
                maxValue: maxQty
            }, {
                xtype: 'reasonselector'

            }, {
                xtype: 'textarea',
                allowBlank: false,
                cols: 30,
                rows: 7,
                itemId: 'remark',
                fieldLabel: i18n.getKey('remark')
            }]
        };

        me.bbar = [{
            xtype: 'button',
            text: i18n.getKey('ok'),
            handler: function () {
                me.controller.confirmReprintApply(itemId, me.getComponent('form'), me, paramName, null, me.callback);
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }];

        me.callParent(arguments);

        me.form = me.down('form');
    },

    confirmReprintApply: function (itemId, form, window, status, data) {

        var me = this;

        if (form) {
            if (!form.isValid()) {
                return;
            }
        }
        if (!data) {
            data = {
                status: status,
                qty: form.getComponent('qty').getValue(),
                remark: form.getComponent('remark').getValue()
            }
        }
        Ext.Ajax.request({
            method: 'PUT',
            url: adminPath + 'api/admin/workLineItem/' + itemId + '/reprintApply',
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success) {
                    window.close();
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('submitSuccess'));
                    me.close();
                    var data = response.data;
                    me.callback(data);

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });

    }
})