/**
 * Created by nan on 2021/9/1
 */
Ext.Loader.syncRequire([
    'CGP.pcresourcelibrary.config.Config',
    'CGP.pcresourcelibrary.view.PCResourceItemGridV2'
])
Ext.onReady(function () {
    var controller = Ext.create('CGP.pcresourcelibrary.controller.Controller');
    var PCResourceItemStore = Ext.create('CGP.pcresourcelibrary.store.PCResourceItemStore', {
        autoLoad: false,
    });
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('pcResourceLibrary'),
        block: 'pcresourcelibrary',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function () {
                    var win = Ext.create('Ext.window.Window', {
                        title: i18n.getKey('create') + i18n.getKey('pcResourceLibrary'),
                        modal: true,
                        constrain: true,
                        items: [
                            {
                                xtype: 'errorstrickform',
                                defaults: {
                                    width: 400,
                                    margin: '5 25 10 25',
                                    allowBlank: false,
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        name: 'name',
                                        itemId: 'name',
                                        fieldLabel: i18n.getKey('name')
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'description',
                                        itemId: 'description',
                                        fieldLabel: i18n.getKey('description')
                                    },
                                    {
                                        xtype: 'combo',
                                        name: 'type',
                                        itemId: 'type',
                                        fieldLabel: i18n.getKey('resources') + i18n.getKey('type'),
                                        editable: false,
                                        valueField: 'value',
                                        displayField: 'display',
                                        store: {
                                            type: 'store',
                                            fields: ['value', 'display'],
                                            data: CGP.pcresourcelibrary.config.Config.IPCResourceType
                                        }
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'clazz',
                                        hidden: true,
                                        itemId: 'clazz',
                                        value: 'com.qpp.cgp.domain.pcresource.PCResourceLibrary',
                                    }
                                ]
                            }
                        ],
                        bbar: {
                            xtype: 'bottomtoolbar',
                            saveBtnCfg: {
                                text: i18n.getKey('nextStep'),
                                iconCls: 'icon_next_step',
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    var form = win.items.items[0];
                                    if (form.isValid()) {
                                        var data = form.getValue();
                                        controller.saveRecord(data);
                                        win.close();
                                    }
                                }
                            }
                        }
                    });
                    win.show();
                }
            }
        },
        gridCfg: {
            store: Ext.create('CGP.pcresourcelibrary.store.PCResourceLibraryStore'),
            frame: false,
            editActionHandler: function (view, rowIndex, colIndex, button, event, record) {
                JSOpen({
                    id: 'pcresourcelibrary_edit',
                    url: path + 'partials/pcresourcelibrary/edit2.html?id=' + record.getId() + '&type=' + record.get('type'),
                    title: i18n.getKey('edit') + "_" + i18n.getKey('pcResourceLibrary') + '(' + record.getId() + ')',
                    refresh: true
                })
            },
            viewConfig: {
                enableTextSelection: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id'
                }, {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 200,
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 350,
                },
                {
                    text: i18n.getKey('resources') + i18n.getKey('type'),
                    dataIndex: 'type',
                    width: 150,
                    renderer: function (value) {
                        var type = value.split('.').pop();
                        return type;
                    }
                },
                {
                    text: i18n.getKey('optional') + i18n.getKey('resources'),
                    flex: 1,
                    minWidth: 150,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var recordLibraryId = record.getId();
                        var resourceType = record.get('type');
                        metadata.tdAttr = 'data-qtip="管理资源"';
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>管理资源</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        var win = Ext.create('Ext.window.Window', {
                                                modal: true,
                                                constrain: true,
                                                width: 900,
                                                height: 600,
                                                title: i18n.getKey('resources'),
                                                layout: 'fit',
                                                maximizable: true,
                                                items: [
                                                    {
                                                        xtype: 'pcresourceitemgridv2',
                                                        store: PCResourceItemStore,
                                                        resourceType: resourceType,
                                                        resourceLibraryId: recordLibraryId,

                                                    }
                                                ],
                                                listeners: {
                                                    afterrender: function () {
                                                        var win = this;
                                                        win.items.items[0].store.load();
                                                    }
                                                }
                                            })
                                        ;
                                        win.show();

                                    });
                                }
                            }
                        };
                    }
                }
            ],
        },
        // 搜索框
        filterCfg: {
            height: 120,
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'description',
                    xtype: 'textfield',
                    itemId: 'description',
                    fieldLabel: i18n.getKey('description')
                },
                {
                    xtype: 'combo',
                    name: 'type',
                    itemId: 'type',
                    fieldLabel: i18n.getKey('resources') + i18n.getKey('type'),
                    valueField: 'value',
                    displayField: 'display',
                    editable: false,
                    store: {
                        type: 'store',
                        fields: ['value', 'display'],
                        data: CGP.pcresourcelibrary.config.Config.IPCResourceType
                    },
                }
            ]
        }
    })

})
