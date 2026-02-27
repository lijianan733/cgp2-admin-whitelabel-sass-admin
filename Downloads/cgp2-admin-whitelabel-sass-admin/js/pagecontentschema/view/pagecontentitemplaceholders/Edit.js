/**
 * Created by nan on 2020/8/27.
 */
Ext.Loader.syncRequire([
    'CGP.variabledatasource.store.VariableDataSourceStore'
])
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var variableDataSourceStore = Ext.create('CGP.variabledatasource.store.VariableDataSourceStore');
    var pageContentSchemaId = JSGetQueryString('pageContentSchemaId');
    var recordId = JSGetQueryString('recordId');
    var form = Ext.widget('errorstrickform', {
        autoScroll: true,
        createOrEdit: 'create',
        canvasStore: null,
        defaults: {
            allowBlank: false,
            width: 500,
            margin: '5 25 5 25'
        },
        data: null,
        setValue: function (data) {
            var me = this;
            me.data = data;
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (item.diySetValue) {
                    item.diySetValue(data[item.getName()]);
                } else if (item.setValue) {
                    item.setValue(data[item.getName()]);
                }
            }

        },
        getValue: function () {
            var me = this;
            var result = {};
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (item.diyGetValue) {
                    result[item.getName()] = item.diyGetValue();
                } else if (item.getValue) {
                    result[item.getName()] = item.getValue();
                }
            }
            return Ext.Object.merge(me.data || {}, result);

        },
        items: [
            {
                name: '_id',
                xtype: 'textfield',
                fieldStyle: 'background-color:silver',
                value: recordId ? null : JSGetCommonKey(false),
                readOnly: false,
                fieldLabel: i18n.getKey('id'),
                itemId: '_id',
            },
            {
                name: 'itemSelector',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('itemSelector'),
                itemId: 'itemSelector',
            },
            {
                name: 'clazz',
                xtype: 'textfield',
                hidden: true,
                value: 'com.qpp.cgp.domain.bom.PageContentItemPlaceholder',
                itemId: 'clazz'
            },
            {
                name: 'itemAttributes',
                itemId: 'itemAttributes',
                xtype: 'arraydatafield',
                allowChangSort: false,
                allowBlank: true,
                resultType: 'Array',
                fieldLabel: i18n.getKey('itemAttributes'),
                colspan: 2,
                panelConfig: {
                    minHeight: 50,
                    allowBlank: true,
                    layout: 'anchor',
                    bodyStyle: {
                        borderColor: '#c0c0c0'
                    },
                    defaults: {
                        width: false,
                        minWidth: 0,
                    }
                },
                optionalData: [
                    {
                        display: 'printFile',
                        value: 'printFile'
                    }, {
                        display: 'picture',
                        value: 'picture'
                    }, {
                        display: 'imageName',
                        value: 'imageName'
                    }
                ]
            },
            {
                name: 'dataSource',
                xtype: 'gridcombo',
                itemId: 'dataSource',
                fieldLabel: i18n.getKey('dataSource'),
                multiSelect: false,
                displayField: '_id',
                valueField: '_id',
                store: variableDataSourceStore,
                editable: false,
                matchFieldWidth: false,
                filterCfg: {
                    height: 70,
                    layout: {
                        type: 'column',
                        columns: 2
                    },
                    fieldDefaults: {
                        labelAlign: 'right',
                        layout: 'anchor',
                        width: 300,
                        style: 'margin-right:20px; margin-top : 5px;',
                        labelWidth: 50
                    },
                    items: [
                        {
                            name: '_id',
                            xtype: 'textfield',
                            hideTrigger: true,
                            allowDecimals: false,
                            isLike: false,
                            fieldLabel: i18n.getKey('id'),
                            itemId: '_id'
                        },
                        {
                            name: 'clazz',
                            fieldLabel: i18n.getKey('type'),
                            itemId: 'clazz',
                            editable: false,
                            valueField: 'value',
                            displayField: 'display',
                            xtype: 'combo',
                            isLike: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    'value',
                                    'display'
                                ],
                                data: [
                                    {
                                        value: 'com.qpp.cgp.domain.bom.datasource.ImageGroupDataSource',
                                        display: 'ImageGroupDataSource'
                                    },
                                    {
                                        value: 'com.qpp.cgp.domain.bom.datasource.LocalDataSource',
                                        display: 'LocalDataSource'
                                    }
                                ]
                            })
                        }
                    ]
                },
                gridCfg: {
                    store: variableDataSourceStore,
                    height: 300,
                    width: 800,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            width: 100
                        },
                        {
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                        },
                        {
                            text: i18n.getKey('rtType'),
                            dataIndex: 'rtType',
                            width: 100,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="查看rtType"';
                                if (value) {
                                    value = value._id;
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>' + value + '</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    JSOpen({
                                                        id: 'rttypespage',
                                                        url: path + "partials/rttypes/rttype.html?rtType=" + value,
                                                        title: 'RtType',
                                                        refresh: true
                                                    });
                                                });
                                            }
                                        }
                                    };
                                } else {
                                    return null;
                                }
                            }
                        },
                        {
                            text: i18n.getKey('quantityRange'),
                            dataIndex: 'quantityRange',
                            xtype: 'componentcolumn',
                            width: 150,
                            renderer: function (value, metadata, record) {
                                if (value) {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>查看quantityRange</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    var win = Ext.create('Ext.window.Window', {
                                                        modal: true,
                                                        constrain: true,
                                                        title: i18n.getKey('quantityRange'),
                                                        defaults: {
                                                            width: 450,
                                                            margin: '10 20 5 20'
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'displayfield',
                                                                value: value.rangeType,
                                                                fieldLabel: i18n.getKey('rangeType')
                                                            },
                                                            {
                                                                xtype: 'textarea',
                                                                readOnly: true,
                                                                height: 120,
                                                                value: value.minExpression,
                                                                fieldLabel: i18n.getKey('minExpression')
                                                            },
                                                            {
                                                                xtype: 'textarea',
                                                                value: value.maxExpression,
                                                                readOnly: true,
                                                                height: 120,
                                                                hidden: value.maxExpression ? false : true,
                                                                fieldLabel: i18n.getKey('maxExpression')
                                                            }
                                                        ],
                                                    })
                                                    win.show();
                                                });
                                            }
                                        }
                                    };
                                } else {
                                    return null;
                                }
                            }
                        },
                        {
                            text: i18n.getKey('selector'),
                            dataIndex: 'selector',
                        },
                        {
                            text: i18n.getKey('type'),
                            dataIndex: 'clazz',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                return value.split('.').pop();
                            }
                        }],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: variableDataSourceStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    })
                },
                diyGetValue: function () {
                    var me = this;
                    var data = me.getArrayValue();
                    return {
                        _id: data._id,
                        clazz: data.clazz
                    };
                },
                diySetValue: function (data) {
                    var me = this;
                    me.setInitialValue([data._id]);
                }
            },
            {
                name: 'expression',
                xtype: 'textarea',
                fieldLabel: i18n.getKey('expression'),
                itemId: 'expression',
                tipInfo: '获取VD里面的属性',
            },
            {
                name: 'variableDataIndexExpression',
                xtype: 'textarea',
                tipInfo: 'VD和PC对应关系',
                fieldLabel: i18n.getKey('variableDataIndex Expression'),
                itemId: 'variableDataIndexExpression',
            }
        ],
        tbar: [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    if (form.isValid()) {
                        var formData = form.getValue();
                        var data = [];
                        var store = form.canvasStore;
                        var controller = Ext.create('CGP.pagecontentschema.view.pagecontentitemplaceholders.controller.Controller');
                        //取出store里面的数据，若id相同，则使用当前表单的数据
                        for (var i = 0; i < store.getCount(); i++) {
                            var recordData = store.getAt(i).getData()
                            if (recordData._id == formData._id) {//
                                data.push(formData);
                            } else {
                                data.push(recordData);
                            }
                        }
                        if (form.createOrEdit == 'create') {
                            data.push(formData);
                        }
                        controller.savePageContentItemPlaceholder(data, pageContentSchemaId, store, form.createOrEdit == 'edit' ? 'modifySuccess' : 'addsuccessful', form);
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('copy'),
                itemId: 'copyBtn',
                iconCls: 'icon_copy',
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    var newId = JSGetCommonKey(false);
                    form.getComponent('_id').setValue(newId);
                    form.createOrEdit = 'create';
                    btn.setDisabled(true);
                    var pageContentSchemaEdit = top.Ext.getCmp('tabs').getComponent('pagecontentitemplaceholders_edit');
                    pageContentSchemaEdit.setTitle(i18n.getKey('create') + '_' + i18n.getKey('pagecontentitemplaceholders'));
                }
            }
        ],
        listeners: {
            afterrender: function () {
                var form = this;
               ;
                form.canvasStore = Ext.create("CGP.pagecontentschema.view.pagecontentitemplaceholders.store.PageContentItemPlaceholder", {
                    pageContentSchemaId: pageContentSchemaId,
                    listeners: {
                        load: {
                            fn: function (store) {
                               ;
                                if (recordId) {
                                    var record = store.getById(recordId);
                                    form.createOrEdit = 'edit';
                                    form.record = record;
                                    form.setValue(record.getData());
                                } else {
                                    form.createOrEdit = 'create';
                                    form.record = null;
                                }
                            },
                            scope: this,
                            single: true
                        }
                    }
                })
            }
        }
    });
    page.add(form);

})
