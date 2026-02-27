/**
 * Created by nan on 2021/4/15
 */
Ext.define('CGP.color.view.ColorGridCombo', {
    extend: 'Ext.form.field.GridComboBox',
    alias: 'widget.colorgridcombo',
    fieldLabel: i18n.getKey('显示颜色'),
    allowBlank: false,
    valueField: '_id',
    displayField: 'colorName',
    editable: false,
    matchFieldWidth: false,
    diyGridCfg: null,
    diyFilterCfg: null,
    diyGetValue: function () {
        var me = this;
        return me.getArrayValue();
    },
    initComponent: function () {
        var me = this;
        var colorStore = Ext.create('CGP.color.store.ColorStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'clazz',
                    type: 'string',
                    value: 'com.qpp.cgp.domain.common.color.RgbColor'
                }])
            }
        });
        var colorStore = colorStore;
        me.gridCfg = Ext.Object.merge({
            store: colorStore,
            width: 600,
            height: 450,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id',
                }, {
                    text: i18n.getKey('color') + i18n.getKey('name'),
                    dataIndex: 'colorName',
                    itemId: 'colorName',
                    width: 110,
                }, {
                    text: i18n.getKey('type'),
                    dataIndex: 'clazz',
                    itemId: 'clazz',
                    width: 110,
                    renderer: function (value, mateData, record) {
                        if (value == 'com.qpp.cgp.domain.common.color.RgbColor') {
                            return 'RGB颜色';
                        } else if (value == 'com.qpp.cgp.domain.common.color.CmykColor') {
                            return 'CMYK颜色';

                        } else if (value == 'com.qpp.cgp.domain.common.color.SpotColor') {
                            return 'SPOT颜色';

                        }
                    }
                }, {
                    text: i18n.getKey('value'),
                    dataIndex: 'clazz',
                    width: 150,
                    itemId: 'value',
                    renderer: function (value, mateData, record) {
                        if (value == 'com.qpp.cgp.domain.common.color.RgbColor') {
                            return 'R:' + record.get('r') + ' G:' + record.get('g') + ' B:' + record.get('b') + '';
                        } else if (value == 'com.qpp.cgp.domain.common.color.CmykColor') {
                            return 'C:' + record.get('c') + ' M:' + record.get('m') + ' Y:' + record.get('y') + ' K:' + record.get('k') + '';
                        }
                    }
                }, {
                    text: i18n.getKey('显示颜色'),
                    itemId: 'color',
                    dataIndex: 'color',
                    flex: 1,
                }
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: colorStore,
                displayInfo: true,
                displayMsg: '',
                emptyMsg: i18n.getKey('noData')
            }
        }, me.diyGridCfg);
        me.filterCfg = Ext.Object.merge({
            minHeight: 60,
            layout: {
                type: 'column',
                columns: 2
            },
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    hideTrigger: true,
                    isLike: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                },
                {
                    name: 'displayCode',
                    xtype: 'textfield',
                    isLike: false,
                    emptyText: i18n.getKey('16进制代码,如#FFFFFF'),
                    fieldLabel: i18n.getKey('color') + i18n.getKey('code'),
                    itemId: 'displayCode'
                },
            ]
        }, me.diyFilterCfg);
        me.callParent();
    },
})