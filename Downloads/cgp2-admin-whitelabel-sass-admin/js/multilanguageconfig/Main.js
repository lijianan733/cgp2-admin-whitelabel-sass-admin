/**
 * Created by shirley on 2021/06/02
 */
Ext.Loader.syncRequire([
    'CGP.multilanguageconfig.store.LanguageCodeStore'
])
Ext.onReady(function () {
    var store = Ext.create('CGP.multilanguageconfig.store.MultiLanguageConfigStore');
    var languageCode = Ext.create('CGP.multilanguageconfig.store.LanguageCodeStore');
    // 创建一个GridPage控件
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('multilanguage'),
        block: 'multilanguageconfig',
        editSuffix: '_edit',
        // 多语言配置编辑界面
        editPage: 'edit.html',
        tbarCfg: {
            btnDelete: {
                disabled: true
            },
            btnCreate: {
                handler: function () {
                    var url = path + 'partials/' + 'multilanguageconfig' + '/' + 'add.html';
                    var title = i18n.getKey("add") + '_' + i18n.getKey('multilanguage');
                    JSOpen({
                        id: 'multilanguageconfig_add',
                        url: url,
                        title: title,
                        refresh: true
                    });
                }
            }
        },
        gridCfg: {
            store: store,
            frame: false,
            deleteAction: false,
            selType: 'rowmodel',
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle'
            },
            //gridCfg编辑按钮函数
            editActionHandler: function (grid, rowIndex, colIndex) {
                var me = grid.ownerCt.ownerCt;
                var m = grid.ownerCt.ownerCt.grid.getStore().getAt(rowIndex);
                // url传值时添加type参数
                JSOpen({
                    id: me.block + me.editSuffix,
                    url: path + 'partials/' + me.block + '/' + me.editPage + '?name=' + m.data.name +'&type=' + m.data.type +'&isReadOnly=' + me.isReadOnly,
                    title: (me.isReadOnly ? i18n.getKey('check') : me.pageText.edit) + '_' + me.i18nblock + '(' + m.data.name + ')',
                    refresh: true
                });
            },
            columns: [
                {
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
                    width: 250,
                    sortable: true
                }, {
                    text: i18n.getKey('value'),
                    dataIndex: 'value',
                    xtype: 'gridcolumn',
                    width: 450,
                    itemId: 'value',
                    sortable: true
                }, {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    xtype: 'gridcolumn',
                    itemId: 'type',
                    sortable: true
                },
                {
                    text: i18n.getKey('cultureCode'),
                    dataIndex: 'cultureCode',
                    xtype: 'gridcolumn',
                    minWidth: 120,
                    itemId: 'cultureCode',
                    sortable: true
                },
                {
                    text: i18n.getKey('comment'),
                    dataIndex: 'comment',
                    xtype: 'gridcolumn',
                    itemId: 'comment',
                    sortable: true,
                    flex: 1,
                }]
        },

        // 查询输入框
        filterCfg: {
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                }, {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'value',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('value'),
                    itemId: 'value'
                },
                {
                    name: 'type',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'type',
                    editable: false,
                    haveReset: true,
                    valueField: 'type',
                    displayField: 'type',
                    value: 'BuilderConfig',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'type'
                        ],
                        data: [
                            {
                                type: 'CaptionRes'
                            },
                            {
                                type: 'BuilderConfig'
                            },
                            {
                                type: 'ComposingConfig'
                            },
                            {
                                type: 'TreeRes'
                            },
                            {
                                type: 'MessageRes'
                            }
                        ]
                    })
                },
                {
                    name: 'cultureCode',
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('cultureCode'),
                    itemId: 'cultureCode',
                    editable: false,
                    haveReset: true,
                    valueField: 'codeValue',
                    displayField: 'codeValue',
                    value: {codeValue: 'en'},
                    matchFieldWidth: false,
                    multiSelect: false,
                    autoScroll: true,
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            me.setValue({
                                codeValue: data
                            })
                        }
                    },
                    diyGetValue: function (data) {
                        var me = this;
                        var data = me.getDisplayValue();
                        return data;
                    },
                    store: languageCode,
                    filterCfg: {
                        layout: {
                            type: 'column'
                        },
                        defaults: {
                            width: 170,
                            isLike: false,
                            padding: 2
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: i18n.getKey('id'),
                                name: 'id',
                                itemId: 'id',
                                labelWidth: 40,
                                hideTrigger: true
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('code'),
                                name: 'code.code',
                                itemId: 'code',
                                labelWidth: 40
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('name'),
                                name: 'name',
                                itemId: 'name',
                                labelWidth: 40
                            },
                        ]
                    },
                    gridCfg: {
                        height: 300,
                        width: 400,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        autoScroll: true,
                        columns: [
                            {
                                xtype: 'rownumberer',
                                width: 50
                            },
                            {
                                text: i18n.getKey('id'),
                                width: 80,
                                dataIndex: 'id',
                                renderer: function (value, metaData) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('code'),
                                flex: 1,
                                dataIndex: 'codeValue',
                                renderer: function (value, metaData, record, rowIndex) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('name'),
                                flex: 1,
                                dataIndex: 'name',
                                renderer: function (value, metaData, record, rowIndex) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: languageCode
                        })
                    }
                }
            ]
        }
    });
});

