Ext.define('CGP.promotionrule.view.coupon.Creator', {
    extend: 'Ext.window.Window',
    alias: 'widget.couponcreator',

    modal: true,
    layout: 'fit',
    bodyStyle: 'padding:10px',

    initComponent: function () {
        var me = this;


        me.title = i18n.getKey('createCoupon');

        me.items = [
            {
                xtype: 'form',
                border: false,
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('name'),
                        itemId: 'name',
                        allowBlank: false
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('description'),
                        itemId: 'description',
                        allowBlank: false
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('maxUse'),
                        itemId: 'maxUse',
                        allowBlank: false,
                        allowDecimal: false,
                        allowExponential: false
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('createQty'),
                        itemId: 'qty',
                        allowBlank: false,
                        allowDecimal: false,
                        allowExponential: false
                    }
                ]
            }
        ];

        me.bbar = [
            {
                xtype: 'button',
                text: i18n.getKey('ok'),
                handler: function () {
                    var form = me.form;
                    if(form.isValid()) {
                        var data =me.getValue();
                        me.createCoupons(me.ruleId,data,me);
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function () {
                    me.close();
                }
            }
        ]

        me.callParent();
        me.form = me.down('form');
    },

    getValue: function () {
        var me = this,
            form = this.form;
        var data = {};
        form.items.each(function (item) {
            data[item.itemId] = item.getValue();
        })
        return data;
    },
    
    createCoupons: function (ruleId, data, window) {



        Ext.Ajax.request({
            url: adminPath + 'api/admin/promotionRules/' + ruleId + '/coupons',
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response, options) {
                var r = Ext.JSON.decode(response.responseText);
                if (r.success) {
                    var couponList = Ext.ComponentQuery.query('couponlist')[0];
                    couponList.getStore().loadPage(1);
                    window.close();
                    return;
                }
                Ext.Msg.alert(i18n.getKey('prompt'), r.message);
            },
            failure: function (response, options) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('serverError'));
            }
        });
    }
})