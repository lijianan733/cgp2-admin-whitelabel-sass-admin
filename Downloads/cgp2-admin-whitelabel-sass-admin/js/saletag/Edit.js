/**
 * @Description:
 * @author nan
 * @date 2023/7/17
 */
Ext.Loader.syncRequire([
    'CGP.saletag.model.SaleTagModel',
    'CGP.color.view.ColorGridCombo'
])
Ext.onReady(function () {
    var page = Ext.widget({
        xtype: 'uxeditpage',
        block: 'saletag',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.saletag.model.SaleTagModel',
            remoteCfg: false,
            items: [
                {
                    name: '_id',
                    xtype: 'hiddenfield',
                    hideTrigger: true,
                    isLike: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                }, {
                    name: 'name',
                    xtype: 'textfield',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    xtype: 'uxcolorfield',
                    name: 'color',
                    itemId: 'color',
                    emptyText: '点击色块选择颜色',
                    fieldLabel: i18n.getKey('color'),
                    allowBlank: false,
                    editable: false,
                    layout: 'hbox',
                }
            ]
        }
    });
});
