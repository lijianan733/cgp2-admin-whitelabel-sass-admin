Ext.define('CGP.promotionrule.view.coupon.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.couponlist',

    
    viewConfig : {
		enableTextSelection : true    
    },
    initComponent: function () {
        var me = this;


        me.store = Ext.create('CGP.promotionrule.store.Coupon', {
            id: me.ruleId
        });

        me.columns=[{
            text: i18n.getKey('name'),
            dataIndex: 'name'
        }, {
            text: i18n.getKey('code'),
            dataIndex: 'code'
        }, {
            text: i18n.getKey('maxUse'),
            dataIndex: 'maxUse'
        }, {
            text: i18n.getKey('used'),
            dataIndex: 'used'
        }];

        me.dockedItems = [{
            xtype: 'pagingtoolbar',
            store:  me.store,
            dock: 'bottom',
            displayInfo: true
        }];

        me.callParent(arguments);
    }
})