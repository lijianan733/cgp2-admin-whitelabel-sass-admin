Ext.define('CGP.order.view.order.BindOrder', {
    extend: 'Ext.window.Window',
    alias: 'widget.bindorderwindow',


    layout: 'fit',
    bodyStyle: 'padding:10px',

    initComponent: function() {
        var me = this;


        me.title= i18n.getKey('bindOrder');

        me.items = [
            Ext.create('CGP.order.view.order.TagContainer',{
                itemId: 'orderNumebrs',
                fieldLabel: i18n.getKey('orderNumber')
            })
        ];

        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('save'),
            handler: function() {
               var orderNumbers =  me.items.items[0].getSubmitValue();

                if(orderNumbers) {
                    orderNumbers = orderNumbers.split(',');
                }else {
                    orderNumbers = null;
                }

                Ext.Ajax.request({
                    method:'PUT',
                    url: adminPath + 'api/orders/' + me.orderId + '/partnerOrders',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    jsonData:{
                        orders: orderNumbers
                    },
                    success: function(r) {
                        var resp = Ext.JSON.decode(r.responseText);
                        if(resp.success) {
                            me.close();
                            Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('saveSuccess'));
                        } else {
                            Ext.Msg.alert(i18n.getKey('prompt'), resp.data.message);
                        }
                    },
                    failure: function(resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
            }
        },{
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function() {
                this.close();
            }
        }]
        me.callParent(arguments);

        this.loadBindedOrder();
    },

    loadBindedOrder: function(){
        var me = this,
            orderId = this.orderId;
        Ext.Ajax.request({
            method:'GET',
            url: adminPath + 'api/orders/' + orderId + '/partnerOrders',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function(r) {
                var resp = Ext.JSON.decode(r.responseText);
                if(resp.success) {
                    var orderNumbers = resp.data.partnerOrders;
                    me.items.items[0].setSubmitValue(resp.data.partnerOrders.join(','));
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), resp.data.message);
                }
            },
            failure: function(resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    }

});