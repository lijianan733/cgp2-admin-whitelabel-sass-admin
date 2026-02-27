/*
* Created by nan on 2025/05/1
*/
Ext.Loader.syncRequire([
    'CGP.qpmn_tax_switch.model.TaxSwitchConfigModel',
    'CGP.qpmn_tax.view.CountryGridField'
]);
Ext.onReady(function () {
    var editPage = Ext.create('Ext.ux.ui.EditPage', {
        block: 'qpmn_tax_switch',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.qpmn_tax_switch.model.TaxSwitchConfigModel',
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
                    xtype: 'hiddenfield',
                    name: 'clazz',
                    fieldLabel: i18n.getKey('clazz'),
                    itemId: 'clazz',
                    value: 'com.qpp.cgp.domain.common.taxswitch.AreaTaxSwitch'
                },

                {
                    xtype: 'country_grid_field',
                    fieldLabel: i18n.getKey('countryCode'),
                    name: 'countryCode',
                    itemId: 'countryCode',
                },
                {
                    xtype: 'combobox',
                    fieldLabel: i18n.getKey('应用状态'),
                    name: 'applicationMode',
                    itemId: 'applicationMode',
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                display: 'Stage',
                                value: 'Stage'
                            },
                            {
                                display: 'Production',
                                value: 'Production'
                            },
                        ]
                    }

                },
                {
                    xtype: 'booleancombo',
                    name: 'close',
                    fieldLabel: i18n.getKey('是否免税'),
                    itemId: 'close',
                }]
        }
    });
});