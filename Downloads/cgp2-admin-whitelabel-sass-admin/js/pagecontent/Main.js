/**
 * Created by nan on 2020/12/14
 */
Ext.onReady(function () {
    // 用于下面的资源
    // 初始化资源
    var store = Ext.create('CGP.pagecontent.store.PageContentStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('pageContent'),
        block: 'pagecontent',
        editPage: 'edit.html',
        //权限控制
        tbarCfg: {
            btnCreate: {
                xtype: 'splitbutton',
                text: i18n.getKey('add'),
                width: 100,
                iconCls: 'icon_add',
                menu: {
                    items: [{
                        text: i18n.getKey('通用新建'),
                        handler: function (btn) {
                            var button = btn.ownerCt.ownerButton;
                            var form = button.ownerCt.ownerCt;
                            JSOpen({
                                id: page.block + '_edit',
                                url: path + "partials/" + page.block + "/" + page.editPage,
                                title: i18n.getKey('create') + '_' + page.i18nblock,
                                refresh: true
                            });
                        }
                    },
                        {
                            text: i18n.getKey('last month PC') + i18n.getKey('create') + '(svg)',
                            handler: function (btn) {
                                Ext.create('CGP.pagecontent.view.calendarpcsstruct.CreateWin')
                            }
                        }]
                },
                handler: function () {
                    JSOpen({
                        id: page.block + '_edit',
                        url: path + "partials/" + page.block + "/" + page.editPage,
                        title: i18n.getKey('create') + '_' + page.i18nblock,
                        refresh: true
                    });
                }
            },
            btnConfig: {
                width: 150,
                disabled: false,
                text: i18n.getKey('JSON数据批量新建'),
                handler: function (btn) {
                    var grid = btn.ownerCt.ownerCt;
                    var controller = Ext.create('CGP.pagecontent.controller.Controller');
                    controller.batchCreatePageContent(grid);

                }
            }/*,
        hiddenButtons: [],//按钮的名称
        disabledButtons: ['create', 'delete', 'config']//按钮的名称*/
        },
        gridCfg: {
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
                    itemId: 'id',
                },
                {
                    text: i18n.getKey('index'),
                    dataIndex: 'index',
                    itemId: 'index',
                }, {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    width: 200,
                    itemId: 'code'
                }, {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 200,
                    itemId: 'name'
                }, {
                    text: i18n.getKey('height'),
                    dataIndex: 'height',
                    itemId: 'height'
                }, {
                    text: i18n.getKey('height'),
                    dataIndex: 'height',
                    itemId: 'height'
                },
                {
                    text: i18n.getKey('generateMode'),
                    dataIndex: 'generateMode',
                    itemId: 'generateMode',
                    renderer: function (value, mateData, record) {
                        if (value == 'manual') {
                            return '人工创建'
                        } else {
                            return '自动创建'
                        }
                    }

                }, {
                    text: i18n.getKey('layers'),
                    dataIndex: 'layers',
                    itemId: 'layers',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看"';
                        if (value) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>查看</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2(value, '查看layers');
                                        });
                                    }
                                }
                            };
                        }
                    }
                }, {
                    text: i18n.getKey('rtObject'),
                    dataIndex: 'rtObject',
                    itemId: 'rtObject',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看"';
                        if (value) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>查看</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2(value, '查看rtObject');
                                        });
                                    }
                                }
                            };
                        }
                    }
                }, {
                    text: i18n.getKey('clipPath'),
                    dataIndex: 'clipPath',
                    itemId: 'clipPath',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看"';
                        if (value) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>查看</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2(value, '查看clipPath');
                                        });
                                    }
                                }
                            };
                        }
                    }
                }, {
                    text: i18n.getKey('pageContentSchemaId'),
                    dataIndex: 'pageContentSchemaId',
                    itemId: 'pageContentSchemaId',
                    xtype: 'componentcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看"';
                        if (value) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + value + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSOpen({
                                                id: 'pagecontentschemapage',
                                                title: i18n.getKey('pageContentSchema'),
                                                url: path + 'partials/pagecontentschema/main.html?_id=' + value,
                                                refresh: true
                                            });
                                        });
                                    }
                                }
                            };
                        }
                    }
                }, {
                    text: i18n.getKey('templateId'),
                    dataIndex: 'templateId',
                    itemId: 'templateId',
                    flex: 1,

                }]
        },
        // 查询输入框
        filterCfg: {
            minHeight: 120,
            items: [{
                name: '_id',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('id'),
                itemId: 'id',
                isLike: false,
            }, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                name: 'generateMode',
                xtype: 'combo',
                valueField: 'value',
                displayField: 'display',
                editable: false,
                isLike: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [{
                        value: 'auto',
                        display: '自动创建'
                    }, {
                        value: 'manual',
                        display: '人工创建'
                    }]
                }),
                value: 'manual',
                hidden: true,
                allowReset: false,
                fieldLabel: i18n.getKey('generateMode'),
                itemId: 'generateMode'
            }
            ]
        }
    });
});
