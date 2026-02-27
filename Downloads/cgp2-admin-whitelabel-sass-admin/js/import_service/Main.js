/*
* Created by nan on 2025/05/1
*/
Ext.Loader.syncRequire([
    'CGP.qpmn_tax.view.CountryGridField',
    'CGP.import_service.store.ImportServiceStore',
    'CGP.product_location.view.ProductLocationSelector'

]);
Ext.onReady(function () {
    var taxConfigStore = Ext.create("CGP.import_service.store.ImportServiceStore");
    var gridPage = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('ImportService费用'),
        block: 'import_service',
        editPage: 'edit.html',
        gridCfg: {
            store: taxConfigStore,
            frame: false,
            columns: [{
                text: i18n.getKey('id'),
                dataIndex: '_id',
            }, {
                xtype: 'auto_bread_word_column',
                text: i18n.getKey('name'),
                dataIndex: 'name',
                flex: 1,
            }, {
                xtype: 'auto_bread_word_column',
                text: i18n.getKey('code'),
                dataIndex: 'code',
                flex: 1,
            }, {
                text: i18n.getKey('计算策略'),
                dataIndex: 'calculateStrategy',
                renderer: function (value) {
                    if (value == 'PERCENTAGE') {
                        return '百分比';
                    } else {
                        return '固定值';

                    }
                }
            }, {
                text: i18n.getKey('importService数值'),
                dataIndex: 'calculateValue',
                width: 150,
                renderer: function (value, mateData, record) {
                    var calculateStrategy = record.get('calculateStrategy');
                    if (calculateStrategy == 'PERCENTAGE') {
                        return value + '%';
                    } else {
                        return value;
                    }
                }
            }, {
                text: i18n.getKey('应用状态'),
                dataIndex: 'applicationMode',
                width: 100,
            }, {
                text: i18n.getKey('countryCode'),
                dataIndex: 'countryCode',
                width: 100,
            }, {
                text: i18n.getKey('importService数值是否包含运费'),
                dataIndex: 'containShippingCalculate',
                width: 230,
                renderer: function (value) {
                    return value ? '<font color="red">是</font>' : '<font color="green">否</font>';
                }
            }, {
                text: i18n.getKey('生产中心'),
                dataIndex: 'manufactureCenter',
                width: 150,
            }, {
                text: i18n.getKey('shippingMethod'),
                dataIndex: 'shippingMethod',
                width: 150,
            }]
        },
        filterCfg: {
            layout: {
                type: 'table',
                columns: 4
            },
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
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
            ]
        }
    });
});