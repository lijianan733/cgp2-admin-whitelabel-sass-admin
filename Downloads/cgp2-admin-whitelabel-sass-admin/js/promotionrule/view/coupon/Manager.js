Ext.define('CGP.promotionrule.view.coupon.Manager', {
    extend: 'Ext.window.Window',
    alias: 'widget.couponmanager',
    requires: [
        'CGP.promotionrule.view.coupon.List',
        'CGP.promotionrule.view.coupon.Creator'
    ],

    modal: true,
    autoScroll: true,
    bodyStyle: 'padding:10px',
    width:800,
    height:600,

    initComponent: function () {
        var me = this;


        me.title = i18n.getKey('couponManagement');

        me.items = [
            {
                xtype: 'couponlist',
                ruleId: me.ruleId
            }
        ];

        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('add'),
                handler: function () {
                    Ext.widget({
                        xtype: 'couponcreator',
                        ruleId: me.ruleId
                    }).show();
                }
            }
        ];

        me.callParent(arguments);

    }

})