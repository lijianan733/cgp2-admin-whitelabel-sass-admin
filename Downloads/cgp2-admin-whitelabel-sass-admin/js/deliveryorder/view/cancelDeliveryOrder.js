Ext.define('CGP.deliveryorder.view.cancelDeliveryOrder', {
    extend: 'Ext.window.Window',
    width: 420,
    modal: true,
    title: i18n.getKey('cancelDeliveryOrder'),
    bodyPadding: '20px',
    height: 250,
    layout: 'fit',
    autoShow: true,
    record: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.order.controller.Order');
        me.items = [
            {
                xtype: 'form',
                border: false,
                header: false,
                items: [
                    {
                        fieldLabel: i18n.getKey('comment'),
                        name: 'reason',
                        labelWidth: 60,
                        allowBlank: false,
                        width: 350,
                        height: 100,
                        xtype: 'textarea',
                        itemId: 'reason'
                    }
                ]
            }
        ];

        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('confirm') + i18n.getKey('cancel'),
            iconCls: 'icon_agree',
            handler: function () {
                var data = me.form.getValues();
                if (me.form.isValid()) {
                    me.cancelDOrder(me.record.get('id'), data);
                }
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function () {
                this.ownerCt.ownerCt.close();
            }
        }];
        me.callParent(arguments);
        me.form = me.down('form');
    },
    cancelDOrder: function (id, data) {
        var win = this;
        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('确认取消发货订单！'), function (selector) {
            if (selector == 'yes') {
                var url = adminPath + 'api/shipmentOrders/' + id + '/cancel?reason=' + data.reason;
                JSAjaxRequest(url, 'PUT', true, null, null, function (require, success, response) {
                    if (success) {
                        var responseText = Ext.JSON.decode(response.responseText);
                        if (responseText.success) {
                            Ext.Msg.alert(i18n.getKey('prompt'), '取消成功！');
                            win.close();
                        }
                    }
                }, true);
            }
        });
    }
});
