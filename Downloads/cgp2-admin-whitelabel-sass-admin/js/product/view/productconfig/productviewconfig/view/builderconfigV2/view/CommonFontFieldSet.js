/**
 * Created by nan on 2020/11/5
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.CommonFontFieldSet', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.commonfontfieldset',
    legendItemConfig: {
        disabledBtn: {
            hidden: false,
            disabled: false,
            isUsable: false,//初始化时，是否是禁用
        }
    },
    initComponent: function () {
        var me = this;
        var fontUsePutStore = Ext.create('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.store.FontUsePutStore', {
            params: {
                ids: '[' + ']',
                resourceConfigType: 'Replace'
            }
        });
        var localStore = Ext.create('Ext.data.Store', {
            autoSync: true,
            fields: [
                {
                    name: '_id',
                    type: 'string'
                }, {
                    name: 'fontFamily',
                    type: 'string'
                }, {
                    name: 'displayName',
                    type: 'string'
                }, {
                    name: 'wordRegExp',
                    type: 'string'
                }, {
                    name: 'fontStyleKeys',
                    type: 'array',
                    serialize: function (value) {
                        if (Ext.isEmpty(value)) {
                            return [];
                        }
                        return value;
                    }
                },
                {
                    name: 'languages',
                    type: 'array',
                    serialize: function (value) {
                        if (Ext.isEmpty(value)) {
                            return [];
                        }
                        return value;
                    }
                }, {
                    name: 'clazz',
                    type: 'string',
                    defaultValue: 'com.qpp.cgp.domain.common.font.Font'
                }
            ],
            proxy: {
                type: 'pagingmemory'
            },
            data: []
        });
        me.items = [
            {
                xtype: 'combo',
                name: 'resourceConfigType',
                itemId: 'resourceConfigType',
                valueField: 'value',
                displayField: 'display',
                haveReset: true,
                editable: false,
                allowBlank: true,
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
                        var supportFonts = me.ownerCt.getComponent('supportFonts');
                        //replace可以选择所有字体
                        var defaultFont = me.ownerCt.getComponent('defaultFont');
                        if (newValue == 'Replace') {
                            supportFonts.searchGridCfg.gridCfg.storeCfg.proxy = {
                                type: 'uxrest',
                                url: adminPath + 'api/font',
                                reader: {
                                    type: 'json',
                                    root: 'data.content'
                                }
                            }
                        } else if (newValue == 'Expand') {
                            //只能选择未添加的字体
                            supportFonts.searchGridCfg.gridCfg.storeCfg.proxy = {
                                type: 'uxrest',
                                url: adminPath + 'api/commonbuilderresourceconfigs/V2/remain/fonts',
                                reader: {
                                    type: 'json',
                                    root: 'data.content'
                                }
                            }
                        } else if (newValue == 'Exclude') {
                            //只能选择已经添加的字体
                            supportFonts.searchGridCfg.gridCfg.storeCfg.proxy = {
                                type: 'uxrest',
                                url: adminPath + 'api/commonbuilderresourceconfigs/V2/fonts',
                                reader: {
                                    type: 'json',
                                    root: 'data.content'
                                }
                            }
                        }
                        var isDisabled = false;
                        if (newValue) {
                            isDisabled = false;
                            if (Ext.isEmpty(oldValue)) {
                                //第一次的赋值不需要处理

                            } else {
                                supportFonts._grid.store.proxy.data = [];
                                supportFonts._grid.store.load();
                            }
                        } else {
                            supportFonts._grid.store.proxy.data = [];
                            supportFonts._grid.store.load();
                            isDisabled = true;
                        }
                        if (supportFonts.rendered == false) {
                            supportFonts.on('afterrender', function () {
                                supportFonts.setDisabled(isDisabled);
                            });
                        } else {
                            supportFonts.setDisabled(isDisabled);
                        }
                        //清空默认字体数据
                        defaultFont.reset();
                    }
                }
            },
            {
                xtype: 'gridfieldhascomplementarydata',
                name: 'supportFonts',
                itemId: 'supportFonts',
                allowBlank: true,
                fieldLabel: i18n.getKey('optional') + i18n.getKey('font'),
                width: '100%',
                autoScroll: true,
                disabled: true,
                valueSource: 'storeProxy',
                /**
                 * 历史疑难问题，没救
                 */
                diyGetValue: function () {
                    var me = this;
                    var data = me.getSubmitValue();
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        delete item.languages;
                    }
                    return data;
                },
                maxHeight: 350,
                minHeight: 100,
                winTitle: i18n.getKey('optional') + i18n.getKey('font'),
                dataWindowCfg: {
                    width: 950
                },
                searchGridCfg: {
                    gridCfg: {
                        editAction: false,
                        deleteAction: false,
                        storeCfg: {//配置store的所有参数，只是把创建store推后到新建弹窗时
                            clazz: 'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.store.FontStore',
                        },
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 90,
                                dataIndex: '_id',
                                itemId: 'id',
                                isLike: false,
                                sortable: true,
                            },
                            {
                                text: i18n.getKey('fontFamily'),
                                dataIndex: 'fontFamily',
                                width: 150,
                                itemId: 'fontFamily'
                            },
                            {
                                text: i18n.getKey('displayName'),
                                dataIndex: 'displayName',
                                width: 150,
                                flex: 1,
                                itemId: 'displayName'
                            },
                            {
                                text: i18n.getKey('language'),
                                dataIndex: 'languages',
                                itemId: 'language',
                                flex: 1,
                                renderer: function (value, mate, record) {
                                    return value.toString();
                                }
                            }
                        ],

                    },
                    filterCfg: {
                        header: false,
                        items: [
                            {
                                id: 'idSearchField',
                                name: '_id',
                                xtype: 'textfield',
                                isLike: false,
                                fieldLabel: i18n.getKey('id'),
                                itemId: 'id'
                            },
                            {
                                id: 'nameSearchField',
                                name: 'fontFamily',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('fontFamily'),
                                itemId: 'fontFamily'
                            },
                            {
                                id: 'displaynameSearchField',
                                name: 'displayName',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('displayName'),
                                itemId: 'displayName'
                            },
                            {
                                name: 'languages',
                                xtype: 'combo',
                                fieldLabel: i18n.getKey('language'),
                                itemId: 'language',
                                editable: false,
                                isLike: false,
                                valueField: 'id',
                                displayField: 'name',
                                store: Ext.create('CGP.common.store.Language')
                            }
                        ]
                    }
                },
                gridConfig: {
                    autoScroll: true,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    store: localStore,
                    bbar: {//底端的分页栏
                        xtype: 'pagingtoolbar',
                        store: localStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    },
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 90,
                            dataIndex: '_id',
                            itemId: 'id',
                            isLike: false,
                            sortable: true,
                        },
                        {
                            text: i18n.getKey('fontFamily'),
                            dataIndex: 'fontFamily',
                            flex: 1,
                            itemId: 'fontFamily'
                        },
                        {
                            text: i18n.getKey('displayName'),
                            dataIndex: 'displayName',
                            width: 150,
                            flex: 1,
                            itemId: 'displayName'
                        }
                    ]
                },
            },
            {
                xtype: 'gridcombo',
                colspan: 2,
                fieldLabel: i18n.getKey('default') + i18n.getKey('font'),
                allowBlank: true,
                valueField: '_id',
                displayField: 'displayName',
                itemId: 'defaultFont',
                store: fontUsePutStore,
                editable: false,
                haveReset: true,
                name: 'defaultFont',
                matchFieldWidth: false,
                diyGetValue: function () {
                    var me = this;
                    var data = me.getArrayValue();
                    if (data) {
                        delete data.languages;
                        return data;
                    }
                },
                filterCfg: {
                    height: 80,
                    layout: {
                        type: 'column',
                        columns: 3
                    },
                    fieldDefaults: {
                        width: 200,
                        labelAlign: 'right',
                        layout: 'anchor',
                        style: 'margin-right:20px; margin-top : 5px;',
                        labelWidth: 60,
                    },
                    items: [
                        {
                            name: '_id',
                            xtype: 'textfield',
                            isLike: false,
                            fieldLabel: i18n.getKey('id'),
                            itemId: 'id'
                        },
                        {
                            name: 'fontFamily',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('fontFamily'),
                            itemId: 'fontFamily'
                        },
                        {
                            name: 'displayName',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('displayName'),
                            itemId: 'displayName'
                        }, {
                            name: 'languages',
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('language'),
                            itemId: 'language',
                            editable: false,
                            isLike: false,
                            valueField: 'id',
                            displayField: 'name',
                            store: Ext.create('CGP.common.store.Language')
                        }
                    ]
                },
                listeners: {
                    //获取到可以使用的字体，一层层地找
                    expand: function (gridField) {
                        //当没有需要进一步规定可选字体时，使用expand，然后font为[]来获取可用字体,
                        //如果这层没配置，如果配置了builder公用资源，使用公用资源的
                        var fieldSet = gridField.ownerCt;
                        var productCommonFontsFieldSet = Ext.getCmp('productCommonFonts');
                        var productCommonFontsData = productCommonFontsFieldSet.getValue();
                        var resourceConfigType = fieldSet.getComponent('resourceConfigType').getValue();
                        var supportFonts = fieldSet.getComponent('supportFonts').getSubmitValue();
                        if (supportFonts.length == 0) {//没配置builder层的数据
                            resourceConfigType = productCommonFontsData.resourceConfigType;
                            supportFonts = productCommonFontsData.supportFonts || [];
                        }
                        supportFonts = supportFonts.map(function (item) {
                            return item._id;
                        })
                        if (resourceConfigType && supportFonts.length > 0) {
                            gridField.picker.store.proxy.extraParams = {
                                ids: '[' + supportFonts.toString() + ']',
                                resourceConfigType: resourceConfigType
                            };
                            gridField.picker.store.load();
                        }
                    }
                },
                gridCfg: {
                    height: 450,
                    width: 700,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 90,
                            dataIndex: '_id',
                            itemId: 'id',
                            isLike: false,
                            sortable: true,
                        },
                        {
                            text: i18n.getKey('fontFamily'),
                            dataIndex: 'fontFamily',
                            width: 100,
                            itemId: 'fontFamily'
                        },
                        {
                            text: i18n.getKey('displayName'),
                            dataIndex: 'displayName',
                            flex: 1,
                            itemId: 'displayName'
                        },
                        {
                            text: i18n.getKey('language'),
                            dataIndex: 'languages',
                            itemId: 'language',
                            flex: 1,
                            renderer: function (value, mate, record) {
                                return value.toString();
                            }
                        }
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: fontUsePutStore,
                        displayInfo: true,
                        displayMsg: '',
                        emptyMsg: i18n.getKey('noData')
                    }
                }
            }];
        me.callParent();
    }
})