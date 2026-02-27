/*
* Created by nan on 2025/05/1
*/
Ext.Loader.syncRequire([
    'CGP.qpmn_tax.view.CountryGridField'
]);
Ext.onReady(function () {
    var taxConfigStore = Ext.create("CGP.qpmn_tax.store.TaxConfigStore");
    var gridPage = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('QPMN税配置'),
        block: 'qpmn_tax',
        editPage: 'edit.html',
        gridCfg: {
            store: taxConfigStore,
            frame: false,
            columns: [{
                text: i18n.getKey('id'),
                dataIndex: '_id',
            }, {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                width: 150,
            }, {
                text: i18n.getKey('code'),
                dataIndex: 'code',
                width: 150,
            }, {
                text: i18n.getKey('countryCode'),
                dataIndex: 'countryCode',
                width: 150,
            }, {
                xtype: 'numbercolumn',
                text: i18n.getKey('taxRate') + '(%)',
                dataIndex: 'taxRate',
            }, {
                text: i18n.getKey('计税金额是否包含运费'),
                dataIndex: 'containShippingTax',
                flex: 1,
                renderer: function (value) {
                    return value ? '<font color="red">是</font>' : '<font color="green">否</font>';
                }
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
                name: 'name',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                xtype: 'textfield',
                name: 'code',
                fieldLabel: i18n.getKey('code'),
                itemId: 'code'
            }, {
                xtype: 'country_grid_field',
                name: 'countryCode',
                fieldLabel: i18n.getKey('countryCode'),
                itemId: 'countryCode'
            }, {
                xtype: 'booleancombo',
                name: 'containShippingTax',
                fieldLabel: i18n.getKey('计税金额是否包含运费'),
                itemId: 'containShippingTax'
            }]
        }
    });
});