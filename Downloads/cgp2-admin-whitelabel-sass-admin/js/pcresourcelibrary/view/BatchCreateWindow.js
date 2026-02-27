/**
 * Created by nan on 2021/9/6
 */
Ext.Loader.syncRequire([
    'CGP.pcresourcelibrary.view.CategoryGridCombo',
    'CGP.pcresourcelibrary.view.ResourceGridCombo',
    'CGP.pcresourcelibrary.model.PCResourceItemModel',
    'CGP.common.field.MultiLanguageField'
]);
Ext.define("CGP.pcresourcelibrary.view.BatchCreateWindow", {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    maximizable: true,
    width: 1100,
    height: 500,
    layout: {
        type: 'fit'
    },
    resourceType: null,
    resourceItemGrid: null,
    resourceLibraryId: null,
    categoryId: null,//指定的分类Id
    isValid: function () {
        var me = this;
        var grid = me.items.items[0];
        var colCount = grid.columns.length;
        var isValid = true;
        if (me.rowIndexArr.length == 0) {
            isValid = false;
        } else {
            for (var i = 0; i < me.rowIndexArr.length; i++) {
                var rowIndex = me.rowIndexArr[i];
                for (var j = 0; j < colCount; j++) {
                    var editor = Ext.ComponentQuery.query('[itemId=' + (rowIndex + '_' + j) + ']')[0];
                    if (editor && editor.isValid() == false) {
                        isValid = false;
                    }
                }
            }
        }
        return isValid;
    },
    bathCreate: function (data) {
        var me = this;
        me.setLoading(true);
        setTimeout(function () {
            var url = adminPath + 'api/pcresourceItems/batch';
            JSAjaxRequest(url, "POST", false, data, i18n.getKey('addsuccessful'), function (request, success, response) {
                me.setLoading(false);
                if (success) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.success) {
                        me.close();
                        me.resourceItemGrid.store.load();
                    }
                }
            })
        }, 100);

    },
    getValue: function () {
        var me = this;
        var grid = me.items.items[0];
        var colCount = grid.columns.length;
        var result = [];
        for (var i = 0; i < me.rowIndexArr.length; i++) {
            var rowIndex = me.rowIndexArr[i];
            var item = {
                clazz: 'com.qpp.cgp.domain.pcresource.PCResourceItem',
                library: {
                    clazz: "com.qpp.cgp.domain.pcresource.PCResourceLibrary",
                    _id: me.resourceLibraryId
                },
                category: {
                    _id: me.categoryId,
                    clazz: 'com.qpp.cgp.domain.pcresource.PCResourceCategory'
                }
            };
            for (var j = 0; j < colCount; j++) {
                var editor = Ext.ComponentQuery.query('[itemId=' + (rowIndex + '_' + j) + ']')[0];
                if (editor) {
                    //处理特殊的字段
                    if (editor.diyGetValue) {
                        item[editor.name] = editor.diyGetValue();
                    } else {
                        item[editor.name] = editor.getValue();
                    }
                }
            }
            if (me.resourceType.indexOf('Color') != -1) {
                item.displayDescription = {
                    clazz: 'com.qpp.cgp.domain.pcresource.DisplayColor',
                    colorCode: item.colorCode
                };
                delete item.colorCode;
            } else {
                item.displayDescription = {
                    clazz: 'com.qpp.cgp.domain.pcresource.DisplayImage',
                    thumbnail: item.thumbnail
                }
                delete item.thumbnail;
            }
            item.displayDescription.displayName = item.displayName;
            delete item.displayName;
            result.push(item);
        }
        return result;
    },
    constructor: function () {
        var me = this;
        me.rowIndexArr = [];
        me.callParent(arguments);
        //定义同上功能按钮
        Ext.define('sameUpBtn', {
            extend: 'Ext.button.Button',
            alias: 'widget.sameupbtn',
            tooltip: '同上',
            text: '同上',
            width: 24,
            margin: '0 2 0 2',
            win: me,
            componentCls: 'btnOnlyIconV2',
            iconCls: 'icon_copyCmpTitleInfo',
            handler: function (btn) {
                var win = btn.win;
                var editor = btn.ownerCt.items.items[0];
                var rowIndex = Number(editor.itemId.split('_')[0]);
                var colIndex = Number(editor.itemId.split('_')[1]);
                var upRowIndex;//上一条记录的编号
                var currentRowIndex = win.rowIndexArr.indexOf(rowIndex);
                upRowIndex = win.rowIndexArr[currentRowIndex - 1];
                var upEditor = Ext.ComponentQuery.query('[itemId=' + (upRowIndex + '_' + colIndex) + ']')[0];
                if (upEditor) {
                    var data = '';
                    if (upEditor.diyGetValue) {
                        data = upEditor.diyGetValue()
                    } else {
                        data = upEditor.getValue()
                    }
                    data = Ext.clone(data);
                    if (editor.diySetValue) {
                        editor.diySetValue(data);
                    } else {
                        editor.setValue(data);
                    }
                }
            }
        })
    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('batch') + i18n.getKey('create') + i18n.getKey('resources');
        var languageStore = Ext.create('CGP.language.store.LanguageStore')
        var localStore = Ext.create('Ext.data.Store', {
            autoSync: false,
            data: [],
            proxy: {
                type: 'memory'
            },
            fields: [
                {
                    name: '_id',
                    type: 'string'
                }, {
                    name: 'resource',
                    type: 'object'
                }, {
                    name: 'category',
                    type: 'object'
                }, {
                    name: 'tag',
                    type: 'array',
                }, {
                    name: 'languageFilter',
                    type: 'array'
                }, {//描述信息
                    name: 'displayDescription',
                    type: 'object'
                }, {
                    name: 'library',
                    type: 'object'
                }, {
                    name: 'clazz',
                    type: 'string',
                    defaultValue: 'com.qpp.cgp.domain.pcresource.PCResourceItem'
                },
                //不能共用模型，这个有个rawRowNumber特有字段
                {name: 'rawRowNumber', type: 'number'}
            ],
        });
        me.items = [
            {
                xtype: 'grid',
                viewConfig: {
                    markDirty: false,
                },
                selType: 'checkboxmodel',
                store: localStore,
                tbar: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('add'),
                        iconCls: 'icon_add',
                        count: 0,
                        handler: function (btn) {
                            var grid = btn.ownerCt.ownerCt;
                            grid.store.add({
                                rawRowNumber: btn.count
                            });
                            grid.ownerCt.rowIndexArr.push(btn.count);
                            btn.count++;
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('delete'),
                        iconCls: 'icon_delete',
                        handler: function (btn) {
                            var grid = btn.ownerCt.ownerCt;
                            var selection = grid.getView().getSelectionModel().getSelection();
                            grid.store.remove(selection)
                        }
                    }
                ],
                columns: [
                    {
                        xtype: 'actioncolumn',
                        width: 35,
                        items: [
                            {
                                iconCls: 'icon_remove icon_margin',  // Use a URL in the icon config
                                tooltip: 'remove',
                                handler: function (gridView, rowIndex, colIndex, a, b, record) {
                                    var store = gridView.ownerCt.store;
                                    var win = gridView.ownerCt.ownerCt;
                                    var rawRowNumber = record.raw.rawRowNumber;
                                    Ext.Msg.confirm('提示', '确定删除？', callback);

                                    function callback(id) {
                                        if (id === 'yes') {
                                            store.remove(record);
                                            win.rowIndexArr.remove(win.rowIndexArr.indexOf(rawRowNumber));
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'componentcolumn',
                        dataIndex: 'displayName',
                        text: i18n.getKey('displayName'),
                        itemId: 'displayName',
                        width: 200,
                        sortable: false,
                        tdCls: 'vertical-middle',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var rawRowNumber = record.get('rawRowNumber');
                            return {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'multilanguagefield',
                                        name: 'displayName',
                                        itemId: rawRowNumber + '_' + colIndex,
                                        allowBlank: false,
                                        flex: 1,
                                    },
                                    {
                                        xtype: 'sameupbtn',
                                    }
                                ]
                            }
                        }
                    },
                    {
                        dataIndex: 'resource',
                        text: i18n.getKey('resources'),
                        width: 200,
                        sortable: false,
                        xtype: 'componentcolumn',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var rawRowNumber = record.get('rawRowNumber');
                            return {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'resourcegridcombo',
                                        name: 'resource',
                                        itemId: rawRowNumber + '_' + colIndex,
                                        allowBlank: false,
                                        flex: 1,
                                        resourceType: me.resourceType,
                                        editable: false,
                                    },
                                    {
                                        xtype: 'sameupbtn',
                                    }
                                ]
                            }
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        dataIndex: 'category',
                        text: i18n.getKey('category'),
                        width: 200,
                        sortable: false,
                        tdCls: 'vertical-middle',
                        itemId: 'category',
                        hidden: !Ext.isEmpty(me.categoryId),
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var rawRowNumber = record.get('rawRowNumber');
                            return {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'categorygridcombo',
                                        name: "category",
                                        itemId: rawRowNumber + '_' + colIndex,
                                        flex: 1,
                                        allowBlank: true,
                                        resourceType: me.resourceType
                                    },
                                    {
                                        xtype: 'sameupbtn',
                                    }
                                ]
                            }
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        dataIndex: 'tag',
                        text: i18n.getKey('tags'),
                        itemId: 'tag',
                        minWidth: 300,
                        flex: 1,
                        sortable: false,
                        tdCls: 'vertical-middle',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var rawRowNumber = record.get('rawRowNumber');
                            return {
                                xtype: 'fieldcontainer',
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                    pack: 'center'
                                },
                                items: [
                                    {
                                        xtype: 'arraydatafield',
                                        itemId: rawRowNumber + '_' + colIndex,
                                        name: 'tag',
                                        margin: '0 5 0 0',
                                        flex: 1,
                                        resultType: 'Array',
                                        allowBlank: true,
                                        fieldLabel: false,
                                    },
                                    {
                                        xtype: 'sameupbtn',
                                    }
                                ]
                            }
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        dataIndex: 'languageFilter',
                        text: i18n.getKey('支持的语言'),
                        itemId: 'languageFilter',
                        width: 200,
                        sortable: false,
                        tdCls: 'vertical-middle',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var rawRowNumber = record.get('rawRowNumber');
                            return {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [
                                    {
                                        name: 'languageFilter',
                                        xtype: 'gridcombo',
                                        itemId: rawRowNumber + '_' + colIndex,
                                        allowBlank: true,
                                        displayField: 'name',
                                        valueField: 'id',
                                        msgTarget: 'side',
                                        flex: 1,
                                        store: languageStore,
                                        matchFieldWidth: false,
                                        editable: false,
                                        multiSelect: true,
                                        valueType: 'idReference',
                                        gridCfg: {
                                            height: 300,
                                            width: 500,
                                            selType: 'checkboxmodel',
                                            columns: [
                                                {
                                                    text: i18n.getKey('id'),
                                                    dataIndex: 'id',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'id',
                                                }, {
                                                    text: i18n.getKey('name'),
                                                    dataIndex: 'name',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'name',
                                                }, {
                                                    text: i18n.getKey('locale'),
                                                    dataIndex: 'locale',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'locale',
                                                    renderer: function (v) {
                                                        if (v) {
                                                            return v.name + '(' + v.code + ')';
                                                        }
                                                    }
                                                }, {
                                                    text: i18n.getKey('code'),
                                                    dataIndex: 'code',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'code',
                                                    flex: 1,
                                                    renderer: function (v) {
                                                        return v.code;
                                                    }
                                                }
                                            ],
                                            bbar: {
                                                xtype: 'pagingtoolbar',
                                                store: languageStore,
                                                displayInfo: true,
                                                displayMsg: '',
                                                emptyMsg: i18n.getKey('noData')
                                            }
                                        },
                                        diyGetValue: function () {
                                            var me = this;
                                            return me.getArrayValue();
                                        }
                                    },
                                    {
                                        xtype: 'sameupbtn',
                                    }
                                ]
                            }
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        dataIndex: 'colorCode',
                        text: i18n.getKey('colorCode'),
                        itemId: 'colorCode',
                        width: 150,
                        sortable: false,
                        hidden: me.resourceType.indexOf('Color') == -1,
                        tdCls: 'vertical-middle',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var rawRowNumber = record.get('rawRowNumber');
                            return {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'uxcolorfield',
                                        name: 'colorCode',
                                        allowBlank: false,
                                        readOnly: true,
                                        itemId: rawRowNumber + '_' + colIndex,
                                        flex: 1,
                                    },
                                    {
                                        xtype: 'sameupbtn',
                                    }
                                ]
                            }
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        dataIndex: 'thumbnail',
                        text: i18n.getKey('thumbnail'),
                        itemId: 'thumbnail',
                        width: 250,
                        sortable: false,
                        hidden: me.resourceType.indexOf('Color') != -1,
                        tdCls: 'vertical-middle',
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var rawRowNumber = record.get('rawRowNumber');
                            return {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'fileuploadv2',
                                        name: 'thumbnail',
                                        valueUrlType: 'part',
                                        allowBlank: false,
                                        fieldLabel: null,
                                        itemId: rawRowNumber + '_' + colIndex,
                                        flex: 1,
                                    },
                                    {
                                        xtype: 'sameupbtn',
                                    }
                                ]
                            }
                        }
                    },
                ],
            }
        ];
        me.bbar = {
            xtype: 'bottomtoolbar',
            saveBtnCfg: {
                xtype: 'button',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    if (win.isValid() == true) {
                        var data = win.getValue();
                        win.bathCreate(data);
                    }
                }
            }
        };
        me.callParent();
    },
})