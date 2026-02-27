/*
* Created by nan on 2025/05/1
*/
Ext.Loader.syncRequire([
    'CGP.qpmn_tax.model.TaxConfigModel',
    'CGP.qpmn_tax.view.CountryGridField'
]);
Ext.onReady(function () {
    var editPage = Ext.create('Ext.ux.ui.EditPage', {
        block: 'qpmn_tax',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.qpmn_tax.model.TaxConfigModel',
            fieldDefaults: {
                allowBlank: false,
            },
            items: [
                {
                    xtype: 'hiddenfield',
                    name: '_id',
                    fieldLabel: i18n.getKey('_id'),
                    itemId: '_id',
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    name: 'name',
                    itemId: 'name',
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('code'),
                    name: 'code',
                    itemId: 'code',
                },
                //两位小数,
                {
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('taxRate')+'(%)',
                    name: 'taxRate',
                    itemId: 'taxRate',
                    allowDecimals: true,
                    decimalPrecision: 2,
                    minValue: 0,
                },
                {
                    xtype: 'country_grid_field',
                    fieldLabel: i18n.getKey('countryCode'),
                    name: 'countryCode',
                    itemId: 'countryCode',
                },
                {
                    xtype: 'booleancombo',
                    fieldLabel: i18n.getKey('计税金额是否包含运费'),
                    name: 'containShippingTax',
                    itemId: 'containShippingTax',
                    value: false,
                }]
        }
    });
});