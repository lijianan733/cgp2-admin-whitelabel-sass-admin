Ext.define('CGP.partner.view.config.baseconfig.BaseConfigWin', {
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    autoScroll: true,
    autoShow: true,
    recordData: null,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('base') + i18n.getKey('config');
        me.bbar = {
            xtype: 'bottomtoolbar',
            saveBtnCfg: {
                itemId: 'btnSave',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    if (me.form.isValid()) {
                        var baseConfig = me.form.diyGetValue();
                        me.form.saveBaseConfig(baseConfig, me.partnerId);
                    }
                }
            }
        };
        var form = Ext.create("CGP.partner.view.config.baseconfig.BaseConfigForm", {
            partnerId: me.partnerId
        });
        me.items = [form];
        me.callParent(arguments);
        me.form = me.down('form');
    }
});




