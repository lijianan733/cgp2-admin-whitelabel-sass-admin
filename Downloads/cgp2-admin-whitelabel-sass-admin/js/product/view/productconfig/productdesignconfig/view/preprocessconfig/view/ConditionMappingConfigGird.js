/**
 * Created by nan on 2020/2/24.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.ConditionMappingConfigGird', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.conditionmappingconfiggird',
    title: i18n.getKey('conditionMappingConfig'),
    designId: null,
    checkOnly: false,//是否只能查看
    getValue: function () {
        var me = this;
        var conditionMappingConfigs = [];
        for (var i = 0; i < me.store.getCount(); i++) {
            conditionMappingConfigs.push(me.store.getAt(i).getData());
        }
        return {
            conditionMappingConfigs: conditionMappingConfigs
        };
    },
    setValue: function (data) {
        var me = this;
        me.store.add(data);

    },
    isValid: function () {
        var me = this;
        var isValid = me.store.getCount() > 0;
        if (isValid == false) {
            me.ownerCt.setActiveTab(me);
            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('conditionMappingConfig') + i18n.getKey('不予许为空'));
        }
        return isValid;
    },
    initComponent: function () {
        var me = this;
        var SourceConfigStore2 = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.SourceConfigStore', {
            storeId: 'sourceMaterialViewTypeDataSourceStore2',
            autoLoad: false,
            params: {
                filter: Ext.JSON.encode([{
                    name: 'designId',
                    type: 'string',
                    value: me.designId
                }])
            }
        });
        me.store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'description',
                    type: 'string'
                }, {
                    name: 'condition',
                    type: 'string'
                },
                {
                    name: 'valueExCondition',//valueExCondition的优先级高于condition
                    type: 'object'
                }, {
                    name: 'priority',
                    type: 'number'
                }, {
                    name: 'pageContentTargetMappingConfigs',
                    type: 'array'
                }, {
                    name: 'clazz',
                    type: 'string',
                    defaultValue: 'com.qpp.cgp.domain.preprocess.config.ConditionMappingConfig'
                }
            ],
            data: [],
        });
        me.tbar = {
            hidden: me.checkOnly,
            items: [
                {
                    xtype: 'button',
                    iconCls: 'icon_add',
                    text: i18n.getKey('add'),
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;
                        var sourceMaterialViewTypes = Ext.getCmp('sourceMaterialViewTypes').getSubmitValue() || [];
                        /*  var store = Ext.data.StoreManager.get('sourceMaterialViewTypeDataSourceStore2')
                          store.filterBy(function (item) {
                              return Ext.Array.contains(sourceMaterialViewTypes, item.getId());
                          })*/
                        var store = Ext.data.StoreManager.getByKey('sourceMaterialViewTypeDataSourceStore2');
                        store.proxy.extraParams = {
                            filter: Ext.JSON.encode([{
                                "name": "includeIds",
                                "type": "string",
                                "value": "[" + sourceMaterialViewTypes + "]"
                            }])
                        };
                        store.load();
                        var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.EditConditionMappingConfigWin', {
                            createOrEdit: 'create',
                            grid: grid
                        });
                        win.show();
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'icon_delete',
                    text: i18n.getKey('delete'),
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;

                    }
                }
            ]
        };
        me.columns = [
            {
                xtype: 'rownumberer',
                tdCls: 'vertical-middle'
            },
            {
                xtype: 'actioncolumn',
                width: 50,
                hidden: me.checkOnly,
                tdCls: 'vertical-middle',
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                        tooltip: 'Edit',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var grid = view.ownerCt;
                            var sourceMaterialViewTypes = Ext.getCmp('sourceMaterialViewTypes').getSubmitValue() || [];
                            var store = Ext.data.StoreManager.getByKey('sourceMaterialViewTypeDataSourceStore2');
                            store.proxy.extraParams = {
                                filter: Ext.JSON.encode([{
                                    "name": "includeIds",
                                    "type": "string",
                                    "value": "[" + sourceMaterialViewTypes + "]"
                                }])
                            };
                            store.load();
                            var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.EditConditionMappingConfigWin', {
                                createOrEdit: 'edit',
                                grid: grid,
                                record: record
                            });
                            win.show();
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        tooltip: 'Delete',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = view.getStore();
                            Ext.Msg.confirm('提示', '确定删除？', callback);

                            function callback(id) {
                                if (id === 'yes') {
                                    store.remove(record);
                                }
                            }
                        }
                    }
                ]
            },
            {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                tdCls: 'vertical-middle',
                width: 250,
                itemId: 'description',
                renderer: function (value, metadata, record) {
                    if (!Ext.isEmpty(value)) {
                    }
                    return value;
                }
            },
            {
                text: i18n.getKey('priority'),
                dataIndex: 'priority',
                tdCls: 'vertical-middle',
                itemId: 'priority',
                renderer: function (value, metadata, record) {
                    if (!Ext.isEmpty(value)) {
                    }
                    return value;
                }
            }, {
                text: i18n.getKey('executeCondition'),
                dataIndex: 'condition',
                width: 250,
                tdCls: 'vertical-middle',
                itemId: 'condition',
                renderer: function (value, metadata, record) {
                    if (!Ext.isEmpty(value)) {
                    }
                    return value;
                }
            }, {
                text: i18n.getKey('valueEx') + i18n.getKey('executeCondition'),
                dataIndex: 'valueExCondition',
                width: 250,
                tdCls: 'vertical-middle',
                itemId: 'valueExCondition',
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    if (Ext.isEmpty(value)) {

                    } else {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + i18n.getKey('check') + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        JSShowJsonData(value.expression.expression, i18n.getKey('valueEx') + i18n.getKey('executeCondition'))
                                    });
                                }
                            }
                        };
                    }
                }
            }, {
                text: i18n.getKey('pageContentTargetMappingConfigs'),
                dataIndex: 'pageContentTargetMappingConfigs',
                tdCls: 'vertical-middle',
                flex: 1,
                xtype: 'componentcolumn',
                itemId: 'pageContentTargetMappingConfigs',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="查看pageContentTargetMappingConfigs"';
                    return {
                        xtype: 'displayfield',
                        value: '<a href="#")>查看pageContentTargetMappingConfigs</a>',
                        listeners: {
                            render: function (display) {
                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                ela.on("click", function () {
                                    console.log(record);
                                    Ext.create('Ext.window.Window', {
                                        layout: 'fit',
                                        modal: true,
                                        constrain: true,
                                        title: i18n.getKey('check') + i18n.getKey('pageContentTargetMappingConfigs'),
                                        items: [
                                            {
                                                xtype: 'grid',
                                                width: 700,
                                                height: 350,
                                                store: Ext.create('Ext.data.Store', {
                                                    fields: [
                                                        {
                                                            name: 'pageContentMappingConfigs',
                                                            type: 'array'
                                                        }, {
                                                            name: 'targetConfig',
                                                            type: 'object'
                                                        }, {
                                                            name: 'description',
                                                            type: 'string'
                                                        },
                                                        {
                                                            name: 'clazz',
                                                            type: 'string',
                                                            defaultValue: 'com.qpp.cgp.domain.preprocess.config.PageContentTargetMappingConfig'
                                                        }
                                                    ],
                                                    data: value
                                                }),
                                                selType: 'rowmodel',
                                                columns: [
                                                    {
                                                        xtype: 'rownumberer',
                                                        tdCls: 'vertical-middle',
                                                    },{
                                                        text: i18n.getKey('目标PC索引'),
                                                        dataIndex: 'targetConfig',
                                                        tdCls: 'vertical-middle',
                                                        renderer: function (value, metadata,record) {
                                                            metadata.tdAttr = 'data-qtip="' + value.pageContentIndex + '"';//显示的文本
                                                            return value.pageContentIndex;
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('description'),
                                                        dataIndex: 'description',
                                                        tdCls: 'vertical-middle',
                                                        renderer: function (value, metadata,record) {
                                                            var targetConfig = record.get('targetConfig');
                                                            metadata.tdAttr = 'data-qtip="' + value + '"';//显示的文本
                                                            return value;
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('targetConfig'),
                                                        dataIndex: 'targetConfig',
                                                        tdCls: 'vertical-middle',
                                                        flex: 1,
                                                        xtype: 'componentcolumn',
                                                        renderer: function (value, metadata, record) {
                                                            metadata.tdAttr = 'data-qtip="查看targetConfig"';
                                                            return {
                                                                xtype: 'displayfield',
                                                                value: '<a href="#")>查看targetConfig</a>',
                                                                listeners: {
                                                                    render: function (display) {
                                                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                                        ela.on("click", function () {
                                                                            console.log(record);
                                                                            Ext.create('Ext.window.Window', {
                                                                                layout: 'fit',
                                                                                modal: true,
                                                                                constrain: true,
                                                                                title: i18n.getKey('check') + i18n.getKey('targetConfig'),
                                                                                items: [
                                                                                    {
                                                                                        xtype: 'form',
                                                                                        layout: {
                                                                                            type: 'vbox',
                                                                                            align: 'center',
                                                                                            pack: 'center'
                                                                                        },
                                                                                        padding: '10 0 10 0',
                                                                                        border: false,
                                                                                        defaults: {
                                                                                            readOnly: true,
                                                                                            padding: '5 25 5 25',
                                                                                            width: 350
                                                                                        },
                                                                                        items: [
                                                                                            {
                                                                                                xtype: 'combo',
                                                                                                name: 'clazz',
                                                                                                itemId: 'clazz',
                                                                                                editable: false,
                                                                                                fieldLabel: i18n.getKey('type'),
                                                                                                allowBlank: false,
                                                                                                value: value.clazz,
                                                                                                valueField: 'value',
                                                                                                displayField: 'display',
                                                                                                store: Ext.create('Ext.data.Store', {
                                                                                                    fields: [
                                                                                                        'value',
                                                                                                        'display'
                                                                                                    ],
                                                                                                    data: [
                                                                                                        {
                                                                                                            value: 'com.qpp.cgp.domain.preprocess.config.FixTargetPageContentConfig',
                                                                                                            display: 'FixTargetPageContentConfig'
                                                                                                        },
                                                                                                        {
                                                                                                            value: 'com.qpp.cgp.domain.preprocess.config.ExMatchTargetPageContentConfig',
                                                                                                            display: 'ExMatchTargetPageContentConfig'
                                                                                                        }
                                                                                                    ]
                                                                                                })
                                                                                            },
                                                                                            {
                                                                                                xtype: 'numberfield',
                                                                                                name: 'pageContentIndex',
                                                                                                hidden: value.pageContentIndex ? false : true,
                                                                                                value: value.pageContentIndex,
                                                                                                fieldLabel: i18n.getKey('PC位置索引'),
                                                                                                itemId: 'pageContentIndex',
                                                                                                allowBlank: false
                                                                                            },
                                                                                            {
                                                                                                xtype: 'valueexfield',
                                                                                                name: 'matchResult',
                                                                                                hidden: value.matchResult ? false : true,
                                                                                                value: value.matchResult,
                                                                                                itemId: 'matchResult',
                                                                                                allowBlank: false,
                                                                                                fieldLabel: i18n.getKey('匹配规则'),
                                                                                                commonPartFieldConfig: {
                                                                                                    uxTextareaContextData: true,
                                                                                                    defaultValueConfig: {
                                                                                                        type: 'Boolean',
                                                                                                        typeSetReadOnly: true,
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }).show();
                                                                        });
                                                                    }
                                                                }
                                                            };
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('pageContentMappingConfigs'),
                                                        dataIndex: 'pageContentMappingConfigs',
                                                        tdCls: 'vertical-middle',
                                                        flex: 1,
                                                        xtype: 'componentcolumn',
                                                        renderer: function (value, metadata, record) {
                                                            metadata.tdAttr = 'data-qtip="查看pageContentMappingConfigs"';
                                                            return {
                                                                xtype: 'displayfield',
                                                                value: '<a href="#")>查看pageContentMappingConfigs</a>',
                                                                listeners: {
                                                                    render: function (display) {
                                                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                                        ela.on("click", function () {
                                                                            console.log(record);
                                                                            Ext.create('Ext.window.Window', {
                                                                                layout: 'fit',
                                                                                modal: true,
                                                                                constrain: true,
                                                                                title: i18n.getKey('check') + i18n.getKey('pageContentMappingConfigs'),
                                                                                items: [
                                                                                    {
                                                                                        viewConfig: {
                                                                                            enableTextSelection: true
                                                                                        },
                                                                                        xtype: 'grid',
                                                                                        height: 300,
                                                                                        width: 700,
                                                                                        store: Ext.create('Ext.data.Store', {
                                                                                            autoSync: true,
                                                                                            fields: [
                                                                                                {
                                                                                                    name: 'sourcePageContentConfig',
                                                                                                    type: 'object'
                                                                                                }, {
                                                                                                    name: 'operator',
                                                                                                    type: 'object'
                                                                                                }, {
                                                                                                    name: 'executeOrder',
                                                                                                    type: 'number'
                                                                                                }, {
                                                                                                    name: 'description',
                                                                                                    type: 'string'
                                                                                                }
                                                                                            ],
                                                                                            data: value
                                                                                        }),
                                                                                        selType: 'rowmodel',
                                                                                        columns: [
                                                                                            {
                                                                                                xtype: 'rownumberer',
                                                                                                tdCls: 'vertical-middle'
                                                                                            },
                                                                                            {
                                                                                                text: i18n.getKey('description'),
                                                                                                dataIndex: 'description',
                                                                                                tdCls: 'vertical-middle',
                                                                                                renderer: function (value, metadata) {
                                                                                                    metadata.tdAttr = 'data-qtip="' + value + '"';//显示的文本
                                                                                                    return value;
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                text: i18n.getKey('executeOrder'),
                                                                                                dataIndex: 'executeOrder',
                                                                                                tdCls: 'vertical-middle',
                                                                                                flex: 1,
                                                                                                xtype: 'componentcolumn',
                                                                                                renderer: function (value, metadata) {
                                                                                                    metadata.tdAttr = 'data-qtip="' + value + '"';//显示的文本
                                                                                                    return value;
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                text: i18n.getKey('operator'),
                                                                                                dataIndex: 'operator',
                                                                                                tdCls: 'vertical-middle',
                                                                                                flex: 1,
                                                                                                xtype: 'componentcolumn',
                                                                                                renderer: function (value, metadata) {
                                                                                                    metadata.tdAttr = 'data-qtip="' + value + '"';//显示的文本
                                                                                                    return value;
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                text: i18n.getKey('sourcePageContentConfig'),
                                                                                                dataIndex: 'sourcePageContentConfig',
                                                                                                tdCls: 'vertical-middle',
                                                                                                flex: 1,
                                                                                                xtype: 'componentcolumn',
                                                                                                renderer: function (value, metadata, record) {
                                                                                                    metadata.tdAttr = 'data-qtip="查看sourceConfig"';
                                                                                                    return {
                                                                                                        xtype: 'displayfield',
                                                                                                        value: '<a href="#")>查看sourcePageContentConfig</a>',
                                                                                                        listeners: {
                                                                                                            render: function (display) {
                                                                                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                                                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                                                                                ela.on("click", function () {
                                                                                                                    console.log(record);
                                                                                                                    Ext.create('Ext.window.Window', {
                                                                                                                        layout: 'fit',
                                                                                                                        modal: true,
                                                                                                                        constrain: true,
                                                                                                                        title: i18n.getKey('check') + i18n.getKey('sourcePageContentConfig'),
                                                                                                                        items: [
                                                                                                                            {
                                                                                                                                xtype: 'form',
                                                                                                                                layout: {
                                                                                                                                    type: 'vbox',
                                                                                                                                    align: 'center',
                                                                                                                                    pack: 'center'
                                                                                                                                },
                                                                                                                                padding: '10 0 10 0',
                                                                                                                                border: false,
                                                                                                                                defaults: {
                                                                                                                                    readOnly: true,
                                                                                                                                    padding: '5 25 5 25',
                                                                                                                                    width: 350
                                                                                                                                },
                                                                                                                                items: [
                                                                                                                                    {
                                                                                                                                        xtype: 'combo',
                                                                                                                                        name: 'clazz',
                                                                                                                                        itemId: 'clazz',
                                                                                                                                        editable: false,
                                                                                                                                        fieldLabel: i18n.getKey('type'),
                                                                                                                                        allowBlank: false,
                                                                                                                                        value: value.clazz,
                                                                                                                                        store: Ext.create('Ext.data.Store', {
                                                                                                                                            fields: [
                                                                                                                                                'value',
                                                                                                                                                'display'
                                                                                                                                            ],
                                                                                                                                            data: [
                                                                                                                                                {
                                                                                                                                                    value: 'com.qpp.cgp.domain.preprocess.config.FixSourcePageContentConfig',
                                                                                                                                                    display: 'FixSourcePageContentConfig'
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                    value: 'com.qpp.cgp.domain.preprocess.config.ExSourcePageContentConfig',
                                                                                                                                                    display: 'ExSourcePageContentConfig'
                                                                                                                                                }
                                                                                                                                            ]
                                                                                                                                        }),
                                                                                                                                        valueField: 'value',
                                                                                                                                        displayField: 'display',
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        xtype: 'combo',
                                                                                                                                        fieldLabel: i18n.getKey('sourceConfig'),
                                                                                                                                        store: Ext.data.StoreManager.get('sourceMaterialViewTypeDataSourceStore'),
                                                                                                                                        valueField: '_id',
                                                                                                                                        displayField: 'description',
                                                                                                                                        editable: false,
                                                                                                                                        allowBlank: false,
                                                                                                                                        value: value.sourceConfig._id,
                                                                                                                                        name: 'sourceConfig',
                                                                                                                                        itemId: 'sourceConfig'
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        xtype: 'numberfield',
                                                                                                                                        name: 'pageContentIndex',
                                                                                                                                        value: value.pageContentIndex,
                                                                                                                                        hidden: value.pageContentIndex ? false : true,
                                                                                                                                        fieldLabel: i18n.getKey('PC位置索引'),
                                                                                                                                        itemId: 'pageContentIndex',
                                                                                                                                        allowBlank: false
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        xtype: 'valueexfield',
                                                                                                                                        name: 'calculationIndex',
                                                                                                                                        itemId: 'calculationIndex',
                                                                                                                                        allowBlank: false,
                                                                                                                                        hidden: value.calculationIndex ? false : true,
                                                                                                                                        value: value.calculationIndex,
                                                                                                                                        fieldLabel: i18n.getKey('calculationIndex'),
                                                                                                                                        commonPartFieldConfig: {
                                                                                                                                            uxTextareaContextData: true,
                                                                                                                                            defaultValueConfig: {
                                                                                                                                                type: 'Number',
                                                                                                                                                typeSetReadOnly: true,
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    }).show();
                                                                                                                });
                                                                                                            }
                                                                                                        }
                                                                                                    };
                                                                                                }
                                                                                            }
                                                                                        ],
                                                                                    }
                                                                                ]
                                                                            }).show();
                                                                        });
                                                                    }
                                                                }
                                                            };
                                                        }
                                                    }
                                                ],
                                            }
                                        ]
                                    }).show();
                                });
                            }
                        }
                    };
                }

            }
        ];
        me.callParent();
    }
})
