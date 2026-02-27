Ext.onReady(function () {

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    // 创建一个GridPage控件
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('materialViewType'),
        block: 'materialviewtype',
        // 编辑页面
        editPage: 'edit.html',

        gridCfg: {
            // store是指store.js
            store: Ext.create("CGP.materialviewtype.store.Store"),
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
                    itemId: '_id',
                    sortable: true
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('config'),
                    dataIndex: 'config',
                    xtype: 'gridcolumn',
                    itemId: 'config',
                    sortable: true
                },
                {
                    text: i18n.getKey('pageContentSchema'),
                    dataIndex: 'pageContentSchema',
                    xtype: 'componentcolumn',
                    width: 150,
                    itemId: 'pageContentSchema',
                    renderer: function (value, metadata) {

                        if (!Ext.isEmpty(value)) {
                            metadata.tdAttr = 'data-qtip="' + i18n.getKey('check') + i18n.getKey('pageContentSchema') + '"';
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + value['_id'] + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);
                                        ela.on("click", function () {
                                            JSOpen({
                                                id: 'pagecontentschemapage',
                                                url: path + 'partials/pagecontentschema/main.html?pageContentSchemaId=' + value['_id'],
                                                title: i18n.getKey('pageContentSchema'),
                                                refresh: true
                                            })
                                        });
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    width: 180,
                    itemId: 'description',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('userAssign'),
                    dataIndex: 'userAssign',
                    xtype: 'gridcolumn',
                    itemId: 'userAssign',
                    sortable: true
                },
                {
                    text: i18n.getKey('pageContentStrategy'),
                    dataIndex: 'pageContentStrategy',
                    xtype: 'gridcolumn',
                    minWidth: 120,
                    itemId: 'pageContentStrategy'
                },
                {
                    text: i18n.getKey('pageContentFetchStrategy'),
                    dataIndex: 'pageContentFetchStrategy',
                    xtype: 'gridcolumn',
                    itemId: 'pageContentFetchStrategy'
                },
                {
                    text: i18n.getKey('pageContentIndexExpression'),
                    dataIndex: 'pageContentIndexExpression',
                    xtype: 'gridcolumn',
                    itemId: 'pageContentIndexExpression'
                },
                {
                    text: i18n.getKey('sequenceNumber'),
                    dataIndex: 'sequenceNumber',
                    xtype: 'gridcolumn',
                    itemId: 'sequenceNumber'
                },
                {
                    text: i18n.getKey('designType'),
                    dataIndex: 'designType',
                    xtype: 'gridcolumn',
                    itemId: 'designType',
                    renderer: function (value) {
                        if (!Ext.isEmpty(value)) {
                            return value['_id'];
                        }
                    }
                },
                {
                    text: i18n.getKey('predesignObject'),
                    dataIndex: 'predesignObject',
                    xtype: 'gridcolumn',
                    itemId: 'predesignObject',
                    renderer: function (value) {
                        if (!Ext.isEmpty(value)) {
                            return value['_id'];
                        }
                    }
                },
                {
                    text: i18n.getKey('mainVariableDataSource'),
                    dataIndex: 'mainVariableDataSource',
                    xtype: 'gridcolumn',
                    itemId: 'mainVariableDataSource',
                    renderer: function (value) {
                        if (!Ext.isEmpty(value)) {
                            return value['_id'];
                        }
                    }
                },
                {
                    text: i18n.getKey('templateType'),
                    dataIndex: 'templateType',
                    xtype: 'componentcolumn',
                    width: 180,
                    itemId: 'templateType',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            var valueString = JSON.stringify(value, null, "\t");
                            metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('templateType');
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + i18n.getKey('templateType') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2(value, i18n.getKey('templateType'));
                                        });
                                    }
                                }
                            };
                        }

                    }
                },
                {
                    text: i18n.getKey('pcsPlaceholders'),
                    dataIndex: 'pcsPlaceholders',
                    xtype: 'componentcolumn',
                    width: 180,
                    itemId: 'pcsPlaceholders',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('pcsPlaceholders');
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + i18n.getKey('pcsPlaceholders') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2({pcsPlaceholders: value}, i18n.getKey('pcsPlaceholders'));
                                        });
                                    }
                                }
                            };
                        }
                    }
                },
                {
                    text: i18n.getKey('dsDataSource'),
                    dataIndex: 'dsDataSource',
                    xtype: 'componentcolumn',
                    width: 180,
                    itemId: 'dsDataSource',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('dsDataSource');
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + i18n.getKey('dsDataSource') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2(value, i18n.getKey('dsDataSource'));
                                        });
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    text: i18n.getKey('pageContentRange'),
                    dataIndex: 'pageContentRange',
                    xtype: 'componentcolumn',
                    width: 180,
                    itemId: 'pageContentRange',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('pageContentRange');
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + i18n.getKey('pageContentRange') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2(value, i18n.getKey('pageContentRange'));
                                        });
                                    }
                                }
                            };
                        }
                    }
                },
                {
                    text: i18n.getKey('pageContentInstanceRange'),
                    dataIndex: 'pageContentInstanceRange',
                    xtype: 'componentcolumn',
                    width: 180,
                    itemId: 'pageContentInstanceRange',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('pageContentInstanceRange');
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue" )>' + i18n.getKey('pageContentInstanceRange') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSShowJsonDataV2(value, i18n.getKey('pageContentInstanceRange'));
                                        });
                                    }
                                }
                            };
                        }
                    }
                }
            ]
        },

        // 查询输入框
        filterCfg: {
            minHeight: 120,
            defaults: {
                isLike: false
            },
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    hideTrigger: true,
                    listeners: {
                        render: function (comp) {
                            var materialViewTypeId = getQueryString('materialViewTypeId');
                            if (materialViewTypeId) {
                                comp.setValue(materialViewTypeId);
                            }
                        }
                    },
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                },
                {
                    id: 'pageContentSchema',
                    name: 'pageContentSchema._id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('pageContent Schema'),
                    itemId: 'pageContentSchema'
                },
                {
                    id: 'nameSearchField',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    id: 'config',
                    name: 'locale',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('config'),
                    itemId: 'config'
                },
                {
                    id: 'userAssign',
                    name: 'userAssign',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('userAssign'),
                    itemId: 'userAssign'
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
