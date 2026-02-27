//现在配置BuilderConfig默认使用的V2，故现在编辑的时候如果是有builderLocations，或者有fonts ，就显示这些配置允许编辑
//新建时直接隐藏掉fonts和builderLocations,配置defaultFont


Ext.Loader.syncRequire(["CGP.product.view.productconfig.productviewconfig.model.ProductViewCfgModel"]);
Ext.onReady(function () {


    //页面的url参数。如果id不为null。说明是编辑。
    var urlParams = Ext.Object.fromQueryString(location.search);
    var productViewCfgModel = null;
    if (urlParams.id != null) {
        productViewCfgModel = Ext.ModelManager.getModel("CGP.product.view.productconfig.productviewconfig.model.ProductViewCfgModel");
    }
    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var builderBomConfigStore = Ext.create('CGP.product.view.productconfig.productbomconfig.store.ProductBomConfigStore', {
        params: {
            filter: '[{"name":"productConfigId","value":' + builderConfigTab.productConfigId + ',"type":"number"}]'
        }
    });
    var store = Ext.create('CGP.product.view.productconfig.productviewconfig.store.ProductViewCfgStore', {
        params: {
            filter: '[{"name":"productConfigId","value":' + builderConfigTab.productConfigId + ',"type":"number"}]'
        }
    });
    var viewCompatibilities = Ext.create('CGP.product.view.productconfig.productviewconfig.store.Store', {
        params: {
            filter: '[{"name":"productConfigId","value":' + builderConfigTab.productConfigId + ',"type":"number"}]'
        }
    });
    var builderFontLocal = Ext.create("CGP.product.view.productconfig.productviewconfig.store.BuilderFontLocal");

    var status = {'0': '删除', '1': '草稿', '2': '测试', '3': '上线'};
    var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
    var editPage = Ext.create("Ext.container.Viewport", {
            autoScroll: true,
            layout: 'fit',
            items: [
                {
                    xtype: "form",
                    bodyStyle: 'padding:10px',
                    columnCount: 2,
                    fieldDefaults: {
                        labelAlign: 'right',
                        width: 380,
                        msgTarget: 'side',
                        validateOnChange: false,
                        plugins: [
                            {
                                ptype: 'uxvalidation'
                            }
                        ]
                    },
                    bodyPadding: 25,
                    region: 'center',
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    autoScroll: true,
                    defaults: {
                        width: 385
                    },
                    tbar: [
                        {
                            xtype: "button",
                            text: i18n.getKey('save'),
                            iconCls: 'icon_save',
                            handler: function () {
                                var form = this.ownerCt.ownerCt;
                                if (form.isValid()) {
                                    //利用productViewCfgModel来判断是修改还是新建
                                    var items = form.items.items;
                                    Ext.Array.each(form.items.items, function (item) {
                                        if (item.name == 'builderLocations') {
                                            /*   var builderLocations = item.getSubmitValue();
                                           if (Ext.isEmpty(builderLocations)) {
                                                 Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('builderLocations') + ' ' + i18n.getKey('not be null!'));
                                             } else {*/
                                            var mask = editPage.setLoading();
                                            controller.saveProductViewConfig(items, productViewCfgModel, mask, builderConfigTab);
                                            /* }*/
                                        }
                                    });
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            itemId: "copy",
                            text: i18n.getKey('copy'),
                            iconCls: 'icon_copy',
                            disabled: urlParams.id != null ? false : true,
                            handler: function () {
                                productViewCfgModel = null;
//					urlParams.id = null;
                                this.setDisabled(true);
                                var configVersion = this.ownerCt.ownerCt.getComponent('configVersion');
                                configVersion.setValue(configVersion.getValue() - 1 + 2);
                                window.parent.Ext.getCmp("productviewconfigedit").setTitle(i18n.getKey('create') + "_" + i18n.getKey('productViewConfig'));
                            }
                        },
                        {
                            xtype: 'button',
                            itemId: 'btnReset',
                            text: i18n.getKey('reset'),
                            iconCls: 'icon_reset',
                            handler: function () {
                                if (urlParams.id != null) {
                                    var model = Ext.ModelManager.getModel("CGP.product.view.productconfig.productviewconfig.model.ProductViewCfgModel");
                                    model.load(Number(urlParams.id), {
                                        success: function (record, operation) {
                                            model = record;
                                            var form = editPage.down('form');
                                            Ext.Array.each(form.items.items, function (item) {
                                                if (item.name == 'builderLocations') {
                                                    if (record.get('builderConfig')) {
                                                        var builderLocations = record.get('builderConfig').builderLocations;
                                                        var builderLocationDTOs = record.raw.builderConfig.builderLocationDTOs;
                                                        for (var i = 0; i < builderLocations.length; i++) {
                                                            var languageId = builderLocations[i].language.id;
                                                            for (var j = 0; j < builderLocationDTOs.length; j++) {
                                                                if (languageId == builderLocationDTOs[j].language.id) {
                                                                    builderLocations[i].DTO = builderLocationDTOs[j];
                                                                    continue;
                                                                }
                                                            }
                                                        }
                                                        item.setSubmitValue(builderLocations)
                                                    }

                                                } else {
                                                    item.setValue(record.get(item.name));
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    ],
                    items: [
                        {
                            name: 'productConfigId',
                            xtype: 'numberfield',
                            fieldLabel: i18n.getKey('productConfigId'),
                            itemId: 'builderConfigId',
                            hidden: true,
                            value: builderConfigTab.productConfigId,
                            allowBlank: false
                        },
                        {
                            name: 'type',
                            xtype: 'combo',
                            itemId: 'type',
                            editable: false,
                            fieldLabel: i18n.getKey('type'),
                            allowBlank: false,
                            store: Ext.create('CGP.product.view.productconfig.productviewconfig.store.ViewTypeStore'),
                            displayField: 'code',
                            valueField: 'code',
                            value: 'HTML'
                        },
                        {
                            name: 'status',
                            xtype: 'combo',
                            editable: false,
                            allowBlank: false,
                            fieldLabel: i18n.getKey('status'),
                            itemId: 'status',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['type', "value"],
                                data: [
                                    {
                                        type: '草稿', value: 1
                                    },
                                    {
                                        type: '测试', value: 2
                                    },
                                    {
                                        type: '上线', value: 3
                                    }
                                ]
                            }),
                            displayField: 'type',
                            valueField: 'value',
                            queryMode: 'local',
                            value: 1

                        }, {
                            name: 'builderViewVersion',
                            xtype: 'combo',
                            editable: false,
                            allowBlank: false,
                            fieldLabel: i18n.getKey('builderView Version'),
                            itemId: 'builderViewVersion',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['type', "value"],
                                data: [
                                    {
                                        type: 'V2', value: 'V2'
                                    },
                                    {
                                        type: 'V3', value: 'V3'
                                    }
                                ]
                            }),
                            displayField: 'type',
                            valueField: 'value',
                            queryMode: 'local',
                            value: 'V3'

                        },
                        {
                            name: "context",
                            xtype: "combo",
                            editable: false,
                            allowBlank: false,
                            fieldLabel: i18n.getKey('builderContext'),
                            itemId: 'context',
                            store: Ext.create('CGP.product.view.productconfig.store.ProductContexts'),
                            displayField: 'code',
                            valueField: 'code',
                            value: 'PC'
                        },
                        {
                            name: "configVersion",
                            xtype: "textfield",
                            id: 'configVersion',
                            readOnly: true,
                            fieldStyle: 'background-color:silver',
                            fieldLabel: i18n.getKey('configVersion'),
                            listeners: {
                                change: function () {
                                    viewCompatibilities.on('load', function () {
                                        viewCompatibilities.filter({
                                            filterFn: function (item) {
                                                return item.get("configVersion") != Ext.getCmp('configVersion').getValue();
                                            }
                                        });
                                        //viewCompatibilities.load();
                                    })
                                }
                            },
                            itemId: 'configVersion'
                        },
                        {
                            xtype: 'gridcombo',
                            matchFieldWidth: false,
                            itemId: 'viewCompatibilities',
                            editable: false,
                            fieldLabel: i18n.getKey('viewCompatibilities'),
                            name: 'viewCompatibilities',
                            needValueField: 'configVersion',
                            multiSelect: true,
                            displayField: 'configVersion',
                            valueField: 'configVersion',
                            labelWidth: 100,
                            store: viewCompatibilities,
                            queryMode: 'remote',
                            gridCfg: {
                                store: viewCompatibilities,
                                height: 300,
                                width: 650,
                                selType: 'checkboxmodel',
                                columns: [
                                    {
                                        text: i18n.getKey('configVersion'),
                                        width: 120,
                                        dataIndex: 'configVersion'
                                    },
                                    {
                                        text: i18n.getKey('status'),
                                        width: 120,
                                        dataIndex: 'status',
                                        renderer: function (value, metaData, record) {
                                            return status[value];
                                        }
                                    },
                                    {
                                        text: i18n.getKey('builderContext'),
                                        width: 120,
                                        dataIndex: 'context'
                                    },
                                    {
                                        text: i18n.getKey('id'),
                                        width: 80,
                                        dataIndex: 'id'
                                    }
                                ],
                                bbar: Ext.create('Ext.PagingToolbar', {
                                    store: builderBomConfigStore,
                                    emptyMsg: i18n.getKey('noData')
                                })
                            }
                        },
                        {
                            name: "path",
                            xtype: "textfield",
                            id: 'builderPath',
                            hidden: true,
                            fieldLabel: i18n.getKey('builderPath'),
                            itemId: 'builderPath'
                        },
                        {
                            name: 'bomType',
                            xtype: 'combo',
                            id: 'bomType',
                            editable: false,
                            itemId: 'bomType',
                            fieldLabel: i18n.getKey('bomType'),
                            allowBlank: false,
                            store: Ext.create('CGP.product.view.productconfig.productbomconfig.store.BomTypeStore'),
                            listeners: {
                                change: function (combo) {
                                    builderBomConfigStore.getProxy().extraParams = {
                                        filter: '[{"name":"type","value":"' + combo.getValue() + '","type":"string"},{"name":"productConfigId","value":' + builderConfigTab.productConfigId + ',"type":"number"}]'
                                    };
                                    builderBomConfigStore.load();
                                }
                            },
                            displayField: 'code',
                            valueField: 'code',
                            value: 'UF2'
                        },
                        {
                            xtype: 'gridcombo',
                            matchFieldWidth: false,
                            itemId: 'bomVersions',
                            editable: false,
                            fieldLabel: i18n.getKey('bomVersions'),
                            name: 'bomCompatibilities',
                            needValueField: 'configVersion',
                            multiSelect: true,
                            colspan: 2,
                            displayField: 'configVersion',
                            valueField: 'configVersion',
                            allowBlank: false,
                            labelWidth: 100,
                            store: builderBomConfigStore,
                            queryMode: 'remote',
                            gridCfg: {
                                store: builderBomConfigStore,
                                height: 300,
                                width: 650,
                                selType: 'checkboxmodel',
                                columns: [
                                    {
                                        text: i18n.getKey('configVersion'),
                                        width: 120,
                                        dataIndex: 'configVersion'
                                    },
                                    {
                                        text: i18n.getKey('status'),
                                        width: 120,
                                        dataIndex: 'status',
                                        renderer: function (value, metaData, record) {
                                            return status[value];
                                        }
                                    },
                                    {
                                        text: i18n.getKey('builderContext'),
                                        width: 120,
                                        dataIndex: 'context'
                                    }
                                ],
                                bbar: Ext.create('Ext.PagingToolbar', {
                                    store: builderBomConfigStore,
                                    emptyMsg: i18n.getKey('noData')
                                })
                            }
                        },
                        {
                            name: 'builderLocations',
                            xtype: 'gridfield',
                            colspan: 2,
                            width: 1000,
                            allowBlank: true,
                            gridConfig: {
                                store: Ext.create("CGP.product.view.productconfig.productviewconfig.store.BuilderLocation"),
                                height: 250,
                                width: '100%',
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
                                                iconCls: 'icon_edit icon_margin',
                                                itemId: 'actionedit',
                                                tooltip: 'Edit',
                                                handler: function (view, rowIndex, colIndex) {
                                                    var store = view.getStore();
                                                    var record = store.getAt(rowIndex);
                                                    var builderConfigDto = null;
                                                    controller.editBuilderLocation(store, record, 'edit');
                                                }
                                            },
                                            {
                                                iconCls: 'icon_remove icon_margin',
                                                itemId: 'actionremove',
                                                tooltip: 'Remove',
                                                handler: function (view, rowIndex, colIndex) {
                                                    var store = view.getStore();
                                                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('确定删除？'), function (select) {
                                                        if (select == 'yes') {
                                                            if (store.getCount() == 1) {
                                                                Ext.Msg.alert(i18n.getKey('prompt'), 'builderLocations的数量最少为1！')
                                                            } else {
                                                                store.removeAt(rowIndex);
                                                            }
                                                        }
                                                    })

                                                }
                                            }
                                        ]
                                    },
                                    {
                                        text: i18n.getKey('title'),
                                        sortable: false,
                                        dataIndex: 'title'
                                    },
                                    {
                                        text: i18n.getKey('status'),
                                        width: 180,
                                        xtype: 'componentcolumn',
                                        dataIndex: 'builderPublishStatus',
                                        renderer: function (value, metadata, record) {
                                            return {
                                                xtype: 'container',
                                                layout: 'hbox',
                                                record: record,
                                                items: [
                                                    {
                                                        xtype: 'displayfield',
                                                        value: i18n.getKey(value),
                                                        itemId: 'display'
                                                    },
                                                    {
                                                        xtype: 'displayfield',
                                                        value: '<a href="#")>' + i18n.getKey('edit') + '</a>',
                                                        itemId: 'edit',
                                                        margin: '0 0 0 15',
                                                        listeners: {
                                                            render: function (view) {
                                                                var record = view.ownerCt.record;
                                                                view.getEl().on("click", function (view) {
                                                                    var win = Ext.create('Ext.window.Window', {
                                                                                title: i18n.getKey('edit'),
                                                                                height: 150,
                                                                                width: 400,
                                                                                modal: true,
                                                                                layout: 'fit',
                                                                                items: {
                                                                                    xtype: 'form',
                                                                                    layout: {
                                                                                        type: 'vbox',
                                                                                        align: 'center',
                                                                                        pack: 'center'

                                                                                    },
                                                                                    items: [
                                                                                        {
                                                                                            xtype: 'combo',
                                                                                            displayField: 'name',
                                                                                            valueField: 'value',
                                                                                            editable: false,
                                                                                            itemId: 'status',
                                                                                            allowBlank: false,
                                                                                            fieldLabel: i18n.getKey('status'),
                                                                                            store: Ext.create('Ext.data.Store', {
                                                                                                fields: [
                                                                                                    {
                                                                                                        name: 'name', type: 'string'
                                                                                                    },
                                                                                                    {
                                                                                                        name: 'value',
                                                                                                        type: 'string'
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
                                                                                                        name: '版本未更改，需发布',
                                                                                                        value: 'VERSIONNOTCHANGED_NEEDPUBLISH'
                                                                                                    },
                                                                                                    {
                                                                                                        name: '内容已更改，不发布',
                                                                                                        value: 'CONTENTCHANGED_NOTPUBLISH'
                                                                                                    }
                                                                                                ]
                                                                                            })
                                                                                        }
                                                                                    ],
                                                                                    bbar: ['->',
                                                                                        {
                                                                                            xtype: 'button',
                                                                                            text: i18n.getKey('ok'),
                                                                                            iconCls: 'icon_agree',
                                                                                            handler: function (view) {
                                                                                                if (view.ownerCt.ownerCt.getComponent('status').isValid()) {
                                                                                                    record.set('builderPublishStatus', view.ownerCt.ownerCt.getComponent('status').getValue())
                                                                                                    win.close();
                                                                                                }
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            xtype: 'button',
                                                                                            text: i18n.getKey('cancel'),
                                                                                            iconCls: 'icon_cancel',
                                                                                            handler: function () {
                                                                                                win.close();
                                                                                            }
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }
                                                                        )
                                                                    ;
                                                                    win.show();
                                                                });
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    },

                                    {
                                        text: i18n.getKey('sortOrder'),
                                        dataIndex: 'sortOrder',
                                        sortable: true,
                                        minValue: 0
                                    },
                                    {
                                        text: i18n.getKey('language'),
                                        dataIndex: 'language',
                                        sortable: false,
                                        renderer: function (value, metadata) {
                                            metadata.tdAttr = 'data-qtip ="' + value.name + '"';
                                            return value.name;
                                        }
                                    },
                                    {
                                        text: i18n.getKey('builderUrl'),
                                        sortable: false,
                                        dataIndex: 'builderUrl',
                                        renderer: function (value, metadata) {
                                            metadata.tdAttr = 'data-qtip ="' + value + '"';
                                            return value;
                                        }
                                    },
                                    {
                                        text: i18n.getKey('userPreviewUrl'),
                                        sortable: false,
                                        dataIndex: 'userPreviewUrl',
                                        renderer: function (value, metadata) {
                                            metadata.tdAttr = 'data-qtip ="' + value + '"';
                                            return value;
                                        }
                                    },
                                    {
                                        text: i18n.getKey('manufacturePreviewUrl'),
                                        sortable: false,
                                        dataIndex: 'manufacturePreviewUrl',
                                        renderer: function (value, metadata) {
                                            metadata.tdAttr = 'data-qtip ="' + value + '"';
                                            return value;
                                        }
                                    }
                                ],
                                tbar: [
                                    {
                                        text: i18n.getKey('add') + i18n.getKey('builderLocations'),
                                        iconCls: 'icon_create',
                                        handler: function () {
                                            var store = this.ownerCt.ownerCt.getStore();
                                            controller.editBuilderLocation(store, null, 'new');
                                        }
                                    }
                                ]

                            },
                            fieldLabel: i18n.getKey('builderLocations'),
                            itemId: 'builderLocations',
                            id: 'builderLocations'
                        },
                        {
                            name: 'fonts',
                            xtype: 'gridfield',
                            colspan: 2,
                            width: 1000,
                            valueType: 'idRef',
                            gridConfig: {
                                store: builderFontLocal,
                                height: 250,
                                width: '100%',
                                renderTo: 'fonts-element',
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
                                    }
                                    ,
                                    {
                                        text: i18n.getKey('language'),
                                        dataIndex: 'languages',
                                        itemId: 'language',
                                        width: 350
                                        , xtype: 'uxarraycolumnv2',
                                        sortable: false,
                                        maxLineCount: 5,
                                        lineNumber: 3,
                                        renderer: function (value, mate, record) {
                                            var result = '';
                                            if (value.locale) {
                                                result = value.code.code + '-' + value.locale.code;
                                            } else {
                                                result = value.code.code;
                                            }
                                            return result;

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
                            itemId: 'fonts',
                            id: 'fonts',
                            diyGetValue: function () {
                                var me = this;
                                var data = me.getSubmitValue();
                                return data;
                            },

                        },
                        {
                            name: "configValue",
                            xtype: "textarea",
                            height: 250,
                            width: 1000,
                            colspan: 2,
                            fieldLabel: i18n.getKey('configValue'),
                            itemId: 'configValue'
                        }
                    ]
                }
            ],
            listeners: {
                afterrender: function (page) {
                    var me = this;
                    var form = me.down('form');
                    var defaultFont = '';
                    if (urlParams.id != null) {
                        productViewCfgModel.load(Number(urlParams.id), {
                            success: function (record, operation) {
                                productViewCfgModel = record;
                                var builderLocations = record.get('builderConfig')?.builderLocations || [];
                                Ext.Array.each(form.items.items, function (item) {
                                    if (item.name == 'builderLocations') {
                                        if (builderLocations && builderLocations.length > 0) {
                                            var builderLocationDTOs = record.raw.builderConfig.builderLocationDTOs;
                                            for (var i = 0; i < builderLocations.length; i++) {
                                                var languageId = builderLocations[i].language.id;
                                                for (var j = 0; j < builderLocationDTOs.length; j++) {
                                                    if (languageId == builderLocationDTOs[j].language.id) {
                                                        builderLocations[i].DTO = builderLocationDTOs[j];
                                                        continue;
                                                    }
                                                }
                                            }
                                            item.setSubmitValue(builderLocations)
                                        } else {
                                            item.hide();
                                            item.setDisabled(true);
                                        }
                                    } else if (item.name == 'fonts') {
                                        var fonts = record.raw.builderConfig?.fontDTOs || [];
                                        item.setSubmitValue(fonts);
                                        if (fonts.length > 0 || (builderLocations.length > 0)) {
                                            defaultFont = productViewCfgModel.get('builderConfig').defaultFont;
                                            form.insert(8, {
                                                xtype: 'combo',
                                                displayField: 'name',
                                                valueField: '_id',
                                                editable: false,
                                                name: 'defaultFont',
                                                queryMode: 'local',
                                                value: defaultFont,
                                                haveReset: true,
                                                fieldLabel: i18n.getKey('default') + i18n.getKey('font'),
                                                allowBlank: Ext.isEmpty(Ext.getCmp('fonts')._grid.getStore().data.items),
                                                store: Ext.getCmp('fonts')._grid.getStore()
                                            });
                                        } else {
                                            item.hide();
                                            item.setDisabled(true);
                                        }
                                    } else {
                                        item.setValue(record.get(item.name));
                                    }
                                });
                            }
                        });
                    } else if (urlParams.id == null) {
                        store.on('load', function () {
                            var lastRecord = store.getAt(store.getCount() - 1);
                            if (Ext.isEmpty(lastRecord)) {
                                Ext.getCmp('configVersion').setValue('1');
                            } else {
                                var configVersion = parseInt(lastRecord.get('configVersion')) + 1 + '';
                                Ext.getCmp('configVersion').setValue(configVersion);
                            }
                        });
                        form.getComponent('builderLocations').hide();
                        form.getComponent('builderLocations').setDisabled(true);
                        form.getComponent('fonts').hide();
                        form.getComponent('fonts').setDisabled(true);
                        /*form.insert(8, {
                            xtype: 'combo',
                            displayField: 'name',
                            valueField: '_id',
                            editable: false,
                            hidden:true,
                            disabled:true,
                            name: 'defaultFont',
                            queryMode: 'local',
                            haveReset: true,
                            value: defaultFont,
                            fieldLabel: i18n.getKey('default') + i18n.getKey('font'),
                            allowBlank: Ext.isEmpty(Ext.getCmp('fonts')._grid.getStore().data.items),
                            store: Ext.getCmp('fonts')._grid.getStore()
                        })*/
                    }


                    var page = this;
                    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                    var productId = builderConfigTab.productId;
                    var isLock = JSCheckProductIsLock(productId);
                    if (isLock) {
                        JSLockConfig(page);
                    }

                }
            }

        })
    ;

})
;
