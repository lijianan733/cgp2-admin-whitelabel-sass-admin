Ext.define('CGP.partner.view.CooperationUsersWin', {
    extend: 'Ext.window.Window',

    modal: true,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('cooperationUsers');
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('addUser'),
            iconCls: 'icon_add',
            handler: function () {
                var store = me.down("grid").getStore();
                var data = me.down("grid").getStore().data.items;
                me.controller.showAddUsersWin(data, me.partnerId, store, me.websiteId, me.websiteName)
            }
        }];
        me.items = [Ext.create('CGP.partner.view.PartnerUserList', {
            partnerId: me.partnerId,
            id: 'PartnerUList',
            readOnly:true
        })];
        me.callParent(arguments);
    }
})