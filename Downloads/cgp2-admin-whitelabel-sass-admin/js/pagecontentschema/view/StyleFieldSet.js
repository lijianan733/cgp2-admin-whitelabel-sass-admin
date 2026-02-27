/**
 * Created by nan on 2021/5/19
 */
Ext.define("CGP.pagecontentschema.view.StyleFieldSet", {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.stylefieldset',
    defaults: {
        allowBlank: true,
        width: '100%'
    },
    initComponent: function () {
        var me = this;
        var colorStore = Ext.data.StoreManager.get('colorStore') || Ext.create('CGP.color.store.ColorStore', {
            model: 'CGP.pagecontentschema.view.pagecontentitemplaceholders.model.ColorModel',
            params: {
                filter: Ext.JSON.encode([{
                    name: 'clazz',
                    type: 'string',
                    value: 'com.qpp.cgp.domain.common.color.RgbColor'
                }])
            }
        });
        var fontStore = Ext.data.StoreManager.get('fontStore') || Ext.create('CGP.font.store.FontStore', {
            storeId: 'fontStore'
        });
        me.items = [
            {
                xtype: 'gridcombo',
                name: 'fontFamily',
                itemId: 'fontFamily',
                editable: false,
                fieldLabel: i18n.getKey('font'),
                displayField: 'fontFamily',
                valueField: 'fontFamily',
                msgTarget: 'side',
                store: fontStore,
                matchFieldWidth: true,
                filterCfg: {
                    height: 80,
                    layout: {
                        type: 'column',
                        columns: 1
                    },
                    fieldDefaults: {
                        labelAlign: 'right',
                        layout: 'anchor',
                        style: 'margin-right:20px; margin-top : 5px;',
                        width: 350
                    },
                    items: [
                        {
                            name: 'fontFamily',
                            xtype: 'textfield',
                            hideTrigger: true,
                            fieldLabel: i18n.getKey('fontFamily'),
                            itemId: 'fontFamily'
                        }
                    ]
                },
                gridCfg: {
                    height: 350,
                    columns: [{
                        text: i18n.getKey('fontFamily'),
                        dataIndex: 'fontFamily',
                        flex: 1,
                    }],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: fontStore,
                        displayInfo: false,
                    })
                },
                diySetValue: function (data) {
                    var me = this;
                    me.setValue({
                        fontFamily: data
                    });
                },
                diyGetValue: function () {
                    var me = this;
                    return me.getRawValue();
                }
            },
            {
                xtype: 'gridcombo',
                name: 'color',
                itemId: 'color',
                fieldLabel: i18n.getKey('color') + '(十进制值)',
                valueField: 'displayCode2',
                displayField: 'displayCode2',
                store: colorStore,
                matchFieldWidth: false,
                haveReset: true,
                filterCfg: {
                    height: 80,
                    layout: {
                        type: 'column',
                        columns: 3
                    },
                    items: [
                        {
                            name: '_id',
                            xtype: 'textfield',
                            hideTrigger: true,
                            isLike: false,
                            allowDecimals: false,
                            width: 250,
                            fieldLabel: i18n.getKey('id'),
                            itemId: '_id'
                        }, {
                            name: 'colorName',
                            xtype: 'textfield',
                            hideTrigger: true,
                            isLike: false,
                            margin: 0,
                            width: 250,
                            allowDecimals: false,
                            fieldLabel: i18n.getKey('color') + i18n.getKey('name'),
                            itemId: 'colorName'
                        },
                        {
                            name: 'displayCode',
                            xtype: 'textfield',
                            isLike: false,
                            width: 250,
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
                        }
                    ]
                },
                autoQuery: false,
                gridCfg: {
                    width: 800,
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
                        },
                        {
                            text: i18n.getKey('color') + i18n.getKey('code') + '(16进制)',
                            dataIndex: 'displayCode',
                            itemId: 'displayCode',
                            width: 150,
                        },
                        {
                            text: i18n.getKey('color') + i18n.getKey('code') + '(10进制)',
                            dataIndex: 'displayCode2',
                            itemId: 'displayCode2',
                            width: 150,
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
                            minWidth: 100,
                            flex: 1,
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: colorStore,
                        displayInfo: true,
                        displayMsg: '',
                        emptyMsg: i18n.getKey('noData')
                    })
                },
                editable: true,
                autoSelect: false,
                forceSelection: false,
                queryParam: '',
                queryMode: 'local',
                tipInfo: '输入的数据为十进制的颜色值',
                diySetValue: function (data) {
                    var me = this;
                    me.setValue({
                        displayCode2: data
                    });
                },
                diyGetValue: function () {
                    var me = this;
                    var data=me.getRawValue();
                    if(Ext.isEmpty(data)){
                        return null;
                    }else{
                        return data;

                    }
                }
            },
            {
                xtype: 'textfield',
                name: 'fontSize',
                itemId: 'fontSize',
                minValue: 0,
                fieldLabel: i18n.getKey('fontSize')
            },
            {
                xtype: 'combo',
                name: 'fontStyle',
                itemId: 'fontStyle',
                editable: false,
                fieldLabel: i18n.getKey('fontStyle'),
                valueField: 'value',
                displayField: 'display',
                haveReset: true,
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'normal',
                            display: i18n.getKey('normal (浏览器会显示一个标准的字体样式)')
                        },
                        {
                            value: 'italic',
                            display: i18n.getKey('italic (浏览器会显示一个斜体的字体样式)')
                        },
                        {
                            value: 'oblique',
                            display: i18n.getKey('oblique (浏览器会显示一个倾斜的字体样式)')
                        },
                    ]
                })
            },
            {
                xtype: 'combo',
                name: 'textDecoration',
                itemId: 'textDecoration',
                fieldLabel: i18n.getKey('font') + i18n.getKey('embellishment'),
                valueField: 'value',
                displayField: 'display',
                haveReset: true,
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'none',
                            display: i18n.getKey('none (标准文本)')
                        },
                        {
                            value: 'underline',
                            display: i18n.getKey('underline (带下划线的文本)')
                        },
                        {
                            value: 'overline',
                            display: i18n.getKey('overline (上方带一直线的文本)')
                        },
                        {
                            value: 'line-through',
                            display: i18n.getKey('line-through (中间穿过一直线的文本)')
                        },
                        {
                            value: 'blink',
                            display: i18n.getKey('blink (闪烁的文本)')
                        },
                    ]
                })
            },
            {
                xtype: 'combo',
                name: 'weight',
                itemId: 'weight',
                fieldLabel: i18n.getKey('font-weight'),
                valueField: 'value',
                displayField: 'display',
                haveReset: true,
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'normal',
                            display: i18n.getKey('normal (标准的字符)')
                        },
                        {
                            value: 'bold',
                            display: i18n.getKey('bold (粗体字符)')
                        },
                        {
                            value: 'bolder',
                            display: i18n.getKey('bolder (更粗的字符)')
                        },
                        {
                            value: 'lighter',
                            display: i18n.getKey('lighter (更细的字符)')
                        },
                    ]
                })
            },
            {
                xtype: 'combo',
                name: 'writingMode',
                itemId: 'writingMode',
                fieldLabel: i18n.getKey('文本方向'),
                valueField: 'value',
                displayField: 'display',
                haveReset: true,
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'horizontal-tb',
                            display: i18n.getKey('horizontal (水平方向内容自上而下)')
                        },
                        {
                            value: 'vertical-rl',
                            display: i18n.getKey('vertical-rl (垂直方向内容自右到左)')
                        },
                        {
                            value: 'vertical-lr',
                            display: i18n.getKey('vertical-lr (垂直方向内容从上到下，水平方向从左到右)')
                        }
                    ]
                })

            },
            {
                xtype: 'gridcombo',
                name: 'colorSource',
                itemId: 'colorSource',
                fieldLabel: i18n.getKey('colorSource'),
                valueField: '_id',
                displayField: 'displayCode',
                store: colorStore,
                matchFieldWidth: false,
                haveReset: true,
                autoQuery: false,
                editable: false,
                autoSelect: false,
                forceSelection: false,
                queryMode: 'local',
                filterCfg: {
                    height: 80,
                    layout: {
                        type: 'column',
                        columns: 3
                    },
                    items: [
                        {
                            name: '_id',
                            xtype: 'textfield',
                            hideTrigger: true,
                            isLike: false,
                            allowDecimals: false,
                            width: 250,
                            fieldLabel: i18n.getKey('id'),
                            itemId: '_id'
                        }, {
                            name: 'colorName',
                            xtype: 'textfield',
                            hideTrigger: true,
                            isLike: false,
                            margin: 0,
                            width: 250,
                            allowDecimals: false,
                            fieldLabel: i18n.getKey('color') + i18n.getKey('name'),
                            itemId: 'colorName'
                        },
                        {
                            name: 'displayCode',
                            xtype: 'textfield',
                            isLike: false,
                            width: 250,
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
                        }
                    ]
                },
                gridCfg: {
                    width: 800,
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
                        },
                        {
                            text: i18n.getKey('color') + i18n.getKey('code') + '(16进制)',
                            dataIndex: 'displayCode',
                            itemId: 'displayCode',
                            width: 150,
                        },
                        {
                            text: i18n.getKey('color') + i18n.getKey('code') + '(10进制)',
                            dataIndex: 'displayCode2',
                            itemId: 'displayCode2',
                            width: 150,
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
                            minWidth: 100,
                            flex: 1,
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: colorStore,
                        displayInfo: true,
                        displayMsg: '',
                        emptyMsg: i18n.getKey('noData')
                    })
                },
                diyGetValue: function () {
                    var me = this;
                    var data = me.getArrayValue();
                    //去除多余的数据
                    if (data) {
                        delete data.color;
                    }
                    console.log(data);
                    return data;
                }
            },
        ];
        me.callParent();
    },
    diyGetValue: function () {
        //这里的color字段不是必填的
        var me = this;
        var data = me.getValue();
        if (data && Ext.isEmpty(data.color)) {
            delete data.color;
        }
        return data;
    }
})