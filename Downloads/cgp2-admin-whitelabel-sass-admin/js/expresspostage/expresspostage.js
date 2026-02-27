Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
])
Ext.onReady(function () {


    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('expresspostage'),
        block: 'expresspostage',
        editPage: 'edit.html',
        gridCfg: {
            store: Ext.data.StoreManager.lookup('expressPostageStore'),
            plugins: [{
                ptype: 'rowexpander',
                rowBodyTpl: new Ext.XTemplate(
                    '<div id="express-postage-rule-content-{id}"></div>'
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
                    expandBody: Qpp.CGP.ExpressPostage.Controller.expandBody
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
                value: 11,
                hidden: true,
            }]
        }
    })

});