Ext.define('CGP.product.view.productconfig.productviewconfig.view.EditBuilderConfig', {
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',

    initComponent: function () {
        var me = this;
        me.title = i18n.getKey(me.editOrNew) + i18n.getKey('builderLocation');
        var languageStore = Ext.create('CGP.language.store.LanguageStore', {
            autoLoad: false
        });
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var productId = builderConfigTab.productId;
        var isLock = JSCheckProductIsLock(productId);
        var builderFontLocal = Ext.create("CGP.product.view.productconfig.productviewconfig.store.BuilderFontLocal"/*,{
            listeners: {
                datachanged: function(thisStore) {
                    if(thisStore.data.length <= 0){
                        var defaultFont = me.down('form').getComponent('defaultFont');
                        defaultFont.setValue('');
                        defaultFont.allowBlank = true;
                        defaultFont.setFieldLabel(i18n.getKey('defaultFont'));
                    }
                }
            }
        }*/);
        me.items = [
            {
                xtype: 'form',
                border: false,
                header: false,
                width: 720,
                padding: 10,
                height: 500,
                defaults: {
                    width: 500
                },
                listeners: {
                    afterrender: function (comp) {
                        var items = comp.items.items;
                        var data = me.record.data;
                        var DTO = me.record.raw.DTO;
                        Ext.each(items, function (item) {
                            if (item.name == 'fonts') {
                                if (DTO) {
                                    item.setSubmitValue(DTO['fonts'])
                                }
                            } else if (item.name == 'language') {
                                if (data['language']) {
                                    item.setInitialValue([data['language'].id])
                                }
                            } else {
                                item.setValue(data[item.name]);
                            }

                        });
                        comp.insert(8, {
                            xtype: 'combo',
                            displayField: 'name',
                            valueField: '_id',
                            editable: false,
                            name: 'defaultFont',
                            queryMode: 'local',
                            itemId: 'defaultFont',
                            allowBlank: true,
                            haveReset: true,
                            value: data['defaultFont'],
                            fieldLabel: i18n.getKey('default') + i18n.getKey('font'),
                            //allowBlank: Ext.isEmpty(Ext.getCmp('builder-fonts')._grid.getStore().data.items),
                            store: Ext.getCmp('builder-fonts')._grid.getStore()
                        })
                    }
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('title'),
                        name: 'title',
                        itemId: 'title'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('locale'),
                        name: 'locale',
                        hidden: true,
                        allowBlank: true,
                        itemId: 'locale'
                    },
                    {
                        fieldLabel: i18n.getKey('language'),
                        name: 'language',
                        allowBlank: false,
                        itemId: 'language',
                        xtype: 'gridcombo',
                        multiSelect: false,
                        displayField: 'displayField',
                        valueField: 'id',
                        editable: false,
                        store: languageStore,
                        matchFieldWidth: false,
                        gridCfg: {
                            height: 280,
                            width: 500,
                            viewConfig: {
                                enableTextSelection: true
                            },
                            columns: [{
                                text: i18n.getKey('id'),
                                dataIndex: 'id',
                                xtype: 'gridcolumn',
                                itemId: 'id',
                                sortable: true
                            }, {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                xtype: 'gridcolumn',
                                itemId: 'name',
                                sortable: true
                            }, {
                                text: i18n.getKey('code'),
                                dataIndex: 'code',
                                xtype: 'gridcolumn',
                                flex: 1,
                                itemId: 'code',
                                sortable: true,
                                renderer: function (v) {
                                    return v.code;
                                }
                            }, {
                                text: i18n.getKey('locale'),
                                dataIndex: 'locale',
                                xtype: 'gridcolumn',
                                itemId: 'locale',
                                sortable: true,
                                renderer: function (v) {
                                    if (v) {
                                        return v.name + '(' + v.code + ')';
                                    }
                                }
                            }],
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: languageStore,
                                displayInfo: true, // 是否 ? 示， 分 ? 信息
                                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                emptyMsg: i18n.getKey('noData')
                            })
                        }
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('sortOrder'),
                        name: 'sortOrder',
                        itemId: 'sortOrder',
                        minValue: 0
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('builderUrl'),
                        name: 'builderUrl',
                        itemId: 'builderUrl'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('clazz'),
                        name: 'clazz',
                        hidden: true,
                        itemId: 'clazz',
                        value: 'com.qpp.cgp.domain.product.config.LocaleBuilderLocationConfig'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('userPreviewUrl'),
                        name: 'userPreviewUrl',
                        itemId: 'userPreviewUrl'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('manufacturePreviewUrl'),
                        name: 'manufacturePreviewUrl',
                        itemId: 'manufacturePreviewUrl'
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('status'),
                        name: 'builderPublishStatus',
                        allowBlank: false,
                        defaultValue: 'UNCHANGED_NOTPUBLISH',
                        itemId: 'builderPublishStatus',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                {
                                    name: 'name', type: 'string'
                                },
                                {
                                    name: 'value', type: 'string'
                                }
                            ],
                            data: [
                                {
                                    name: '未更改，不发布',
                                    value: 'UNCHANGED_NOTPUBLISH'
                                },
                                {
                                    name: '版本已更改，需发布',
                                    value: 'VERSIONCHANGED_NEEDPUBLISH'
                                },
                                {
                                    value: 'VERSIONNOTCHANGED_NEEDPUBLISH',
                                    name: '版本未更改，需发布'

                                },
                                {
                                    name: '内容已更改，不发布',
                                    value: 'CONTENTCHANGED_NOTPUBLISH'
                                }
                            ]
                        }),
                        displayField: 'name',
                        valueField: 'value',
                        editable: false
                    },
                    {
                        name: 'fonts',
                        xtype: 'gridfield',
                        colspan: 2,
                        width: 700,
                        valueType: 'idRef',
                        /*
                                                valueType: 'idRef',
                        */
                        gridConfig: {
                            store: builderFontLocal,
                            maxHeight: 220,
                            width: '100%',
                            renderTo: 'builder-fonts-element',
                            columns: [
                                {
                                    xtype: 'actioncolumn',
                                    itemId: 'actioncolumn',
                                    width: 60,
                                    sortable: false,
                                    resizable: false,
                                    menuDisabled: true,
                                    items: [
                                        {
                                            iconCls: 'icon_remove icon_margin',
                                            itemId: 'actionremove',
                                            tooltip: 'Remove',
                                            handler: function (view, rowIndex, colIndex) {
                                                var store = view.getStore();
                                                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('确定删除？'), function (select) {
                                                    if (select == 'yes') {
                                                        store.removeAt(rowIndex);
                                                    }
                                                })
                                            }
                                        }
                                    ]
                                },
                                {
                                    text: i18n.getKey('id'),
                                    width: 90,
                                    dataIndex: '_id',
                                    itemId: 'id',
                                    isLike: false,
                                    sortable: true
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
                                    width: 165,
                                    itemId: 'displayName'
                                },
                                {
                                    text: i18n.getKey('language'),
                                    dataIndex: 'languages',
                                    itemId: 'language',
                                    width: 160,
                                    xtype: 'uxarraycolumnv2',
                                    sortable: false,
                                    maxLineCount: 5,
                                    lineNumber: 3,
                                    renderer: function (value, mate, record) {
                                        if (value) {
                                            if (value.locale) {
                                                return value.code.code + '-' + value.locale.code;
                                            } else {
                                                return value.code.code;
                                            }
                                        }
                                    }
                                }
                            ],
                            tbar: [
                                {
                                    text: i18n.getKey('add') + i18n.getKey('font'),
                                    iconCls: 'icon_create',
                                    handler: function () {
                                        var grid = this.ownerCt.ownerCt;
                                        var store = grid.getStore();
                                        var filterData = store.data.items;
                                        Ext.create('CGP.product.view.productconfig.productviewconfig.view.AddFontWindow', {
                                            filterData: filterData,
                                            store: store,
                                            grid: grid
                                        }).show();
                                    }
                                }
                            ]

                        },
                        fieldLabel: i18n.getKey('font'),
                        itemId: 'builder-fonts',
                        listeners: {
                            change: function (newValue, oldValue) {
                                console.log(newValue);
                                comsole.log(oldValue);
                            }
                        },
                        id: 'builder-fonts'
                    }
                ]
            }
        ];
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('confirm'),
            iconCls: 'icon_agree',
            disabled: isLock,
            handler: function () {
                var form = me.down('form');
                if (form.isValid()) {
                    Ext.Array.each(form.items.items, function (item) {
                        if (item.name == 'fonts') {
                            me.record.set(item.name, item.getSubmitValue());
                        } else if (item.name == 'language') {
                            me.record.set(item.name, item.getArrayValue());
                        }/*else if(item.name == 'defaultFont'){
                            me.record.set(item.name, item.getSubmitValue()[0]);
                        }*/ else {
                            console.log(item.getValue());
                            me.record.set(item.name, item.getValue());
                        }

                    });
                    if (me.editOrNew == 'new') {
                        me.store.add(me.record);
                    }

                    me.close();
                }
            }
        }, {
            xtype: 'button',
            iconCls: 'icon_cancel',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }];
        me.callParent(arguments);
    }
});
