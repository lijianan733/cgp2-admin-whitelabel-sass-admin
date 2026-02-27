/**
 * Created by admin on 2019/4/10.
 */
Ext.onReady(function () {

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('dssheettemplateconfig'),
        block: 'dssheettemplateconfig',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,
        gridCfg: {
            store: Ext.create("CGP.dssheettemplateconfig.store.SheetTemplateConfig"),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },

            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: '_id',
                    sortable: true
                },
                {
                    text: i18n.getKey('productType'),
                    dataIndex: 'productType',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'productType',
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('templateFileName'),
                    dataIndex: 'templateFileName',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'templateFileName',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('sheetType'),
                    dataIndex: 'sheetType',
                    xtype: 'gridcolumn',
                    width: 80,
                    itemId: 'sheetType',
                    sortable: true
                },
                {
                    text: i18n.getKey('index'),
                    dataIndex: 'index',
                    xtype: 'gridcolumn',
                    width: 80,
                    itemId: 'index',
                    sortable: true
                },

                {
                    text: i18n.getKey('dataSourceId'),
                    dataIndex: 'dataSourceId',
                    xtype: 'componentcolumn',
                    itemId: 'dataSourceId',
                    sortable: false,
                    width: 90,

                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看dataSource"';
                        if (value == 0) {
                            return "";
                        }
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" id="click-dataSource" style="color: blue;text-decoration: none">' + value + '</a>',
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById('click-dataSource');
                                    clickElement.addEventListener('click', function () {
                                        JSOpen({
                                            id: 'dataSourcepepage',
                                            url: path + 'partials/dsdatasource/main.html?dataSourceId=' + value,
                                            title: i18n.getKey('dataSource'),
                                            refresh: true
                                        })
                                    }, false);

                                }
                            }
                        }
                    }

                },
                {
                    text: i18n.getKey('strategy'),
                    dataIndex: 'strategy',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'strategy',
                    sortable: true
                },
                {
                    text: i18n.getKey('condition'),
                    dataIndex: 'condition',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'condition',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('fileNameSuffix'),
                    dataIndex: 'fileNameSuffix',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'fileNameSuffix'
                },
                {
                    text: i18n.getKey('textTemplateFileName'),
                    dataIndex: 'textTemplateFileName',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'textTemplateFileName'
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    width: 100,
                    itemId: 'description',
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('impressionPlaceholders'),
                    dataIndex: 'impressionPlaceholders',
                    xtype: 'componentcolumn',
                    width: 120,
                    itemId: 'impressionPlaceholders',
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            var strValue = JSON.stringify(value, null, "\t");
//                        var impPlaceholders=Ext.create('CGP.dssheettemplateconfig.view.impplaceholders',{
//                            fieldLabel: false,
//                            width: 800,
//                            height: 400
//                        });
//                        var sheetTemplateModel =Ext.create("CGP.dssheettemplateconfig.model.SheetTemplateConfig",record);
                            metadata.tdAttr = 'data-qtip="查看impressionPlaceholders"';
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" id="click-imPlaceholders" style="color: blue;text-decoration: none">' + i18n.getKey('impressionPlaceholders') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var clickElement = document.getElementById('click-imPlaceholders');
                                        clickElement.addEventListener('click', function () {
                                            var win = Ext.create("Ext.window.Window", {
                                                itemId: "imPlaceholders",
                                                modal: true,
                                                layout: 'fit',
                                                title: i18n.getKey('impressionPlaceholders'),
                                                items: [
                                                    {
                                                        xtype: 'textarea',
                                                        fieldLabel: false,
                                                        width: 600,
                                                        height: 400,
                                                        value: strValue
                                                    }
//                                                impPlaceholders
                                                ]
                                            });
//                                        var me=win.items.items[0];
//                                        var store = me.gridConfig.store;
//                                        if (Ext.isArray(value)) {
//                                            store.loadData(value);
//                                        }
                                            win.show();
                                        }, false);

                                    }
                                }
                            }
                        } else {
                            return "";
                        }
                    }
                },
                {
                    text: i18n.getKey('placeholders'),
                    dataIndex: 'placeholders',
                    xtype: 'componentcolumn',
                    width: 120,
                    flex: 1,
                    itemId: 'placeholders',
                    renderer: function (value, metadata, record) {
                        if (value) {
                            var strValue = JSON.stringify(value, null, "\t");
                            metadata.tdAttr = 'data-qtip="查看Placeholders"';
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" id="click-placeholders" style="color: blue;text-decoration: none">' + i18n.getKey('placeholders') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var clickElement = document.getElementById('click-placeholders');
                                        clickElement.addEventListener('click', function () {
                                            var win = Ext.create("Ext.window.Window", {
                                                itemId: "placeholders",
                                                modal: true,
                                                layout: 'fit',
                                                title: i18n.getKey('placeholders'),
                                                items: [
                                                    {
                                                        xtype: 'textarea',
                                                        fieldLabel: false,
                                                        width: 600,
                                                        height: 400,
                                                        value: strValue
                                                    }
                                                ]
                                            });
                                            win.show();
                                        }, false);

                                    }
                                }
                            }
                        } else {
                            return "";
                        }
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            layout: {
                type: 'table',
                columns: 4
            },
            defaults: {
                isLike: false
            },
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'numberfield',
                    listeners: {
                        render: function (comp) {
                            var pageContentSchemaId = getQueryString('dataSourceId');
                            if (pageContentSchemaId) {
                                comp.setValue(pageContentSchemaId);
                            }
                        }
                    },
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'productType',
                    name: 'productType',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('productType'),
                    itemId: 'productType'
                },
                {
                    id: 'sheetType',
                    name: 'sheetType',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('sheetType'),
                    itemId: 'sheetType'
                },
                {
                    id: 'templateFileName',
                    name: 'templateFileName',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('templateFileName'),
                    itemId: 'templateFileName'
                },
                {
                    id: 'index',
                    name: 'index',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('index'),
                    itemId: 'index'
                },
                {
                    id: 'dataSourceId',
                    name: 'dataSourceId',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('dataSourceId'),
                    itemId: 'dataSourceId'
                },
                {
                    id: 'description',
                    name: 'description',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                }
            ]
        }

    });

});