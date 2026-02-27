Ext.define('CGP.order.actions.invoice.view.Invoice', {
    extend: 'Ext.form.Panel',

    requires: ['CGP.order.actions.invoice.model.Invoice'],



    autoScroll: true,
    constructor: function (config) {

        var me = this;


        me.websiteId = Ext.Object.fromQueryString(location.search).websiteId;


        //type为1时不显示且清空title type为2时显示title
        var items = [
            {
                xtype: 'radiogroup',
                fieldLabel: i18n.getKey('type'),
                columns: 2,
                vertical: false,
                width: 400,
                items: [{
                        boxLabel: i18n.getKey('personal'),
                        name: 'type',
                        inputValue: 1,
                        listeners: {
                            change: function () {
                                if (this.getValue() === true) {
                                    var title = me.getComponent('title');
                                    title.setValue('');
                                    title.setVisible(false);
                                }
                            }
                        }
                }, {
                        boxLabel: i18n.getKey('company'),
                        name: 'type',
                        inputValue: 2,
                        listeners: {
                            change: function () {
                                if (this.getValue() === true) {
                                    var title = me.getComponent('title');
                                    title.setVisible(true);
                                }
                            }
                        }
                }
            ],
                itemId: 'type'
        }, {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('companyName'),
                name: 'title',
                itemId: 'title'
        }, {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('content'),
                name: 'content',
                itemId: 'content',
                value: '商品名称'
        }
        ];

        config = Ext.apply({
            items: items
        }, config);


        this.callParent([config]);

    },


    initComponent: function () {

        var me = this;

        me.callParent(arguments);

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

    //初始化表单数据
    initData: function () {

        var me = this;
        var searcher = Ext.Object.fromQueryString(location.search);

        if (searcher.orderId) {

            var orderId = searcher.orderId;
            me.orderId = orderId;
            Ext.Ajax.request({
                method: 'GET',
                url: adminPath + 'api/orders/' + orderId + '/invoice',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response, operation) {
                    var r = Ext.JSON.decode(response.responseText);
                    if (r.success) {

                        var model = Ext.create('CGP.order.actions.invoice.model.Invoice',
                            r.data
                        );
                        me.setValue(model);
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), r.data.message);
                    }
                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
        }

    },
    setValue: function (model) {
        var me = this;


        me.setTitle(i18n.getKey('orderNo') + ':' + model.get('orderNo'));

        var type = me.getComponent('type');
        var title = me.getComponent('title');
        var content = me.getComponent('content');
        type.setValue({
            type: model.get('type')
        });
        title.setValue(model.get('title'));
        content.setValue(model.get('content'));

        //        me.websiteId = model.get('websiteId');
    },
    save: function () {

        var me = this;

        var type = me.getComponent('type');
        var title = me.getComponent('title');
        var content = me.getComponent('content');

        Ext.Ajax.request({
            method: 'PUT',
            url: adminPath + 'api/websites/' + me.websiteId + '/orders/' + me.orderId + '/invoice',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: {
                type: type.getValue().type,
                title: title.getValue(),
                content: content.getValue()
            },
            success: function (response, operation) {
                var r = Ext.JSON.decode(response.responseText);
                if (r.success) {

                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), r.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    }

})
