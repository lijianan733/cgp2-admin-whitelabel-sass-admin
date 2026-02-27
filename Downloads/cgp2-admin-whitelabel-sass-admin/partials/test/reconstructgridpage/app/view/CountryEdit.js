Ext.define('CGP.testreconstructgridpage.view.CountryEdit', {
    extend: 'Ext.ux.ui.EditPage',
    alias: 'widget.testeditpage',
    block: 'partner',
    gridPage: 'main.html',
    initComponent: function () {
        var me = this;
        me.config.formCfg = {
            model: 'CGP.testreconstructgridpage.model.PartnerModel',
            remoteCfg: false,
            items: [
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name',
                    allowBlank: false
                }
            ]
        };
        me.callParent();

    }
});