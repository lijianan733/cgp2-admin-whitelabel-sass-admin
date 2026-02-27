/**
 * Created by nan on 2020/10/29
 */
Ext.Loader.syncRequire([
    'CGP.color.store.ColorStore',
    'CGP.color.model.ColorModel'
])
Ext.onReady(function () {
    var store = Ext.create('CGP.color.store.ColorStore');
    // 创建一个GridPage控件
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('color'),
        block: 'color',
        // 编辑页面
        editPage: 'edit.html',
        gridCfg: {
            // store是指store.js
            store: store,
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle'
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id',
                }, {
                    text: i18n.getKey('color') + i18n.getKey('name'),
                    dataIndex: 'colorName',
                    itemId: 'colorName',
                    width: 160,
                },
                {
                    text: i18n.getKey('color') + i18n.getKey('code') + '(16进制)',
                    dataIndex: 'displayCode',
                    itemId: 'displayCode',
                    width: 160,
                },
                {
                    text: i18n.getKey('color') + i18n.getKey('code') + '(10进制)',
                    dataIndex: 'displayCode2',
                    itemId: 'displayCode2',
                    width: 200,
                }, {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    itemId: 'description',
                    width: 200,
                }, {
                    text: i18n.getKey('type'),
                    dataIndex: 'clazz',
                    itemId: 'clazz',
                    width: 150,
                    renderer: function (value, mateData, record) {
                        if (value == 'com.qpp.cgp.domain.common.color.RgbColor') {
                            return 'RGB颜色';
                        } else if (value == 'com.qpp.cgp.domain.common.color.CmykColor') {
                            return 'CMYK颜色';

                        } else if (value == 'com.qpp.cgp.domain.common.color.SpotColor') {
                            return 'SPOT颜色';

                        }
                    }
                },
                {
                    text: i18n.getKey('value'),
                    dataIndex: 'clazz',
                    width: 200,
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
                    minWidth: 200
                }
            ]
        },

        // 查询输入框
        filterCfg: {
            items: [{
                name: '_id',
                xtype: 'textfield',
                hideTrigger: true,
                isLike: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: '_id'
            }, {
                name: 'colorName',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('color') + i18n.getKey('name'),
                itemId: 'colorName'
            }, {
                name: 'displayCode',
                xtype: 'textfield',
                isLike: false,
                emptyText: i18n.getKey('16进制代码,如#FFFFFF'),
                fieldLabel: i18n.getKey('color') + i18n.getKey('code'),
                itemId: 'displayCode'
            }, {
                name: 'displayCode',
                xtype: 'textfield',
                isLike: false,
                emptyText: i18n.getKey('10进制代码'),
                fieldLabel: i18n.getKey('color') + i18n.getKey('code'),
                itemId: 'displayCode2',
                diyGetValue: function () {
                    var me = this;
                    var data = me.getValue();//10进制值
                    if (!Ext.isEmpty(data)) {
                        var hexData = Number(data).toString(16)
                        return hexData;
                    } else {
                        return null;
                    }
                }
            }, {
                name: 'description',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            },
                {
                    name: 'clazz',
                    xtype: 'combo',
                    isLike: false,
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'clazz',
                    editable: false,
                    haveReset: true,
                    valueField: 'value',
                    displayField: 'display',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                value: 'com.qpp.cgp.domain.common.color.RgbColor',
                                display: 'RGB颜色'
                            },
                            {
                                value: 'com.qpp.cgp.domain.common.color.CmykColor',
                                display: 'CMYK颜色'
                            },
                            {
                                value: 'com.qpp.cgp.domain.common.color.SpotColor',
                                display: 'SPOT颜色'
                            }
                        ]
                    })
                }]
        }
    });
});
