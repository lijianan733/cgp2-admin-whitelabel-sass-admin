/**
 * Created by nan on 2020/2/24.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.EditpageContentTargetMappingWin', {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    width:'900',
    alias: 'widget.editconditionmappingconfigwin',
    layout: 'fit',
    width: 900,
    createOrEdit: 'create',
    record: null,
    grid: null,
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
        me.title = i18n.getKey(me.createOrEdit) + i18n.getKey('pageContentTargetMappingConfig');
        me.items = [
            {
                xtype: 'form',
                minHeight: 350,
                itemId: 'form',
                defaults: {
                    allowBlank: false,
                    margin: '10 50 10 50'
                },
                isValid: function () {
                    var me = this;
                    var isValid = true;
                    var targetPageContentConfigFieldSet = me.getComponent('targetPageContentConfigFieldSet');
                    var pageContentMappingConfigs = me.getComponent('pageContentMappingConfigs');
                    if (pageContentMappingConfigs.isValid() & targetPageContentConfigFieldSet.isValid()) {
                        return true;
                    } else {
                        return false;
                    }

                },
                getValue: function () {
                    var me = this;
                    var result = {};
                    var targetConfig = {};
                    var targetPageContentConfigFieldSet = me.getComponent('targetPageContentConfigFieldSet');
                    var pageContentMappingConfigs = me.getComponent('pageContentMappingConfigs');
                    var description = me.getComponent('description');
                    for (var i = 0; i < targetPageContentConfigFieldSet.items.items.length; i++) {
                        var item = targetPageContentConfigFieldSet.items.items[i];
                        if (item.disabled == false) {
                            targetConfig[item.getName()] = item.getValue();
                        }
                    }
                    result.targetConfig = targetConfig;
                    result[pageContentMappingConfigs.getName()] = pageContentMappingConfigs.getSubmitValue();
                    result[description.getName()] = description.getSubmitValue();
                    result.clazz = 'com.qpp.cgp.domain.preprocess.config.PageContentTargetMappingConfig';
                    console.log(result);
                    return result;
                },
                setValue: function (data) {
                    var me = this;
                    var targetPageContentConfigFieldSet = me.getComponent('targetPageContentConfigFieldSet');
                    var pageContentMappingConfigs = me.getComponent('pageContentMappingConfigs');
                    var description = me.getComponent('description');
                    for (var i = 0; i < targetPageContentConfigFieldSet.items.items.length; i++) {
                        var item = targetPageContentConfigFieldSet.items.items[i];
                        if (!Ext.isEmpty(data.targetConfig[item.getName()])) {
                            item.setValue(data.targetConfig[item.getName()]);
                        }
                    }
                    description.setValue(data['description']);
                    pageContentMappingConfigs.getStore().add(data['pageContentMappingConfigs']);
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('description'),
                        allowBlank: false,
                        value: '默认条件预处理描述',
                        name: 'description',
                        itemId: 'description'
                    },

                    {
                        xtype: 'uxfieldset',
                        collapsible: false,
                        header: false,
                        defaultType: 'displayfield',
                        profileStore: null,//所有能使用的profile,若没有则隐藏
                        style: {
                            borderRadius: '10px'
                        },
                        isValid: function () {
                            var me = this;
                            var isValid = true;
                            for (var i = 0; i < me.items.items.length; i++) {
                                if (me.items.items[i].disabled == false) {
                                    if (!me.items.items[i].isValid()) {
                                        isValid = false;
                                    }
                                }
                            }
                            return isValid;
                        },
                        itemId: 'targetPageContentConfigFieldSet',
                        title: i18n.getKey('目标PC配置'),
                        value: 'com.qpp.cgp.domain.preprocess.config.FixTargetPageContentConfig',
                        defaults: {
                            width: 500
                        },
                        items: [
                            {
                                xtype: 'combo',
                                name: 'clazz',
                                itemId: 'clazz',
                                editable: false,
                                fieldLabel: i18n.getKey('type'),
                                allowBlank: false,
                                value: 'com.qpp.cgp.domain.preprocess.config.FixTargetPageContentConfig',
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
                                            display: i18n.getKey('FixTargetPageContentConfig')
                                        },
                                        {
                                            value: 'com.qpp.cgp.domain.preprocess.config.ExMatchTargetPageContentConfig',
                                            display: i18n.getKey('ExMatchTargetPageContentConfig')
                                        }
                                    ]
                                }),
                                listeners: {
                                    change: function (combo, newValue, oldVlaue) {
                                        var fieldSet = combo.ownerCt;
                                        var pageContentIndex = fieldSet.getComponent('pageContentIndex');
                                        var matchResult = fieldSet.getComponent('matchResult');
                                        if (newValue == 'com.qpp.cgp.domain.preprocess.config.FixTargetPageContentConfig') {
                                            pageContentIndex.show();
                                            pageContentIndex.setDisabled(false);
                                            matchResult.hide();
                                            matchResult.setDisabled(true);

                                        } else {
                                            matchResult.show();
                                            matchResult.setDisabled(false);
                                            pageContentIndex.hide();
                                            pageContentIndex.setDisabled(true);
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'numberfield',
                                name: 'pageContentIndex',
                                fieldLabel: i18n.getKey('PC位置索引'),
                                itemId: 'pageContentIndex',
                                allowBlank: false,
                                value: 0
                            },
                            {
                                xtype: 'valueexfield',
                                name: 'matchResult',
                                hidden: true,
                                disabled: true,
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
                    },
                    {
                        xtype: 'gridfield',
                        labelAlign: 'top',
                        name: 'pageContentMappingConfigs',
                        itemId: 'pageContentMappingConfigs',
                        fieldLabel: i18n.getKey('pageContentMappingConfigs'),
                        minHeight: 120,
                        width: 800,
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
                                autoSync: true,
                                fields: [
                                    {
                                        name: 'sourcePageContentConfig',
                                        type: 'object'
                                    }, {
                                        name: 'operatorConfig',
                                        type: 'object'
                                    }, {
                                        name: 'executeOrder',
                                        type: 'number'
                                    }, {
                                        name: 'description',
                                        type: 'string'
                                    },
                                    {
                                        name: 'clazz',
                                        type: 'string',
                                        defaultValue: 'com.qpp.cgp.domain.preprocess.config.PageContentMappingConfig'
                                    }
                                ],
                                data: []
                            }),
                            selType: 'rowmodel',
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    tdCls: 'vertical-middle'
                                },
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
                                                var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.EditSourcePageContentConfigWin', {
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
                                    dataIndex: 'operatorConfig',
                                    tdCls: 'vertical-middle',
                                    flex: 1,
                                    xtype: 'componentcolumn',
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value._id + '"';//显示的文本
                                        return value._id;
                                    }
                                }, {
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
                            tbar: [
                                {
                                    text: i18n.getKey('add'),
                                    iconCls: 'icon_create',
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerCt;
                                        var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.EditSourcePageContentConfigWin', {
                                            grid: grid,
                                            createOrEdit: 'create'
                                        });
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
