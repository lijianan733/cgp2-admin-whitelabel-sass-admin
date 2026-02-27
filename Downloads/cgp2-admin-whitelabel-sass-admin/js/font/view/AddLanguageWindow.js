Ext.define('CGP.font.view.AddLanguageWindow', {
    extend: 'Ext.window.Window',

    modal: true,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('add') + i18n.getKey('language');
        me.listeners = {
            'close': function () {
                me.getComponent('allLanguage').collection.clear();
            }
        };
        me.bbar = ['->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function () {
                    var selectRecords = me.getComponent('allLanguage').grid.getSelectionModel().getSelection();
                    me.controller.addLanguage(selectRecords, me, me.store);
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function () {
                    me.close();
                }
            }];
        me.items = [Ext.create('CGP.font.view.LanguageList', {
            filterData: me.filterData,
            itemId: 'allLanguage',
            selecteds:me.store
        })];
        me.callParent(arguments);
    }
})