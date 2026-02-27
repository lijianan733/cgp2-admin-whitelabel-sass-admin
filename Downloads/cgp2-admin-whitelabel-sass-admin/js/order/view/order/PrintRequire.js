Ext.define('CGP.order.view.order.PrintRequire', {
    extend: 'Ext.window.Window',


    bodyStyle: 'padding:10px',
    modal: true,

    initComponent: function () {
        var me = this,
            record = this.record;

        var recordId = record.get('id');


        me.title = i18n.getKey('printAgain');
        me.items = [
            {
                xtype: 'radiogroup',
                itemId: 'type',
                width: 500,
                fieldLabel: i18n.getKey('type'),
                hidden:true,
                items: [
                    {
                        boxLabel: 'HP5500',
                        name: 'type',
                        inputValue: 'HP5500',
                        checked: true
                    },
                    {
                        boxLabel: 'HP10000',
                        name: 'type',
                        inputValue: 'HP10000'
                    }
                ]
            },
            {
                xtype: 'textarea',
                fieldLabel: i18n.getKey('comment'),
                itemId: 'comment',
                cols: 40,
                rows: 10
            }
        ];

        me.bbar = [{
            xtype: 'button',
            text: i18n.getKey('ok'),
            handler: function () {
                var lm = me.setLoading(i18n.getKey('loading'));
                Ext.Ajax.request({
                    method: 'PUT',
                    url: adminPath + 'api/orders/' + recordId + '/printAgain',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    jsonData: {
                        comment: me.getComponent('comment').getValue(),
                        type: me.getComponent('type').getValue()['type']
                    },
                    success: function (resp, operation) {
                        lm.hide();
                        var response = Ext.JSON.decode(resp.responseText);
                        if (response.success) {
                            me.close();
                            record.store.loadPage(1);
                            Ext.Msg.alert(i18n.getKey('prompt'), '重新排版请求成功！');

                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    },
                    failure: function (resp, operation) {
                        lm.hide();
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }];

        me.callParent(arguments);
    }
})