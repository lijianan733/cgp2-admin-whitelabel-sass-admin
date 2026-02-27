Ext.Loader.setPath({
    enabled: true,
    "CGP.currency": path + "js/currency"
});
Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'

]);
Ext.onReady(function () {
    var websiteStore = Ext.create("CGP.currency.store.WebsiteAll");

    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('currency'),
        block: 'currency',
        editPage: 'edit.html',
        tbarCfg: {
            hiddenButtons: ['clear', 'config', 'help', 'export', 'import', ''],
        },
        gridCfg: {
            store: Ext.create("CGP.currency.store.Currency"),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                align: 'center'
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 260,
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('货币名称'),
                    dataIndex: 'title',
                    itemId: 'title',
                    sortable: false,
                    flex: 1,
                },
                {
                    text: i18n.getKey('货币代号'),
                    dataIndex: 'code',
                    itemId: 'code',
                    sortable: false,
                    flex: 1,
                    bottomToolbarHeight: 30,
                    renderer: function (value, metadata) {
                        metadata.style = "font-weight:bold";
                        return value;
                    }
                },
                {
                    text: i18n.getKey('货币符号'),
                    dataIndex: 'symbolLeft',
                    itemId: 'symbolLeft',
                    flex: 1,
                    sortable: false
                },
                {
                    text: i18n.getKey('decimalPoint'),
                    dataIndex: 'decimalPoint',
                    xtype: 'gridcolumn',
                    itemId: 'decimalPoint',
                    sortable: false,
                    renderer: function (value, metadata) {
                        metadata.style = "font-weight:bold";
                        return value;
                    }
                },
                {
                    text: i18n.getKey('thousandsPoint'),
                    dataIndex: 'thousandsPoint',
                    itemId: 'thousandsPoint',
                    sortable: false,
                    renderer: function (value, metadata) {
                        metadata.style = "font-weight :bold";
                        return value;
                    }
                },
                {
                    text: i18n.getKey('accuracy'),
                    dataIndex: 'decimalPlaces',
                    itemId: 'decimalPlaces',
                    flex: 1,
                    sortable: false
                },
            ]
        },
        filterCfg: {
            height: 80,
            layout: {
                type: 'column',
                columns: 4
            },
            defaults: {
                margin: '5 20 5 0',
            },
            items: [
                {
                    xtype: 'numberfield',
                    name: 'id',
                    itemId: 'id',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                },
                {
                    xtype: 'textfield',
                    name: 'title',
                    itemId: 'title',
                    fieldLabel: i18n.getKey('货币名称'),
                },
                {
                    xtype: 'textfield',
                    name: 'code',
                    itemId: 'code',
                    fieldLabel: i18n.getKey('货币代号'),
                },
                {
                    xtype: 'websitecombo',
                    name: 'website.id',
                    itemId: 'websiteCombo',
                    hidden: true,
                    value: 11
                },
            ]
        }
    });
});