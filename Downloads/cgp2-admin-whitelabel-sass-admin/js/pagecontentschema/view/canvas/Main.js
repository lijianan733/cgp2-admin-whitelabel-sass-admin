/**
 * Created by nan on 2020/8/27.
 */
Ext.onReady(function () {
    var pageContentSchemaId = JSGetQueryString('pageContentSchemaId');
    var controller = Ext.create('CGP.pagecontentschema.view.canvas.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('canvas'),
        block: 'pagecontentschema/canvas',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function (view) {
                    var builderConfigTab = window.parent.Ext.getCmp('PCSTab');
                    if (builderConfigTab) {
                        var url = path + 'partials/pagecontentschema/canvas/edit.html?pageContentSchemaId=' + pageContentSchemaId;
                        var canvas_edit = builderConfigTab.getComponent('canvas_edit');
                        builderConfigTab.remove(canvas_edit);
                        canvas_edit = {
                            id: 'canvas_edit',
                            itemId: 'canvas_edit',
                            title: i18n.getKey('create') + i18n.getKey('canvas'),
                            html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                            closable: true,
                            refresh: true,
                            isValid: function () {
                                return true;
                            },
                            getValue: function () {
                                return null;
                            },
                            setValue: function () {
                                return null;
                            }
                        };
                        var newPanel = builderConfigTab.add(canvas_edit);
                        builderConfigTab.setActiveTab(newPanel);
                    } else {
                        JSOpen({
                            id: 'canvas_edit',
                            url: path + 'partials/pagecontentschema/canvas/edit.html?pageContentSchemaId=' + pageContentSchemaId,
                            title: i18n.getKey('create') + '_' + i18n.getKey('canvas'),
                            refresh: true
                        });
                    }
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
                            controller.saveCanvas(data, pageContentSchemaId, store, 'deleteSuccess');
                        }
                    })
                }
            }
        },
        gridCfg: {
            store: Ext.create("CGP.pagecontentschema.view.canvas.store.Canvas", {
                pageContentSchemaId: pageContentSchemaId
            }),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            editActionHandler: function (grid, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作

                var builderConfigTab = window.parent.Ext.getCmp('PCSTab');
                if (builderConfigTab) {
                    var url = path + 'partials/pagecontentschema/canvas/edit.html?pageContentSchemaId=' + pageContentSchemaId + '&recordId=' + record.getId();
                    var canvas_edit = builderConfigTab.getComponent('canvas_edit');
                    builderConfigTab.remove(canvas_edit);
                    var canvas_edit = {
                        id: 'canvas_edit',
                        itemId: 'canvas_edit',
                        title: i18n.getKey('edit') + i18n.getKey('canvas'),
                        html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                        closable: true,
                        refresh: true,
                        isValid: function () {
                            return true;
                        },
                        getValue: function () {
                            return null;
                        },
                        setValue: function () {
                            return null;
                        }
                    };
                    var newPanel = builderConfigTab.add(canvas_edit);
                    builderConfigTab.setActiveTab(newPanel);
                } else {
                    JSOpen({
                        id: 'canvas_edit',
                        url: path + 'partials/pagecontentschema/canvas/edit.html?pageContentSchemaId=' + pageContentSchemaId + '&recordId=' + record.getId(),
                        title: i18n.getKey('edit') + '_' + i18n.getKey('canvas'),
                        refresh: true
                    });
                }

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
                        controller.saveCanvas(data, pageContentSchemaId, store, 'deleteSuccess');
                    }
                })
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id',
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 250,
                    itemId: 'description',
                },
                {
                    text: i18n.getKey('containPath'),
                    dataIndex: 'containPath',
                    itemId: 'containPath',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('containPath');
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" style="color: blue" )>' + i18n.getKey('containPath') + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                    var ela = Ext.fly(a);//获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        JSShowJsonDataV2(value, i18n.getKey('check') + i18n.getKey('containPath'), {})
                                    });
                                }
                            }
                        };
                    }
                },
                {
                    text: i18n.getKey('constraints'),
                    dataIndex: 'constraints',
                    itemId: 'constraints',
                    xtype: 'componentcolumn',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('constraints');
                        if (value && value.length > 0) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + i18n.getKey('check') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2({constraints: value}, i18n.getKey('check') + i18n.getKey('constraints'), {})
                                        });
                                    }
                                }
                            };
                        }
                    }
                },
                {
                    text: i18n.getKey('intentions'),
                    dataIndex: 'intentions',
                    itemId: 'intentions',
                    xtype: 'componentcolumn',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('intention');
                        if (value && value.length > 0) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + i18n.getKey('check') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2({intention: value}, i18n.getKey('check') + i18n.getKey('intention'), {})
                                        });
                                    }
                                }
                            };
                        }
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            hidden: true,
        }
    });
});
