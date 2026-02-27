Ext.onReady(function () {


    var notOptional = ['TextField', 'TextArea', 'Date', 'File', 'Canvas', 'YesOrNo', 'DiyConfig', 'DiyDesign'];
//    initController(window, optionStore, resource, adminPath + 'api/admin/attribute/{0}/option');
    //选项管理的controller

    var controller = Ext.create("CGP.attribute.controller.MainController");
    var page = Ext.create('Ext.ux.ui.GridPage', {
        id: 'page',
        i18nblock: i18n.getKey('attribute'),
        block: 'attribute',
        editPage: 'edit.html',
        gridCfg: {
            //store.js
            store: Ext.create("CGP.attribute.store.Attribute"),
            frame: false,
            columnDefaults: {
                tdCls: 'vertical-middle',
                autoSizeColumn: true
            },
            columns: [
                {
                    text: i18n.getKey('operator'),
                    width: 80,
                    xtype: "componentcolumn",
                    renderer: function (value, metadata, record) {
                        if (!Ext.Array.contains(notOptional, record.get('inputType'))) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + i18n.getKey('managerOptions') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        display.getEl().on("click", function () {
                                            var valueType = record.get('valueType');
                                            controller.openOptionWindow(record, valueType);
                                        });
                                    }
                                }
                            };
                        }
                    }
                },
                {
                    text: i18n.getKey('id'),
                    width: 100,
                    dataIndex: 'id',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 165,
                    itemId: 'name',
                    sortable: true
                },
                {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    width: 100,
                    itemId: 'code',
                    sortable: true
                },
                {
                    text: i18n.getKey('valueType'),
                    dataIndex: 'valueType',
                    width: 120,
                    itemId: 'valueType',
                    sortable: true
                }, {
                    text: i18n.getKey('值输入方式'),
                    dataIndex: 'selectType',
                    width: 120,
                    itemId: 'selectType',
                    sortable: true,
                    renderer: function (value, mate, record) {
                        if (value == 'NON') {
                            return '手动输入';
                        } else if (value == 'MULTI') {
                            return '多选';
                        } else {
                            return '单选';
                        }

                    }
                },
                /*{
                    text: i18n.getKey('sortOrder'),
                    dataIndex: 'sortOrder',
                    itemId: 'sortOrder',
                    sortable: true,
                    width: 80
                },*/
                {
                    text: i18n.getKey('options'),
                    dataIndex: 'options',
                    flex: 1,
                    xtype: 'uxarraycolumnv2',
                    itemId: 'options',
                    sortable: false,
                    maxLineCount: 5,
                    lineNumber: 2,
                    showContext: function (id, title) {//自定义展示多数据时的方式
                        var store = window.store;
                        var record = store.findRecord('id', id);
                        var data = [];
                        for (var i = 0; i < record.get('options').length; i++) {
                            data.push({
                                option: record.get('options')[i].name
                            });
                        }
                        var win = Ext.create('Ext.window.Window', {
                            title: i18n.getKey('check') + i18n.getKey('options'),
                            height: 250,
                            width: 350,
                            layout: 'fit',
                            model: true,
                            items: {
                                xtype: 'grid',
                                border: false,
                                autoScroll: true,
                                columns: [
                                    {
                                        width: 50,
                                        sortable: false,
                                        xtype: 'rownumberer'
                                    },
                                    {
                                        flex: 1,
                                        text: i18n.getKey('options'),
                                        dataIndex: 'option',
                                        sortable: false,
                                        menuDisabled: true,
                                        renderer: function (value) {
                                            return value;
                                        }
                                    }

                                ],
                                store: Ext.create('Ext.data.Store', {
                                    fields: [
                                        {name: 'option', type: 'string'}
                                    ],
                                    data: data
                                })
                            }
                        }).show();
                    },
                    renderer: function (v, record) {
                        if (record.get('valueType') == 'Color') {
                            var colorName = v['name'];
                            var color = v['value'];
                            var colorBlock = new Ext.Template('<a class=colorpick style="background-color:{color}"></a>').apply({
                                color: color
                            });
                            return colorName + colorBlock;
                        }
                        return v['name'];
                    }
                }
            ]
        },
        filterCfg: {
            minHeight: 125,
            items: [
                {
                    id: 'idSearchField',
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    listeners: {
                        render: function (comp) {
                            var attributeId = JSGetQueryString('attributeId');
                            if (attributeId) {
                                comp.setValue(parseInt(attributeId));
                            }
                        }
                    },
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'codeSearchField',
                    name: 'code',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code'
                },
                {
                    id: 'nameSearchField',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'valueType',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('valueType'),
                    itemId: 'valueType',
                    editable: false,
                    valueField: 'value',
                    displayField: 'name',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: 'Boolean', value: 'Boolean'},
                            {name: 'String', value: 'String'},
                            {name: 'Array', value: 'Array'},
                            {name: 'Date', value: 'Date'},
                            {name: 'Number', value: 'Number'},
                            {name: 'YearMonth', value: 'YearMonth'}, {
                                name: 'Color', value: 'Color'
                            }
                        ]
                    })
                },
                {
                    name: 'selectType',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('selectType'),
                    itemId: 'selectType',
                    valueField: 'value',
                    editable: false,
                    displayField: 'name',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: '输入型', value: 'NON'},
                            {name: '单选型', value: 'SINGLE'},
                            {name: '多选型', value: 'MULTI'}
                        ]
                    })
                }
            ]
        },
        tbarCfg: {
            btnExport: {
                itemId: 'btnCopy',
                text: 'copy',
                iconCls: 'icon_copy',
                disabled: false,
                handler: function (btn) {
                    var grid = btn.ownerCt.ownerCt;
                    var selectedData = grid.getSelectionModel().getSelection();
                    if (Ext.isEmpty(selectedData)) {
                        Ext.Msg.alert('提示', '请选择属性配置模板');
                        return;
                    } else if (selectedData.length !== 1) {
                        Ext.Msg.alert('提示', '只能选择一个属性配置模板，请取消多余属性配置模板');
                        return;
                    };

                    var selectedAtr = selectedData[0].getData();
                    // 将rawModel中所有id属性值设置为null
                    selectedAtr['id'] = null;
                    var options = selectedAtr['options'];
                    options.forEach(function (item) {
                        item['id'] = JSGetCommonKey();
                    });
                    var data = JSON.stringify(selectedAtr);
                    var url = path + 'partials/' + 'attribute' + '/' + 'edit.html' + '?selectedAtr=' + data;
                    var title = i18n.getKey('create') + '_' + i18n.getKey('attribute');
                    JSOpen({
                        url: encodeURI(url),
                        title: title,
                        refresh: true
                    });
                }
            }
        }
    });
});

