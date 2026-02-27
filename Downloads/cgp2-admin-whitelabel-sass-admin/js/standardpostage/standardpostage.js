Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
])
Ext.onReady(function () {


    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('standardpostage'),
        block: 'standardpostage',
        editPage: 'edit.html',
        gridCfg: {
            store: Ext.data.StoreManager.lookup('standardPostageStore'),
            plugins: [{
                ptype: 'rowexpander',
                rowBodyTpl: new Ext.XTemplate(
                    '<div id="standard-postage-rule-content-{id}"></div>'
                )
            }],
            columns: [{
                width: 400,
                text: i18n.getKey('address'),
                itemId: 'address',
                dataIndex: 'address'
            }, {
                width: 400,
                text: i18n.getKey('website'),
                itemId: 'website',
                dataIndex: 'websiteName'
            }],
            viewConfig: {
                listeners: {
                    expandBody: Qpp.CGP.StandardPostage.Controller.expandBody
                }
            }
        },
        filterCfg: {
            items: [{
                name: 'address',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('address'),
                itemId: 'addressSearchField'
            }, {
                name: 'website',
                xtype: 'websitecombo',
                itemId: 'websiteSearchField',
                hidden: true,
            }]
        }
    })

});