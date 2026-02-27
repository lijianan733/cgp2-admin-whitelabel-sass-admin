/**
 * Created by nan on 2020/8/27.
 */
Ext.onReady(function () {
    var pageContentSchemaId = JSGetQueryString('pageContentSchemaId');
    var controller = Ext.create('CGP.pagecontentschema.view.pagecontentitemplaceholders.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('PageContentItemPlaceholders'),
        block: 'pagecontentschema/pageContentItemPlaceholders',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function (view) {
                    JSOpen({
                        id: 'pagecontentitemplaceholders_edit',
                        url: path + 'partials/pagecontentschema/pagecontentitemplaceholders/edit.html?pageContentSchemaId=' + pageContentSchemaId,
                        title: i18n.getKey('create') + '_' + i18n.getKey('pagecontentitemplaceholders'),
                        refresh: true
                    });
                }
            },
            btnDelete: {
                handler: function (view) {
                    var grid = view.ownerCt.ownerCt;
                    var store = grid.store;
                    var selected = grid.getSelectionModel().getSelection();
                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteSelectedComfirm'), function (selector) {
                        if (selector == 'yes') {
                            store.remove(selected);
                            var data = [];
                            for (var i = 0; i < store.getCount(); i++) {
                                data.push(store.getAt(i).getData());
                            }
                            console.log(data);
                            controller.savePageContentItemPlaceholder(data, pageContentSchemaId, store, 'deleteSuccess');
                        }
                    })
                }
            }
        },
        gridCfg: {
            store: Ext.create("CGP.pagecontentschema.view.pagecontentitemplaceholders.store.PageContentItemPlaceholder", {
                pageContentSchemaId: pageContentSchemaId
            }),
            frame: false,
            columnDefaults: {
                width: 200,
                autoSizeColumn: true
            },
            editActionHandler: function (grid, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                JSOpen({
                    id: 'pagecontentitemplaceholders_edit',
                    url: path + 'partials/pagecontentschema/pagecontentitemplaceholders/edit.html?pageContentSchemaId=' + pageContentSchemaId + '&recordId=' + record.getId(),
                    title: i18n.getKey('edit') + '_' + i18n.getKey('pagecontentitemplaceholders'),
                    refresh: true
                });
            },
            deleteActionHandler: function (grid, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                var store = grid.store;
                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                    if (selector == 'yes') {
                        store.remove(record);
                        var data = [];
                        for (var i = 0; i < store.getCount(); i++) {
                            data.push(store.getAt(i).getData());
                        }
                        console.log(data);
                        controller.savePageContentItemPlaceholder(data, pageContentSchemaId, store, 'deleteSuccess');
                    }
                })
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id',
                    width: 100
                },
                {
                    text: i18n.getKey('itemSelector'),
                    dataIndex: 'itemSelector',
                    itemId: 'itemSelector',
                },
                {
                    text: i18n.getKey('itemAttributes'),
                    dataIndex: 'itemAttributes',
                    itemId: 'itemAttributes',
                    renderer: function (value, metadata, record) {
                        return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                    }
                },
                {
                    text: i18n.getKey('dataSource'),
                    dataIndex: 'dataSource',
                    itemId: 'dataSource',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('dataSource');
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" style="color: blue" )>' + value._id + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                    var ela = Ext.fly(a);//获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        JSOpen({
                                            id: 'variableDataSourcepage',
                                            url: path + 'partials/variabledatasource/main.html?_id=' + value._id,
                                            title: i18n.getKey('variableDataSourcepage'),
                                            refresh: true
                                        })
                                    });
                                }
                            }
                        };
                    }
                },
                {
                    text: i18n.getKey('expression'),
                    dataIndex: 'expression',
                    itemId: 'expression',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('expression');
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" style="color: blue" )>' + i18n.getKey('expression') + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                    var ela = Ext.fly(a);//获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        JSShowJsonData(value, i18n.getKey('check') + i18n.getKey('expression'), {})
                                    });
                                }
                            }
                        };
                    }

                },
                {
                    text: i18n.getKey('variableDataIndexExpression'),
                    dataIndex: 'variableDataIndexExpression',
                    itemId: 'variableDataIndexExpression',
                    xtype: 'componentcolumn',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('variableDataIndexExpression');
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" style="color: blue" )>' + i18n.getKey('variableDataIndexExpression') + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                    var ela = Ext.fly(a);//获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        JSShowJsonData(value, i18n.getKey('check') + i18n.getKey('variableDataIndexExpression'), {})
                                    });
                                }
                            }
                        }
                    }
                }
            ]
        },
        filterCfg: {
            hidden: true
        }
    });
});
