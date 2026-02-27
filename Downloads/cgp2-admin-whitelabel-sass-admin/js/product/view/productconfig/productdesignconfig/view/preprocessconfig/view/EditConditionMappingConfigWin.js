/**
 * Created by nan on 2020/2/24.
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.ConditionFieldV3'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.EditConditionMappingConfigWin', {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    alias: 'widget.editconditionmappingconfigwin',
    layout: 'fit',
    createOrEdit: 'create',
    listeners: {
        afterrender: function (win) {
            if (win.createOrEdit == 'edit') {
                var form = win.getComponent('form');
                form.setValue(win.record.getData());
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey(me.createOrEdit) + i18n.getKey('conditionMappingConfig');
        var contentAttributeStore = Ext.data.StoreManager.get('contentAttributeStore');
        if (Ext.isEmpty(contentAttributeStore)) {
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var contentData = JSBuildProductContentData(productId);
            contentAttributeStore = Ext.create('CGP.common.condition.store.ContentAttributeStore', {
                storeId: 'contentAttributeStore',
                data: contentData
            });
        }
        me.items = [
            {
                xtype: 'form',
                itemId: 'form',
                defaults: {
                    allowBlank: false,
                    padding: '10 25 5 25',
                    width: 450,
                },
                getValue: function () {
                    var me = this;
                    var result = {};
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (item.disabled == false) {
                            if (item.xtype == 'gridfield') {
                                result[item.getName()] = item.getSubmitValue();
                            } else {
                                result[item.getName()] = item.getValue();
                            }
                        }
                    }
                    //有valueEx的条件，就不需要有condition字段
                    if (result.valueExCondition) {
                        delete result.condition;
                    }
                    console.log(result);
                    return result;
                },
                setValue: function (data) {
                    var me = this;
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (data[item.getName()]) {
                            if (item.xtype == 'gridfield') {
                                item.getStore().add(data[item.getName()]);
                            } else {
                                item.setValue(data[item.getName()]);
                            }
                        }
                    }
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('description'),
                        name: 'description',
                        itemId: 'description',
                        value: '默认条件预处理配置'
                    },
                    {
                        xtype: 'numberfield',
                        allowDecimals: false,
                        fieldLabel: i18n.getKey('priority'),
                        name: 'priority',
                        itemId: 'priority',
                        value: 1
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('clazz'),
                        name: 'clazz',
                        hidden: true,
                        itemId: 'clazz',
                        value: 'com.qpp.cgp.domain.preprocess.config.ConditionMappingConfig'
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('condition'),
                        name: 'condition',
                        hidden: true,
                        itemId: 'condition',
                        tipInfo: '条件和valueExCondition必须配置其中一个',
                        value: true,
                        allowBlank: true
                    },
                    {
                        xtype: 'valueexfield',
                        fieldLabel: i18n.getKey('valueEx') + i18n.getKey('condition'),
                        name: 'valueExCondition',
                        allowBlank: true,
                        itemId: 'valueExCondition',
                        value: {
                            clazz: "com.qpp.cgp.value.ConstantValue",
                            constraints: [],
                            type: "Boolean",
                            value: true
                        },
                        commonPartFieldConfig: {
                            uxTextareaContextData: true,
                            defaultValueConfig: {
                                type: 'Boolean',
                                clazz: 'com.qpp.cgp.value.ConstantValue',
                                typeSetReadOnly: true,
                                clazzSetReadOnly: false
                            }
                        }
                        /* contentAttributeStore: contentAttributeStore,*/
                    },
                    {
                        xtype: 'gridfield',
                        name: 'pageContentTargetMappingConfigs',
                        itemId: 'pageContentTargetMappingConfigs',
                        fieldLabel: i18n.getKey('pageContentTarget MappingConfigs'),
                        minHeight: 120,
                        width: 700,
                        padding: '10 25 40 25',
                        matchFieldWidth: true,
                        gridConfig: {
                            viewConfig: {
                                enableTextSelection: true
                            },
                            minHeight: 130,
                            maxHeight: 250,
                            renderTo: JSGetUUID(),
                            allowBlank: true,
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
                                data: []
                            }),
                            selType: 'rowmodel',
                            columns: [
                                {
                                    xtype: 'actioncolumn',
                                    tdCls: 'vertical-middle',
                                    itemId: 'actioncolumn',
                                    width: 60,
                                    sortable: false,
                                    resizable: false,
                                    menuDisabled: true,
                                    items: [
                                        {
                                            iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                                            tooltip: 'Edit',
                                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                                var grid = view.ownerCt;
                                                var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.EditpageContentTargetMappingWin', {
                                                    grid: grid,
                                                    createOrEdit: 'edit',
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
                                    renderer: function (value, metadata) {
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
                            tbar: [
                                {
                                    text: i18n.getKey('add'),
                                    iconCls: 'icon_create',
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerCt;
                                        var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.EditpageContentTargetMappingWin', {
                                            grid: grid,
                                            createOrEdit: 'create',
                                            record: null
                                        })
                                        win.show();
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        ];
        me.bbar = [
            '->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var form = win.getComponent('form');
                    if (form.isValid()) {
                        var data = form.getValue();
                        if (win.createOrEdit == 'create') {
                            win.grid.store.add(data);
                        } else {
                            for (var i in data) {
                                win.record.set(i, data[i]);
                            }
                        }
                        win.close();
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    win.close();

                }
            }
        ];
        me.callParent();
    }
})
