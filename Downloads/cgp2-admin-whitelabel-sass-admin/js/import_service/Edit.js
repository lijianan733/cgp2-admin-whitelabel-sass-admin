/*
* Created by nan on 2025/05/1
*/
Ext.Loader.syncRequire([
    'CGP.import_service.model.ImportServiceModel',
    'CGP.qpmn_tax.view.CountryGridField',
    'CGP.product_location.view.ProductLocationSelector'
]);
Ext.onReady(function () {
    var editPage = Ext.create('Ext.ux.ui.EditPage', {
        block: 'import_service',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.import_service.model.ImportServiceModel',
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
                    value: 'com.qpp.cgp.domain.importservice.ImportService'
                },
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name',
                },
                {
                    xtype: 'textfield',
                    name: 'code',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code',
                },
                {
                    xtype: 'combo',
                    name: 'calculateStrategy',
                    fieldLabel: i18n.getKey('计算策略'),
                    itemId: 'calculateStrategy',
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    value: 'PERCENTAGE',
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                display: '百分比',
                                value: 'PERCENTAGE'
                            },
                            {
                                display: '固定值',
                                value: 'FIX'
                            },
                        ]
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('importService数值'),
                    name: 'calculateValue',
                    itemId: 'calculateValue',
                    allowDecimals: true,
                    decimalPrecision: 2,
                    minValue: 0,
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
                    xtype: 'country_grid_field',
                    fieldLabel: i18n.getKey('countryCode'),
                    name: 'countryCode',
                    itemId: 'countryCode',
                },
                {
                    xtype: 'booleancombo',
                    fieldLabel: i18n.getKey('importService数值是否包含运费'),
                    name: 'containShippingCalculate',
                    itemId: 'containShippingCalculate',
                },
                {
                    xtype: 'product_location_selector',
                    fieldLabel: i18n.getKey('生产基地'),
                    name: 'manufactureCenter',
                    itemId: 'manufactureCenter',
                },
                {
                    xtype: 'hiddenfield',
                    fieldLabel: i18n.getKey('shippingMethod'),
                    name: 'shippingMethod',
                    itemId: 'shippingMethod',
                },
            ]
        }
    });
});