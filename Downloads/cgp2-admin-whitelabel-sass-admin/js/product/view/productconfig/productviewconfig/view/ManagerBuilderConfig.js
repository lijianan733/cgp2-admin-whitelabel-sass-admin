Ext.onReady(function () {
    var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
    var data;
    var id = JSGetQueryString('id');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [
            {
                xtype: 'grid',
                region: 'center',
                selModel: new Ext.selection.RowModel({
                    mode: 'MULTI'
                }),
                store: Ext.create("CGP.product.view.productconfig.productviewconfig.store.BuilderLocation"),
                minHeight: 200,
                defaults: {
                    width: 150
                },
                listeners: {
                    afterrender: function (comp) {
                        if (id) {
                            Ext.Ajax.request({
                                url: adminPath + 'api/builderConfigs/' + id,
                                method: 'GET',
                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                success: function (resp) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    if (!response.success) {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                        return;
                                    }
                                    var builderLocations = response.data.builderLocations;
                                    data = response.data;
                                    comp.getStore().loadData(builderLocations);
                                },
                                failure: function (resp) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            })
                        }
                    }
                },
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
                    /*  {
                          text: i18n.getKey('locale'),
                          dataIndex: 'locale',
                          sortable: false
                      },*/
                    {
                        text: i18n.getKey('language'),
                        dataIndex: 'language',
                        sortable: true,
                        renderer: function (value, mateData, record) {
                            if (value) {
                                if (value.locale) {
                                    return value.code.code + '-' + value.locale.code;
                                } else {
                                    return value.code.code;
                                }
                            }
                        }
                    },
                    {
                        text: i18n.getKey('builderUrl'),
                        sortable: false,
                        width: 180,
                        dataIndex: 'builderUrl',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip ="' + value + '"';
                            return value;
                        }
                    },
                    {
                        text: i18n.getKey('userPreviewUrl'),
                        sortable: false,
                        width: 180,
                        dataIndex: 'userPreviewUrl',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip ="' + value + '"';
                            return value;
                        }
                    },
                    {
                        text: i18n.getKey('manufacturePreviewUrl'),
                        sortable: false,
                        width: 180,
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
                    },
                    {
                        text: i18n.getKey('save'),
                        itemId: 'save',
                        iconCls: 'icon_save',
                        handler: function () {
                            var store = this.ownerCt.ownerCt.getStore();
                            var builderLocations = [];
                            store.each(function (record) {
                                var recordData = record.data;
                                var recordDataFonts = [];
                                if (!Ext.isEmpty(recordData.fonts)) {
                                    Ext.each(recordData.fonts, function (item) {
                                        recordDataFonts.push({
                                            _id: item._id,
                                            clazz: item.clazz
                                        })
                                    });
                                    recordData.fonts = recordDataFonts;
                                    builderLocations.push(recordData);
                                } else {
                                    builderLocations.push(record.data);
                                }

                            });
                            data.builderLocations = builderLocations;
                            if (!Ext.isEmpty(data.fonts)) {
                                var builderDataFonts = [];
                                Ext.each(data.fonts, function (item) {
                                    builderDataFonts.push({
                                        _id: item._id,
                                        clazz: item.clazz
                                    })
                                });
                                data.fonts = builderDataFonts;
                            }
                            var mask = page.setLoading();
                            if (Ext.isObject(data.defaultFont)) {
                                data.defaultFont = data.defaultFont._id;
                            }
                            controller.saveBuilderConfig(data, mask);
                        }
                    },
                    {
                        text: i18n.getKey('delete') + i18n.getKey('当前整个BuilderConfig'),
                        iconCls: 'icon_delete',
                        hidden: Ext.isEmpty(id),
                        handler: function () {
                            var url = adminPath + 'api/builderConfigs/' + id;
                            JSSetLoading(true, i18n.getKey('loading'));
                            JSAjaxRequest(url, 'DELETE', true, false, null, function () {
                                JSSetLoading(false, i18n.getKey('loading'));
                                setTimeout(function () {
                                    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                                    var currentTab = builderConfigTab.activeTab;
                                    builderConfigTab.setActiveTab(2);
                                    builderConfigTab.remove(currentTab);
                                }, 500)
                            })
                        }
                    },
                ]
            }
        ],
        listeners: {
            afterrender: function () {
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
});
