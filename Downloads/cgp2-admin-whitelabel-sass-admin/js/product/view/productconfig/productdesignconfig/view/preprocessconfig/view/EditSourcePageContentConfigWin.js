/**
 * Created by nan on 2020/2/24.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.EditSourcePageContentConfigWin', {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    alias: 'widget.editconditionmappingconfigwin',
    layout: 'fit',
    grid: null,
    createOrEdit: 'create',
    record: null
    ,

    searchParams: function (grid, filter) {
        var queries = [];
        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();
        var params = {};
        for (var i = 0; i < items.length; i++) {
            var query = {};
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            query.name = items[i].name;
            if (!Ext.isEmpty(items[i].isLike) && !items[i].isLike) {
                query.value = items[i].getValue();
            } else if (Ext.isEmpty(items[i].isLike) || items[i].isLike) {
                query.value = '%' + items[i].getValue() + '%'
            }
            if (Ext.isNumber(query.value)) {
                query.type = 'number';
            } else {
                query.type = 'string';
            }
            queries.push(query);
        }
        if (queries.length > 0) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(queries)
            }
        } else {
            store.proxy.extraParams = null;
        }

        store.loadPage(1);
    },
    clearParams: function (grid, filter) {

        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();

        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }

        store.proxy.extraParams = null;
    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey(me.createOrEdit) + i18n.getKey('sourcePageContentConfig');
        me.controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.controller.Controller');
        var opratorStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.OperatorStore');
        //opratorStore.proxy.extraParams = {filter: '[{"name":"sourceType","value":"Target","type":"string"}]'};
        me.items = [
            {
                xtype: 'form',
                itemId: 'form',
                getValue: function () {
                    var me = this;
                    var result = {};
                    var sourcePageContentConfig = {};
                    var sourcePCFieldSet = me.getComponent('sourcePCFieldSet');
                    var baseInfoFieldSet = me.getComponent('baseInfoFieldSet');
                    for (var i = 0; i < sourcePCFieldSet.items.items.length; i++) {
                        var item = sourcePCFieldSet.items.items[i];
                        if (item.disabled == false) {
                            if (item.getName() == 'sourceConfig') {
                                sourcePageContentConfig[item.getName()] = {
                                    _id: item.getValue(),
                                    clazz: item.store.getById(item.getValue()).get('clazz')
                                };
                            } else {
                                sourcePageContentConfig[item.getName()] = item.getValue();
                            }
                        }
                    }
                    result.sourcePageContentConfig = sourcePageContentConfig;
                    for (var i = 0; i < baseInfoFieldSet.items.items.length; i++) {
                        var item = baseInfoFieldSet.items.items[i];
                        if (item.disabled == false) {
                            result[item.getName()] = item.getValue();
                        }
                    }
                    result.clazz = 'com.qpp.cgp.domain.preprocess.config.PageContentMappingConfig';
                    console.log(result);
                    return result;
                },
                setValue: function (data) {
                    var me = this;
                    var sourcePCFieldSet = me.getComponent('sourcePCFieldSet');
                    var baseInfoFieldSet = me.getComponent('baseInfoFieldSet');
                    for (var i = 0; i < sourcePCFieldSet.items.items.length; i++) {
                        var item = sourcePCFieldSet.items.items[i];
                        if (!Ext.isEmpty(data.sourcePageContentConfig[item.getName()])) {
                            if (item.getName() == 'sourceConfig') {
                                item.setValue(data.sourcePageContentConfig.sourceConfig._id);
                            } else {
                                item.setValue(data.sourcePageContentConfig[item.getName()]);
                            }
                        }
                    }
                    for (var i = 0; i < baseInfoFieldSet.items.items.length; i++) {
                        var item = baseInfoFieldSet.items.items[i];
                        if (!Ext.isEmpty(data[item.getName()])) {
                            item.setValue(data[item.getName()]);
                        }
                    }
                },
                defaults: {
                    allowBlank: false,
                    width: 550,
                },
                items: [
                    {
                        xtype: 'fieldset',
                        collapsible: false,
                        header: false,
                        itemId: 'sourcePCFieldSet',
                        margin: '10 50 10 50',
                        defaultType: 'displayfield',
                        profileStore: null,//所有能使用的profile,若没有则隐藏
                        style: {
                            borderRadius: '10px'
                        },
                        title: i18n.getKey('源PC配置'),
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
                                value: 'com.qpp.cgp.domain.preprocess.config.FixSourcePageContentConfig',
                                mapping: {
                                    common: [
                                        'clazz', 'sourceConfig'
                                    ],
                                    'com.qpp.cgp.domain.preprocess.config.FixSourcePageContentConfig': ['pageContentIndex'],
                                    'com.qpp.cgp.domain.preprocess.config.ExSourcePageContentConfig': ['calculationIndex'],
                                    'com.qpp.cgp.domain.preprocess.config.ExCheckSourcePageContentConfig': ['calculateCheck']
                                },
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
                                        },
                                        {
                                            value: 'com.qpp.cgp.domain.preprocess.config.ExCheckSourcePageContentConfig',
                                            display: 'ExCheckSourcePageContentConfig'
                                        },
                                    ]
                                }),
                                valueField: 'value',
                                displayField: 'display',
                                listeners: {
                                    change: function (combo, newValue, oldVlaue) {
                                        var fieldSet = combo.ownerCt;
                                        for (var i = 0; i < fieldSet.items.items.length; i++) {
                                            var item = fieldSet.items.items[i];
                                            if (Ext.Array.contains(combo.mapping['common'], item.itemId)) {
                                            } else if (Ext.Array.contains(combo.mapping[newValue], item.itemId)) {
                                                item.show();
                                                item.setDisabled(false);
                                            } else {
                                                item.hide();
                                                item.setDisabled(true);
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: i18n.getKey('sourceConfig'),
                                store: Ext.data.StoreManager.get('sourceMaterialViewTypeDataSourceStore2'),
                                valueField: '_id',
                                displayField: 'description',
                                editable: false,
                                allowBlank: false,
                                name: 'sourceConfig',
                                itemId: 'sourceConfig',
                                /*
                                                                listeners: {
                                                                    //与源mvt的数据互斥
                                                                    afterrender: function (field) {//使两个gridcombo可选的内容互补
                                                                        field.store.on('load',
                                                                            function () {
                                                                                var sourceMaterialViewTypes = Ext.getCmp('sourceMaterialViewTypes').getSubmitValue() || [];
                                                                                var store = Ext.data.StoreManager.get('sourceMaterialViewTypeDataSourceStore2')
                                                                                store.filterBy(function (item) {
                                                                                    return Ext.Array.contains(sourceMaterialViewTypes, item.getId());
                                                                                })
                                                                            })
                                                                    },
                                                                    expand: function () {
                                                                        this.store.load();
                                                                    }
                                                                }
                                */
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
                                name: 'calculationIndex',
                                itemId: 'calculationIndex',
                                allowBlank: false,
                                hidden: true,
                                disabled: true,
                                fieldLabel: i18n.getKey('calculationIndex'),
                                commonPartFieldConfig: {
                                    uxTextareaContextData: true,
                                    defaultValueConfig: {
                                        type: 'Number',
                                        typeSetReadOnly: true
                                    }
                                }
                            },
                            {
                                xtype: 'valueexfield',
                                name: 'calculateCheck',
                                itemId: 'calculateCheck',
                                allowBlank: false,
                                hidden: true,
                                disabled: true,
                                fieldLabel: i18n.getKey('calculateCheck'),
                                commonPartFieldConfig: {
                                    uxTextareaContextData: true,
                                    defaultValueConfig: {
                                        type: 'Boolean',
                                        typeSetReadOnly: true
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        collapsible: false,
                        header: false,
                        itemId: 'baseInfoFieldSet',
                        margin: '10 50 10 50',
                        defaultType: 'displayfield',
                        profileStore: null,//所有能使用的profile,若没有则隐藏
                        style: {
                            borderRadius: '10px'
                        },
                        title: i18n.getKey('基本配置'),
                        defaults: {
                            width: 500,
                            allowBlank: false
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'executeOrder',
                                itemId: 'executeOrder',
                                fieldLabel: i18n.getKey('executeOrder'),
                                minValue: 0,
                                allowDecimals: false,
                                value: 1
                            },
                            {
                                xtype: 'fieldcontainer',
                                itemId: 'operatorConfig',
                                width: 550,
                                name: 'operatorConfig',
                                layout: 'hbox',
                                allowBlank: false,
                                fieldLabel: i18n.getKey('data') + i18n.getKey('operator'),
                                items: [
                                    {
                                        fieldLabel: false,
                                        store: opratorStore,
                                        multiSelect: false,
                                        valueField: '_id',
                                        displayField: 'displayName',
                                        editable: false,
                                        xtype: 'gridcombo',
                                        allowBlank: false,
                                        itemId: 'operator',
                                        id: 'operator',
                                        name: 'operator',
                                        matchFieldWidth: false,
                                        gridCfg: {
                                            store: opratorStore,
                                            width: 450,
                                            height: 280,
                                            columns: [
                                                {
                                                    text: i18n.getKey('description'),
                                                    flex: 1,
                                                    dataIndex: 'description',
                                                    renderer: function (value, matete, record) {
                                                        return value + '(' + record.getId() + ')';
                                                    }
                                                }
                                            ],
                                            tbar: {
                                                layout: {
                                                    type: 'column'
                                                },
                                                defaults: {
                                                    width: 170,
                                                    isLike: false,
                                                    padding: 2
                                                },
                                                items: [
                                                    {
                                                        xtype: 'textfield',
                                                        fieldLabel: i18n.getKey('id'),
                                                        name: '_id',
                                                        isLike: false,
                                                        labelWidth: 40
                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        fieldLabel: i18n.getKey('description'),
                                                        name: 'description',
                                                        labelWidth: 40
                                                    }, {
                                                        xtype: 'textfield',
                                                        fieldLabel: i18n.getKey('sourceType'),
                                                        hidden: true,
                                                        value: 'Target',
                                                        name: 'sourceType',
                                                        labelWidth: 40
                                                    },
                                                    '->',
                                                    {
                                                        xtype: 'button',
                                                        text: i18n.getKey('search'),
                                                        handler: me.searchParams,
                                                        width: 80
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        text: i18n.getKey('clear'),
                                                        handler: me.clearParams,
                                                        width: 80
                                                    }
                                                ]
                                            },
                                            bbar: Ext.create('Ext.PagingToolbar', {
                                                store: opratorStore,
                                                displayInfo: true, // 是否 ? 示， 分 ? 信息
                                                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                                emptyMsg: i18n.getKey('noData')
                                            })
                                        }
                                    },
                                    /*{
                                        xtype: 'combo',
                                        name: 'operator',
                                        fieldLabel: false,
                                        width: 330,
                                        //readOnly: true,
                                        editable: true,
                                        margin: '0 5 0 0',
                                        pageSize: 25,
                                        store: opratorStore,
                                        displayField: 'displayName',
                                        valueField: '_id',
                                        //hideTrigger: true,
                                        allowBlank: false,
                                        itemId: 'operator'
                                    },*/
                                    {
                                        xtype: 'button',
                                        text: i18n.getKey('edit'),
                                        width: 65,
                                        handler: function (button) {
                                            var operator = button.ownerCt.getComponent('operator');
                                            me.controller.editOperator(me.createOrEdit, operator)
                                        }
                                    }
                                ],
                                getName: function () {
                                    return this.name;
                                },
                                setValue: function (data) {
                                    var me = this;
                                    me.getComponent('operator').setInitialValue([data._id]);
                                    //me.getComponent('operator').setValue(data._id);
                                },
                                getValue: function () {
                                    var me = this;
                                    var operatorId = '';
                                    for (var i in me.getComponent('operator').getValue()) {
                                        operatorId = i;
                                    }
                                    return {
                                        _id: operatorId,
                                        clazz: 'com.qpp.cgp.domain.preprocess.operator.SourceOperatorConfig'
                                    };

                                }
                            },
                            /*{
                                xtype: 'textfield',
                                name: 'operator',
                                fieldLabel: i18n.getKey('operator'),
                                itemId: 'operator',
                                allowBlank: false
                            },*/
                            {
                                xtype: 'textarea',
                                name: 'description',
                                itemId: 'description',
                                value: '操作描述',
                                fieldLabel: i18n.getKey('description')
                            }
                        ]
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
    },
    listeners: {
        afterrender: function (win) {
            if (win.createOrEdit == 'edit') {
                var form = win.getComponent('form');
                form.setValue(win.record.getData());
            }
        }
    }
})
