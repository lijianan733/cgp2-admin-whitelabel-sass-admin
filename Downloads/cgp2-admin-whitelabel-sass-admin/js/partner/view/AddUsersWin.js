Ext.define('CGP.partner.view.AddUsersWin', {
    extend: 'Ext.window.Window',

    modal: true,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('addUser');
        me.listeners = {
            'close': function () {
                me.getComponent('allUList').collection.clear();
            }
        };
        me.bbar = ['->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function () {
                    me.controller.addUsers(me)
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    btn.ownerCt.ownerCt.close();
                }
            }
        ];
        me.items = [Ext.create('CGP.partner.view.UserList', {
            filterDate: me.data,
            itemId: 'allUList',
            width: 1000,
            websiteId: me.websiteId,
            websiteName: me.websiteName
        })];
        me.callParent(arguments);
    }
    })