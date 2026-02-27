Ext.define('CGP.cmspage.view.cmsvariable.AddCmsVariableWin', {
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    bbar: [
        '->',
        {
            xtype: 'button',
            iconCls: 'icon_agree',
            text: i18n.getKey('confirm'),
            handler: function (btn) {
                var me = btn.ownerCt.ownerCt;
                me.controller.addCmsVariable(me);
            },
        }, {
            xtype: 'button',
            iconCls: 'icon_cancel',
            text: i18n.getKey('cancel'),
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                win.close();
            }
        }],
    initComponent: function () {
        var me = this;

        me.title = i18n.getKey('addCmsVariable');
        var store = Ext.create('CGP.cmspage.store.CmsVariable');
        me.listeners = {
            close: function () {
                me.getComponent('addCmsVariable').collection.clear();
            }
        };
        me.items = [
            Ext.create('CGP.cmspage.view.cmsvariable.CmsVariableGrid', {
                filterDate: me.data,
                store: store,
                record: me.record,
                itemId: 'addCmsVariable'
            })];
        me.callParent();
    }
})