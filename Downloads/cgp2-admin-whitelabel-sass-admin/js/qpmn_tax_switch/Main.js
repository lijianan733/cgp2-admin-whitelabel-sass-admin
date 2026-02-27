/*
* Created by nan on 2025/05/1
*/
Ext.Loader.syncRequire([
    'CGP.qpmn_tax.view.CountryGridField',
    'CGP.qpmn_tax_switch.store.TaxSwitchConfigStore'
]);
Ext.onReady(function () {
    var taxConfigStore = Ext.create("CGP.qpmn_tax_switch.store.TaxSwitchConfigStore");
    var gridPage = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('QPMN免税配置'),
        block: 'qpmn_tax_switch',
        editPage: 'edit.html',
        gridCfg: {
            store: taxConfigStore,
            frame: false,
            columns: [{
                text: i18n.getKey('id'),
                dataIndex: '_id',
            }, {
                text: i18n.getKey('countryCode'),
                dataIndex: 'countryCode',
                width: 150,
            }, {
                text: i18n.getKey('应用状态'),
                dataIndex: 'applicationMode',
                width: 150,
            }, {//是否关闭计税
                text: i18n.getKey('是否免税'),
                dataIndex: 'close',
                flex: 1,
                renderer: function (value) {
                    if (value) {
                        return '<font color="red">是</font>';
                    } else {
                        return '<font color="red">否</font>';
                    }
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
            },  {
                xtype: 'country_grid_field',
                name: 'countryCode',
                fieldLabel: i18n.getKey('countryCode'),
                itemId: 'countryCode'
            }, {
                xtype: 'booleancombo',
                name: 'close',
                fieldLabel: i18n.getKey('是否免税'),
                itemId: 'close'
            }]
        }
    });
});