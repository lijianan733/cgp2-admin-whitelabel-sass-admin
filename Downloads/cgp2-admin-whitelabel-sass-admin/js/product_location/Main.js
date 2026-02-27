/*
* Created by nan on 2025/05/1
*/
Ext.Loader.syncRequire([
    'CGP.qpmn_tax.view.CountryGridField',
    'CGP.product_location.store.ProductLocationStore'
]);
Ext.onReady(function () {
    var store = Ext.create("CGP.product_location.store.ProductLocationStore");
    var gridPage = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('生产基地'),
        block: 'product_location',
        editPage: 'edit.html',
        gridCfg: {
            store: store,
            frame: false,
            columns: [{
                width: 100,
                text: i18n.getKey('id'),
                dataIndex: '_id',
            }, {
                xtype: 'auto_bread_word_column',
                text: i18n.getKey('code'),
                dataIndex: 'code',
                flex: 1,
            }]
        },
        filterCfg: {
            items: [{
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                xtype: 'textfield',
                name: 'code',
                fieldLabel: i18n.getKey('code'),
                itemId: 'code'
            }]
        }
    });
});