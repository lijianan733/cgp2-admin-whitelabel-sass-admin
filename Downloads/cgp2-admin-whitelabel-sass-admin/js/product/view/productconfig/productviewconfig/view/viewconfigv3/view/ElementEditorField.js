/**
 * Created by nan on 2021/6/24
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config'
])
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.ElementEditorField', {
    extend: 'Ext.ux.form.GridFieldWithCRUDV2',
    alias: 'widget.elementeditorfield',
    initComponent: function () {
        var me = this;
        var colorStore = Ext.create('CGP.color.store.ColorStore', {
            autoLoad: false,
            params: {
                filter: Ext.JSON.encode([{
                    name: 'clazz',
                    type: 'string',
                    value: 'com.qpp.cgp.domain.common.color.RgbColor'
                }])
            }
        });
        me.gridConfig = {
            autoScroll: true,
            viewConfig: {
                autoScroll: true,
            },
            store: Ext.create('Ext.data.Store', {
                autoSync: true,
                fields: [
                    {name: 'clazz', type: 'string'},
                    {name: 'elementClazz', type: 'string'},
                    {name: 'elementTag', type: 'string'},
                    {name: 'sizeMin', type: 'string'},
                    {name: 'sizeMax', type: 'string'},
                    {name: 'showRotation', type: 'boolean'},
                    {name: 'showZoom', type: 'boolean'},
                    {name: 'showFlip', type: 'boolean'},
                    {name: 'showBrightness', type: 'boolean'},
                    {name: 'brightnessMin', type: 'number'},
                    {name: 'brightnessMax', type: 'number'},
                    {name: 'filters', type: 'array'},
                ],
                data: CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config.elementEditors
            }),
            columns: [
                {
                    text: i18n.getKey('目标元素类型'),
                    dataIndex: 'elementClazz',
                    width: 150,
                },
                {
                    text: i18n.getKey('目标元素标签'),
                    dataIndex: 'elementTag',
                    width: 150,
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'clazz',
                    flex: 1,
                    minWidth: 100,
                    renderer: function (value, mateData, record) {
                        if (value == 'com.qpp.cgp.domain.product.config.view.builder.config.v3.TextEditorConfig') {
                            return i18n.getKey('TextEditor');
                        } else if (value == 'com.qpp.cgp.domain.product.config.view.builder.config.v3.PhotoEditorConfig') {
                            return i18n.getKey('PhotoEditor');
                        }
                    }
                },
            ]
        };
        me.winConfig = {
            formConfig: {
                defaults: {
                    flex: 1,
                    width: 500,
                    colspan: 2,
                    hidden: false,
                    disabled: false,
                    allowBlank: true,
                },
                layout: {
                    type: 'table',
                    columns: 2
                },
                items: [
                    {
                        xtype: 'combo',
                        editable: false,
                        name: 'clazz',
                        itemId: 'clazz',
                        valueField: 'value',
                        displayField: 'display',
                        hidden: false,
                        disabled: false,
                        fieldLabel: i18n.getKey('clazz'),
                        mapping: {
                            common: ['clazz'],
                            'com.qpp.cgp.domain.product.config.view.builder.config.v3.TextEditorConfig': [
                                'elementClazz', 'elementTag', 'sizeMin', 'sizeMax'
                            ],
                            'com.qpp.cgp.domain.product.config.view.builder.config.v3.PhotoEditorConfig': [
                                'elementClazz', 'elementTag', 'showRotation',
                                'showZoom', 'showFlip', 'showBrightness',
                                'brightnessMin', 'brightnessMax', 'filters'
                            ],
                        },
                        value: 'com.qpp.cgp.domain.product.config.view.builder.config.v3.PhotoEditorConfig',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: [{
                                value: 'com.qpp.cgp.domain.product.config.view.builder.config.v3.TextEditorConfig',
                                display: i18n.getKey('TextEditor')
                            }, {
                                value: 'com.qpp.cgp.domain.product.config.view.builder.config.v3.PhotoEditorConfig',
                                display: i18n.getKey('PhotoEditor')
                            }]
                        }),
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                var form = combo.ownerCt;
                                form.suspendLayouts();//挂起布局
                                for (var i = 0; i < form.items.items.length; i++) {
                                    var item = form.items.items[i];
                                    if (Ext.Array.contains(combo.mapping['common'], item.getItemId())) {
                                    } else if (Ext.Array.contains(combo.mapping[newValue], item.getItemId())) {
                                        item.show();
                                        item.setDisabled(false);
                                    } else {
                                        item.hide();
                                        item.setDisabled(true);
                                    }
                                }
                                form.resumeLayouts();//恢复布局
                                form.doLayout();
                            }
                        }
                    },

                    {
                        xtype: 'textfield',
                        name: 'elementClazz',
                        itemId: 'elementClazz',
                        tipInfo: '通过元素样式,筛选触发该组件的元素',
                        fieldLabel: i18n.getKey('目标元素类型'),
                    },
                    {
                        xtype: 'textfield',
                        name: 'elementTag',
                        itemId: 'elementTag',
                        tipInfo: '通过元素标签,筛选触发该组件的元素',
                        fieldLabel: i18n.getKey('目标元素标签'),
                    },
                    {
                        xtype: 'numberfield',
                        name: 'sizeMin',
                        itemId: 'sizeMin',
                        hidden: true,
                        disabled: true,
                        fieldLabel: i18n.getKey('字体大小最小值'),
                    },
                    {
                        xtype: 'numberfield',
                        name: 'sizeMax',
                        itemId: 'sizeMax',
                        hidden: true,
                        disabled: true,
                        fieldLabel: i18n.getKey('字体大小最大值'),
                    },
                    {
                        xtype: 'checkbox',
                        name: 'showRotation',
                        colspan: 1,
                        width: 250,
                        checked: true,
                        itemId: 'showRotation',
                        fieldLabel: i18n.getKey('启用旋转'),
                    },
                    {
                        xtype: 'checkbox',
                        fieldLabel: i18n.getKey('启用缩放'),
                        itemId: 'showZoom',
                        colspan: 1,
                        width: 250,
                        checked: true,
                        name: 'showZoom',
                    },
                    {
                        xtype: 'checkbox',
                        fieldLabel: i18n.getKey('启用翻转'),
                        itemId: 'showFlip',
                        colspan: 1,
                        width: 250,
                        checked: true,
                        name: 'showFlip',
                    },
                    {
                        xtype: 'checkbox',
                        fieldLabel: i18n.getKey('启用明亮度'),
                        itemId: 'showBrightness',
                        colspan: 1,
                        width: 250,
                        checked: true,
                        name: 'showBrightness',
                        listeners: {
                            change: function (checkbox, newValue, oldValue) {
                                var brightnessMin = checkbox.ownerCt.getComponent('brightnessMin');
                                var brightnessMax = checkbox.ownerCt.getComponent('brightnessMax');
                                if (newValue == true) {
                                    brightnessMin.show();
                                    brightnessMin.setDisabled(false);
                                    brightnessMax.show();
                                    brightnessMax.setDisabled(false);
                                } else {
                                    brightnessMin.hide();
                                    brightnessMin.setDisabled(true);
                                    brightnessMax.hide();
                                    brightnessMax.setDisabled(true);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('明亮度最小值'),
                        itemId: 'brightnessMin',
                        name: 'brightnessMin',
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('明亮度最大值'),
                        itemId: 'brightnessMax',
                        name: 'brightnessMax',
                    },
                    {
                        xtype: 'gridfieldwithcrudv2',
                        fieldLabel: i18n.getKey('滤镜'),
                        itemId: 'filters',
                        name: 'filters',
                        height: 200,
                        width: 650,
                        colspan: 2,
                        winConfig: {
                            formConfig: {
                                width: 500,
                                defaults: {
                                    width: 450
                                },
                                items: [
                                    {
                                        xtype: 'multilanguagefield',
                                        fieldLabel: i18n.getKey('displayNameKey'),
                                        itemId: 'displayNameKey',
                                        name: 'displayNameKey',
                                    },
                                    {
                                        xtype: 'gridcombo',
                                        fieldLabel: i18n.getKey('colorCode'),
                                        itemId: 'colorCode',
                                        name: 'colorCode',
                                        valueField: 'displayCode',
                                        displayField: 'displayCode',
                                        store: colorStore,
                                        editable: true,
                                        allowBlank: true,
                                        matchFieldWidth: false,
                                        filterCfg: {
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
                                                }, {
                                                    name: 'colorName',
                                                    xtype: 'textfield',
                                                    hideTrigger: true,
                                                    isLike: false,
                                                    margin: 0,
                                                    allowBlank: true,
                                                    allowDecimals: false,
                                                    fieldLabel: i18n.getKey('color') + i18n.getKey('name'),
                                                    itemId: 'colorName'
                                                }
                                            ]
                                        },
                                        gridCfg: {
                                            height: 450,
                                            width: 650,
                                            columns: [
                                                {
                                                    text: i18n.getKey('id'),
                                                    dataIndex: '_id',
                                                    itemId: '_id',
                                                },
                                                {
                                                    text: i18n.getKey('color') + i18n.getKey('name'),
                                                    dataIndex: 'colorName',
                                                    itemId: 'colorName',
                                                    width: 110,
                                                },
                                                {
                                                    text: i18n.getKey('color') + i18n.getKey('code') + '(16进制)',
                                                    dataIndex: 'displayCode',
                                                    itemId: 'displayCode',
                                                    width: 150,
                                                },
                                                {
                                                    text: i18n.getKey('显示颜色'),
                                                    itemId: 'color',
                                                    dataIndex: 'color',
                                                    flex: 1,
                                                    minWidth: 100
                                                }
                                            ],
                                            bbar: {
                                                xtype: 'pagingtoolbar',
                                                store: colorStore,
                                                displayInfo: true,
                                                displayMsg: '',
                                                emptyMsg: i18n.getKey('noData')
                                            }
                                        },
                                        diySetValue: function (data) {
                                            var me = this;
                                            if (data) {
                                                me.setValue({displayCode: data})
                                            } else {
                                                me.setValue(null);
                                            }
                                        },
                                        diyGetValue: function () {
                                            var me = this;
                                            var id = me.getSubmitValue()[0];
                                            if (id) {
                                                return id;
                                            } else {
                                                return null;
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('parameter'),
                                        itemId: 'parameter',
                                        name: 'parameter',
                                    }
                                ],
                            },
                        },
                        triggerAction: 'author',
                        gridConfig: {
                            autoScroll: true,
                            viewConfig: {
                                autoScroll: true,
                            },
                            store: Ext.create('Ext.data.Store', {
                                autoSync: true,
                                fields: [
                                    {name: 'parameter', type: 'string'},
                                    {name: 'colorSource', type: 'object'},
                                    {name: 'displayNameKey', type: 'string'},
                                    {name: 'colorCode', type: 'string'}
                                ],
                                data: [
                                    {
                                        colorCode: null,
                                        parameter: null,
                                        displayNameKey: "NO_EFFECT"
                                    },
                                    {
                                        colorCode: "95AFD4",
                                        parameter: "colorFilter=95AFD4",
                                        displayNameKey: "BLUE"
                                    },
                                    {
                                        colorCode: "CA7A7D",
                                        parameter: "colorFilter=CA7A7D",
                                        displayNameKey: "RED"
                                    },
                                    {
                                        colorCode: "94AF7A",
                                        parameter: "colorFilter=94AF7A",
                                        displayNameKey: "GREEN"
                                    },
                                    {
                                        colorCode: "CA7AAF",
                                        parameter: "colorFilter=CA7AAF",
                                        displayNameKey: "PINK"
                                    },
                                    {
                                        colorCode: "BE947B",
                                        parameter: "colorFilter=BE947B",
                                        displayNameKey: "SEPIA"
                                    },
                                    {
                                        colorCode: "000000",
                                        parameter: "gray",
                                        displayNameKey: "BLACK_WHITE"
                                    }
                                ]
                            }),
                            columns: [
                                {
                                    text: i18n.getKey('parameter'),
                                    dataIndex: 'parameter',
                                    width: 150,
                                },
                                {
                                    text: i18n.getKey('displayNameKey'),
                                    dataIndex: 'displayNameKey',
                                    width: 150,
                                },
                                {
                                    text: i18n.getKey('colorCode'),
                                    dataIndex: 'colorCode',
                                    width: 150,
                                },
                            ]
                        },

                    }
                ]
            },
        }
        me.callParent();
    }
})