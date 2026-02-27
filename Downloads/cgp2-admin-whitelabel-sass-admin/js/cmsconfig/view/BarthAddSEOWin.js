/**
 * @Description:
 * @author nan
 * @date 2022/5/16
 */
Ext.Loader.syncRequire([])
Ext.define('CGP.cmsconfig.view.BarthAddSEOWin', {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    maximizable: true,
    layout: 'fit',
    outGird: null,
    record: null,
    outGrid: null,
    cls: 'windowCenter',
    shadow: false,// 需要注意的是该元素必须是绝对定位的,故现在没法使用该配置*/
    bbar: {
        xtype: 'bottomtoolbar',
        lastStepBtnCfg: {
            hidden: false,
            iconCls: '',
            text: '转换特殊字符',
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                var grid = win.getComponent('grid');
                var fields = grid.query('[xtype=textfield]');
                fields.map(function (item) {
                    var uxtextarea = item;
                    var oldStr = uxtextarea.getValue();
                    var newStr = JSHtmlEnCode(oldStr);
                    uxtextarea.setValue(newStr);
                });
            }
        },
        saveBtnCfg: {
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                var grid = win.items.items[0];
                var fields = grid.query('[isFormField]');
                var isValid = true;
                fields.map(function (item) {
                    if (item.isValid() == false) {
                        isValid = false;
                    }
                });
                if (isValid) {
                    var store = grid.store;
                    var result = [];
                    store.data.items.map(function (item) {
                        var itemData = item.getData();
                        var resultItem = {};
                        if (itemData.keyName == 'name') {
                            resultItem.name = itemData.keyValue;
                        } else if (itemData.keyName == 'property') {
                            resultItem.property = itemData.keyValue;
                        } else if (itemData.keyName == 'httpEquiv') {
                            resultItem.httpEquiv = itemData.keyValue;
                        }
                        resultItem.content = itemData.contentValue;
                        result.push(resultItem);
                    });
                    console.log(result);
                    var proxyData = win.outGrid.store.proxy.data;
                    win.outGrid.store.proxy.data = proxyData.concat(result);
                    win.outGrid.store.load();
                    win.close();
                }
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.title = '批量导入meta';
        me.items = [
            {
                xtype: 'grid',
                width: 750,
                itemId: 'grid',
                store: {
                    xtype: 'store',
                    fields: [
                        'keyName', 'keyValue', 'contentValue'
                    ],
                    data: [
                        {
                            keyName: 'property',
                            keyValue: 'og:title',
                            contentValue: 'Title Here'
                        }, {
                            keyName: 'property',
                            keyValue: 'og:type',
                            contentValue: 'article'
                        }, {
                            keyName: 'property',
                            keyValue: 'og:url',
                            contentValue: 'http://www.example.com/'
                        },
                        {
                            keyName: 'property',
                            keyValue: 'og:image',
                            contentValue: 'http://example.com/image.jpg'
                        }, {
                            keyName: 'property',
                            keyValue: 'og:description',
                            contentValue: 'Description Here'
                        }, {
                            keyName: 'property',
                            keyValue: 'og:site_name',
                            contentValue: 'Site Name'
                        },
                        {
                            keyName: 'property',
                            keyValue: 'article:published_time',
                            contentValue: '2013-09-17T05:59:00+01:00'
                        }, {
                            keyName: 'property',
                            keyValue: 'article:modified_time',
                            contentValue: '2013-09-16T19:08:47+01:00'
                        }, {
                            keyName: 'property',
                            keyValue: 'article:section',
                            contentValue: 'Article Section'
                        },
                        {
                            keyName: 'property',
                            keyValue: 'article:tag',
                            contentValue: 'Article Tag'
                        }, {
                            keyName: 'property',
                            keyValue: 'fb:admins',
                            contentValue: 'Facebook numberic ID'
                        }
                    ]
                },
                hideHeaders: true,
                columns: [
                    {
                        xtype: 'rownumberer',
                        tdCls: 'vertical-middle',
                    },
                    {
                        width: 60,
                        renderer: function () {
                            return '&lt;meta ';
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        dataIndex: 'keyName',
                        renderer: function (value, metaData, record) {
                            return {
                                xtype: 'combo',
                                displayField: 'display',
                                valueField: 'value',
                                name: 'keyName',
                                itemId: 'keyName',
                                allowBlank: false,
                                width: 150,
                                value: JSHtmlEnCode(value),
                                editable: false,
                                margin: '0 5',
                                vtype: 'forbidSpecialChars',
                                store: {
                                    xtype: 'store',
                                    fields: [
                                        'value',
                                        'display'
                                    ],
                                    data: [
                                        {
                                            value: 'name',
                                            display: 'name'
                                        },
                                        {
                                            value: 'property',
                                            display: 'property'
                                        },
                                        /* {
                                             value: 'itemprop',
                                             display: 'itemprop'
                                         },*/
                                        {
                                            value: 'httpEquiv',
                                            display: 'httpEquiv'
                                        }
                                    ]
                                },
                                listeners: {
                                    change: function (field, newValue, oldValue) {
                                        record.beginEdit();
                                        record.set('keyName', newValue);
                                        record.endEdit(true);
                                    }
                                }
                            }
                        }
                    },
                    {
                        width: 40,
                        renderer: function () {
                            return ' = "';
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        dataIndex: 'keyValue',
                        flex: 1,
                        renderer: function (value, metaData, record) {
                            return {
                                xtype: 'textfield',
                                displayField: 'keyValue',
                                valueField: 'keyValue',
                                itemId: 'keyValue',
                                width: 150,
                                value: JSHtmlEnCode(value),
                                allowBlank: false,
                                name: 'keyValue',
                                vtype: 'forbidSpecialChars',
                                listeners: {
                                    change: function (field, newValue, oldValue) {
                                        record.beginEdit();
                                        record.set('keyValue', newValue);
                                        record.endEdit(true);
                                    }
                                }
                            }
                        }
                    },
                    {
                        width: 90,
                        renderer: function () {
                            return '" content="';
                        }
                    },
                    {
                        width: 250,
                        xtype: 'componentcolumn',
                        dataIndex: 'contentValue',
                        flex: 1,
                        renderer: function (value, metaData, record) {
                            return {
                                xtype: 'textfield',
                                grow: true,
                                rows: 1,
                                width: 250,
                                minHeight: 24,
                                growMin: 10,
                                value: JSHtmlEnCode(value),
                                itemId: 'contentValue',
                                allowBlank: false,
                                name: 'contentValue',
                                vtype: 'forbidSpecialChars',
                                anchor: '100%',
                                listeners: {
                                    change: function (field, newValue, oldValue) {
                                        record.beginEdit();
                                        record.set('contentValue', newValue);
                                        record.endEdit(true);
                                    }
                                }
                            }
                        }
                    },
                    {
                        width: 40,
                        renderer: function () {
                            return '"&gt;'
                        }
                    },
                ]
            }
        ];
        me.callParent();
    }
})