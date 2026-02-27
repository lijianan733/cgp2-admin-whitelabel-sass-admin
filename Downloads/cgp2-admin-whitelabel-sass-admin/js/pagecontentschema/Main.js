Ext.onReady(function () {

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('pagecontentschema'),
        block: 'pagecontentschema',
        editPage: 'edit.html',
        //权限控制
        accessControl: true,
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
                            text: i18n.getKey('gameTile') + i18n.getKey('template') + i18n.getKey('create') + '(svg)',
                            handler: function (btn) {
                                Ext.create('CGP.pagecontentschema.view.batchgeneratepcsstruct.BatchCreateWin')
                            }
                        },
                        {
                            text: i18n.getKey('upload') + i18n.getKey('PCS') + i18n.getKey('create'),
                            handler: function (btn) {
                                Ext.create('CGP.pagecontentschema.view.uploadpcstemplate.TemplateCreateWin')
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
            }
        },
        gridCfg: {
            store: Ext.create("CGP.pagecontentschema.store.PageContentSchema"),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },

            columns: [
                {
                    sortable: false,
                    text: i18n.getKey('operation'),
                    width: 100,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            style: 'padding:0',
                            default: {
                                width: 100
                            },
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                            {
                                                text: i18n.getKey('Canvas'),
                                                disabledCls: 'menu-item-display-none',
                                                //预览页面
                                                handler: function () {
                                                    JSOpen({
                                                        id: 'canvas',
                                                        url: path + 'partials/pagecontentschema/canvas/main.html?pageContentSchemaId=' + record.getId(),
                                                        title: i18n.getKey('canvas'),
                                                        refresh: true
                                                    })
                                                }
                                            },
                                            {
                                                text: i18n.getKey('PageContentItemPlaceholder'),
                                                disabledCls: 'menu-item-display-none',
                                                //预览页面
                                                handler: function () {
                                                    JSOpen({
                                                        id: 'pageContentItemPlaceholders',
                                                        url: path + 'partials/pagecontentschema/pagecontentitemplaceholders/main.html?pageContentSchemaId=' + record.getId(),
                                                        title: i18n.getKey('pageContentItemPlaceholders'),
                                                        refresh: true
                                                    })
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }, {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: '_id',
                    sortable: true
                },
                {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    xtype: 'gridcolumn',
                    width: 80,
                    itemId: 'code',
                    sortable: true
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'name',
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    itemId: 'description',
                    sortable: false,
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('width'),
                    dataIndex: 'width',
                    xtype: 'gridcolumn',
                    width: 80,
                    itemId: 'width'
                },
                {
                    text: i18n.getKey('height'),
                    dataIndex: 'height',
                    xtype: 'gridcolumn',
                    width: 80,
                    itemId: 'height'
                },
                {
                    text: i18n.getKey('pageContentSchemaGroup'),
                    dataIndex: 'pageContentSchemaGroup',
                    xtype: 'gridcolumn',
                    width: 80,
                    itemId: 'pageContentSchemaGroup',
                    renderer: function (value) {
                        if (!Ext.isEmpty(value)) {
                            return value._id
                        }
                    }
                },
                {
                    text: i18n.getKey('rtType'),
                    dataIndex: 'rtType',
                    xtype: 'gridcolumn',
                    width: 80,
                    itemId: 'rtType',
                    renderer: function (value) {
                        if (!Ext.isEmpty(value)) {
                            return value._id
                        }
                    }
                },
                {
                    text: i18n.getKey('clipPath'),
                    dataIndex: 'clipPath',
                    xtype: 'componentcolumn',
                    width: 180,
                    itemId: 'clipPath',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            metadata.tdAttr = 'data-qtip="查看clipPath"';
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + i18n.getKey('clipPath') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2(value, i18n.getKey('clipPath'));
                                        });
                                    }
                                }
                            };

                        }
                    }
                },
                {
                    text: i18n.getKey('priceAreas'),
                    dataIndex: 'priceAreas',
                    xtype: 'componentcolumn',
                    width: 180,
                    itemId: 'priceAreas',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('priceAreas');
                            var valueString = JSON.stringify(value, null, "\t");
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + i18n.getKey('priceAreas') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2({priceAreas: value}, i18n.getKey('priceAreas'));
                                        });
                                    }
                                }
                            };
                        }
                    }
                },
                {
                    text: i18n.getKey('layers'),
                    dataIndex: 'layers',
                    xtype: 'componentcolumn',
                    width: 180,
                    itemId: 'layers',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('layers');
                            var valueString = JSON.stringify(value, null, "\t");
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + i18n.getKey('layers') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2({layers: value}, i18n.getKey('layers'));
                                        });
                                    }
                                }
                            };
                        }
                    }
                },
                {
                    text: i18n.getKey('canvases'),
                    dataIndex: 'canvases',
                    xtype: 'componentcolumn',
                    width: 180,
                    itemId: 'canvases',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('canvases');
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + i18n.getKey('canvases') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2({canvases: value}, i18n.getKey('canvases'));
                                        });
                                    }
                                }
                            };
                        }
                    }
                },
                {
                    text: i18n.getKey('displayObjectConstraints'),
                    dataIndex: 'displayObjectConstraints',
                    xtype: 'componentcolumn',
                    width: 180,
                    itemId: 'displayObjectConstraints',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('displayObjectConstraints');
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + i18n.getKey('displayObjectConstraints') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2({displayObjectConstraints: value}, i18n.getKey('displayObjectConstraints'));
                                        });
                                    }
                                }
                            };
                        }
                    }
                },
                {
                    text: i18n.getKey('pageContentItemPlaceholders'),
                    dataIndex: 'pageContentItemPlaceholders',
                    xtype: 'componentcolumn',
                    width: 250,
                    itemId: 'pageContentItemPlaceholders',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('pageContentItemPlaceholders');
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + i18n.getKey('pageContentItemPlaceholders') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2({pageContentItemPlaceholders: value}, i18n.getKey('pageContentItemPlaceholders'));
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
            height: 120,
            defaults: {
                isLike: false
            },
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    listeners: {
                        render: function (comp) {
                            var pageContentSchemaId = getQueryString('pageContentSchemaId');
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
                    id: 'code',
                    name: 'code',
                    xtype: 'textfield',
                    hideTrigger: true,
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
                    id: 'descriptionSearchField',
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                }
            ]
        }

    });
});
