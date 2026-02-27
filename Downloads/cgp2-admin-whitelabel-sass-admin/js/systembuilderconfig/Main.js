/**
 * Created by nan on 2020/10/29
 */
Ext.onReady(function () {
    var store = Ext.create('CGP.systembuilderconfig.store.SystemBuilderConfigStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('builder') + i18n.getKey('common') + i18n.getKey('resources'),
        block: 'systembuilderconfig',
        // 编辑页面
        editPage: 'edit.html',
        isReadOnly: true,
        gridCfg: {
            // store是指store.js
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle'
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('isSystemDefault'),
                    sortable: false,
                    itemId: 'operation',
                    minWidth: 150,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var grid = gridView.ownerCt;
                        if (record.get('isSystemDefault')) {
                            return '默认配置'
                        } else {
                            return null;
/*
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>设置为默认</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            var controller = Ext.create('CGP.systembuilderconfig.controller.Controller');
                                            controller.setDefaultConfig(record, grid);
                                        });
                                    }
                                }
                            };
*/
                        }
                    }
                },
                {
                    text: i18n.getKey('builderUrl'),
                    dataIndex: 'builderUrl',
                    itemId: 'builderUrl',
                    width: 300,
                    renderer: function (value, mateData, record) {
                        return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                    }
                },
                {
                    text: i18n.getKey('builder') + i18n.getKey('version'),
                    dataIndex: 'version',
                    itemId: 'version',
                },
                {
                    text: i18n.getKey('userPreviewUrl'),
                    dataIndex: 'userPreviewUrl',
                    width: 250,
                    itemId: 'userPreviewUrl',
                    renderer: function (value, mateData, record) {
                        return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                    }
                },
                {
                    text: i18n.getKey('manufacturePreviewUrl'),
                    dataIndex: 'manufacturePreviewUrl',
                    width: 250,
                    itemId: 'manufacturePreviewUrl',
                    renderer: function (value, mateData, record) {
                        return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                    }
                },
                {
                    text: i18n.getKey('platform'),
                    dataIndex: 'platform',
                    itemId: 'platform',
                },
                {
                    text: i18n.getKey('language'),
                    dataIndex: 'supportLanguage',
                    xtype: 'arraycolumn',
                    flex: 1,
                    minWidth: 100,
                    itemId: 'supportLanguage',
                    renderer: function (value, metadata, record) {
                        return value.name

                    }
                }, {
                    text: i18n.getKey('相关配置的支持版本'),
                    dataIndex: 'schemaVersion',
                    minWidth: 150,
                    flex: 1,
                    itemId: 'supportLanguage',
                    renderer: function (value, metadata, record) {
                        var result = [];
                        if (value) {
                            result.push({
                                title: '导航配置支持版本',
                                value: value['supportNavigationSchemaVersion']
                            });
                            result.push({
                                title: 'builderView支持版本',
                                value: value['supportBuilderViewSchemaVersion']
                            });
                        }
                        return JSCreateHTMLTable(result);
                    }
                }
            ]
        },

        // 查询输入框
        filterCfg: {
            minHeight: 120,
            items: [{
                id: 'idSearchField',
                name: '_id',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                id: 'builderUrl',
                name: 'builderUrl',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('builderUrl'),
                itemId: 'builderUrl'
            }, {
                id: 'version',
                name: 'version',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('version'),
                itemId: 'version'
            }, {
                id: 'isSystemDefault',
                name: 'isSystemDefault',
                xtype: 'combo',
                fieldLabel: i18n.getKey('isSystemDefault'),
                itemId: 'isSystemDefault',
                valueField: 'value',
                editable: false,
                displayField: 'display',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: true,
                            display: 'true'
                        }, {
                            value: false,
                            display: 'false'
                        }
                    ]
                })
            }, {
                id: 'platform',
                name: 'platform',
                xtype: 'combo',
                fieldLabel: i18n.getKey('platform'),
                itemId: 'platform',
                valueField: 'value',
                editable: false,
                displayField: 'display',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: 'PC',
                            display: 'PC'
                        }, {
                            value: 'Mobile',
                            display: 'Mobile'
                        }
                    ]
                })
            }, {
                name: 'supportLanguage._id',
                xtype: 'combo',
                fieldLabel: i18n.getKey('language'),
                itemId: 'language',
                editable: false,
                isLike: false,
                valueField: 'id',
                displayField: 'name',
                store: Ext.create('CGP.systembuilderconfig.store.LanguageStore')
            }]
        }
    });
});
