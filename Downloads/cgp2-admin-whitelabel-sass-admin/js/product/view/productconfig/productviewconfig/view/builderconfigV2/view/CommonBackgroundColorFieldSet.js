/**
 * Created by nan on 2020/11/12
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.CommonBackgroundColorFieldSet', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.commonbackgroundcolorfieldset',
    legendItemConfig: {
        disabledBtn: {
            hidden: false,
            disabled: false,
            isUsable: false,//初始化时，是否是禁用
        }
    },
    initComponent: function () {
        var me = this;
        var localColorStore = Ext.create('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.store.LocalColorStore', {
            data: []
        });
        me.items = [
            {
                xtype: 'combo',
                name: 'resourceConfigType',
                itemId: 'resourceConfigType',
                valueField: 'value',
                displayField: 'display',
                editable: false,
                allowBlank: true,
                haveReset: true,
                fieldLabel: i18n.getKey('resourceConfigType'),
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: 'Replace',
                            display: i18n.getKey('replace')
                        },
                        {
                            value: 'Expand',
                            display: i18n.getKey('extension')
                        },
                        {
                            value: 'Exclude',
                            display: i18n.getKey('exclude')
                        }
                    ]
                }),
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var me = this;
                        var colors = me.ownerCt.getComponent('colors');
                        //replace可以选择所有字体
                        if (newValue == 'Replace') {
                            colors.searchGridCfg.gridCfg.storeCfg.proxy = {
                                type: 'uxrest',
                                url: adminPath + 'api/colors',
                                reader: {
                                    type: 'json',
                                    root: 'data.content'
                                }
                            }
                        } else if (newValue == 'Expand') {
                            //只能选择未添加的字体
                            colors.searchGridCfg.gridCfg.storeCfg.proxy = {
                                type: 'uxrest',
                                url: adminPath + 'api/commonbuilderresourceconfigs/V2/remain/backgroundColors',
                                reader: {
                                    type: 'json',
                                    root: 'data.content'
                                }
                            }
                        } else if (newValue == 'Exclude') {
                            //只能选择已经添加的字体
                            colors.searchGridCfg.gridCfg.storeCfg.proxy = {
                                type: 'uxrest',
                                url: adminPath + 'api/commonbuilderresourceconfigs/V2/backgroundColors',
                                reader: {
                                    type: 'json',
                                    root: 'data.content'
                                }
                            }
                        }
                        var isDisabled = true;
                        if (newValue) {
                            isDisabled = false;
                            if (Ext.isEmpty(oldValue)) {
                                //第一次的赋值不需要处理

                            } else {
                                colors._grid.store.proxy.data = [];
                                colors._grid.store.load();
                            }
                        } else {
                            isDisabled = true;
                            colors._grid.store.proxy.data = [];
                            colors._grid.store.load();
                        }

                        if (colors.rendered == false) {
                            colors.on('afterrender', function () {
                                colors.setDisabled(isDisabled);
                            });
                        } else {
                            colors.setDisabled(isDisabled);
                        }
                    }
                }
            },
            {
                xtype: 'gridfieldhascomplementarydata',
                name: 'colors',
                itemId: 'colors',
                allowBlank: true,
                fieldLabel: i18n.getKey('color'),
                width: '100%',
                autoScroll: true,
                disabled: true,
                maxHeight: 350,
                dataWindowCfg: {
                    width: 950
                },
                searchGridCfg: {
                    gridCfg: {
                        editAction: false,
                        deleteAction: false,
                        storeCfg: {//配置store的所有参数，只是把创建store推后到新建弹窗时
                            clazz: 'CGP.color.store.ColorStore'
                        },
                    },
                    filterCfg: {
                        header: false,
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
                            name: 'description',
                            xtype: 'textfield',
                            isLike: false,
                            fieldLabel: i18n.getKey('description'),
                            itemId: 'description'
                        }, {
                            name: 'clazz',
                            xtype: 'combo',
                            isLike: false,
                            fieldLabel: i18n.getKey('type'),
                            itemId: 'clazz',
                            editable: false,
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
                },
                gridConfig: {
                    width: 545,
                    autoScroll: true,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    store: localColorStore,
                    bbar: {//底端的分页栏
                        xtype: 'pagingtoolbar',
                        store: localColorStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
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
                            width: 100,
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
            }
        ];
        me.callParent();
    }
})