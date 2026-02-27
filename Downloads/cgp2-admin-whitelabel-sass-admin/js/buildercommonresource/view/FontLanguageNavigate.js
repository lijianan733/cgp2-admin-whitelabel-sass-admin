/**
 * Created by nan on 2020/11/13,
 * 语言的导航
 */
Ext.Loader.syncRequire([
    'CGP.common.controller.Format'
])
Ext.define('CGP.buildercommonresource.view.FontLanguageNavigate', {
    extend: 'Ext.grid.Panel',
    width: 450,
    alias: 'widget.fontlanguagenavigate',
    fontFilters: null,
    columns: [
        {
            xtype: 'actioncolumn',
            width: 50,
            items: [
                {
                    iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                    tooltip: 'Edit',
                    handler: function (gridView, rowIndex, colIndex, a, b, record) {
                        var grid = gridView.ownerCt;
                        var languageId = record.getId();
                        var filterExpression = record.get('filterExpression');
                        var fontStore = Ext.create("CGP.buildercommonresource.store.DiyGroupFontStore", {
                            autoLoad: true,
                        });
                        var defaultFont = record.get('defaultFont');
                        var filterArr = grid.fontFilters;
                        var win = Ext.create('Ext.window.Window', {
                            title: i18n.getKey('修改可用字体规则'),
                            modal: true,
                            constrain: true,
                            defaults: {
                                margin: '10 25 10 25',
                            },
                            items: [
                                {
                                    xtype: 'errorstrickform',
                                    border: false,
                                    items: [
                                        {
                                            xtype: 'uxfieldcontainer',
                                            name: 'language',
                                            hidden: true,
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    value: 'com.qpp.cgp.domain.common.Language',
                                                    name: 'clazz'
                                                }, {
                                                    xtype: 'textfield',
                                                    value: languageId,
                                                    name: 'id'
                                                }]
                                        },
                                        {
                                            xtype: 'gridcombo',
                                            fieldLabel: i18n.getKey('default') + i18n.getKey('font'),
                                            allowBlank: true,
                                            valueField: '_id',
                                            displayField: 'displayName',
                                            itemId: 'defaultFont',
                                            store: fontStore,
                                            editable: false,
                                            defaultFont: defaultFont,
                                            haveReset: true,
                                            name: 'defaultFont',
                                            matchFieldWidth: false,
                                            width: 400,
                                            filterCfg: {
                                                height: 80,
                                                layout: {
                                                    type: 'column',
                                                    columns: 3
                                                },
                                                fieldDefaults: {
                                                    width: 180,
                                                    labelAlign: 'right',
                                                    layout: 'anchor',
                                                    style: 'margin-right:20px; margin-top : 5px;',
                                                    labelWidth: 50,
                                                },
                                                items: [
                                                    {
                                                        name: '_id',
                                                        xtype: 'textfield',
                                                        isLike: false,
                                                        fieldLabel: i18n.getKey('id'),
                                                        itemId: 'id'
                                                    },
                                                    {
                                                        name: 'fontFamily',
                                                        xtype: 'textfield',
                                                        fieldLabel: i18n.getKey('fontFamily'),
                                                        itemId: 'fontFamily'
                                                    },
                                                    {
                                                        name: 'displayName',
                                                        xtype: 'textfield',
                                                        fieldLabel: i18n.getKey('displayName'),
                                                        itemId: 'displayName'
                                                    }, {
                                                        name: 'languages',
                                                        xtype: 'combo',
                                                        fieldLabel: i18n.getKey('language'),
                                                        itemId: 'language',
                                                        editable: false,
                                                        isLike: false,
                                                        valueField: 'id',
                                                        displayField: 'name',
                                                        store: Ext.create('CGP.common.store.Language')
                                                    }
                                                ]
                                            },
                                            gridCfg: {
                                                height: 350,
                                                width: 600,
                                                columns: [
                                                    {
                                                        text: i18n.getKey('id'),
                                                        width: 90,
                                                        dataIndex: '_id',
                                                        itemId: 'id',
                                                        isLike: false,
                                                        sortable: true,
                                                    },
                                                    {
                                                        text: i18n.getKey('fontFamily'),
                                                        dataIndex: 'fontFamily',
                                                        width: 100,
                                                        itemId: 'fontFamily'
                                                    },
                                                    {
                                                        text: i18n.getKey('displayName'),
                                                        dataIndex: 'displayName',
                                                        flex: 1,
                                                        itemId: 'displayName'
                                                    },
                                                    {
                                                        text: i18n.getKey('language'),
                                                        dataIndex: 'languages',
                                                        itemId: 'language',
                                                        xtype: 'arraycolumn',
                                                        flex: 1,
                                                        renderer: function (value, mate, record) {
                                                            return value.name;
                                                        }
                                                    }
                                                ],
                                                bbar: {
                                                    xtype: 'pagingtoolbar',
                                                    store: fontStore,
                                                    displayInfo: true,
                                                    displayMsg: '',
                                                    emptyMsg: i18n.getKey('noData')
                                                }
                                            },
                                            diyGetValue: function () {
                                                var me = this;
                                                var id = me.getSubmitValue()[0];
                                                if (id) {
                                                    var data = me.getValue()[id];
                                                    return {
                                                        _id: data._id,
                                                        clazz: data.clazz,
                                                        displayName: data.displayName
                                                    }
                                                } else {
                                                    return null;
                                                }
                                            },
                                            listeners: {
                                                afterrender: function () {
                                                    var me = this;
                                                    if (defaultFont) {
                                                        me.setValue(defaultFont);
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'valueexfield',
                                            fieldLabel: i18n.getKey('过滤表达式'),
                                            value: filterExpression,
                                            width: 400,
                                            name: 'filterExpression',
                                            allowBlank: true,
                                            commonPartFieldConfig: {
                                                setExpressionValueWindowConfig: {
                                                    validExpressionContainerConfig: {
                                                        treePanelConfig: {
                                                            columns: {
                                                                items: [
                                                                    {
                                                                        xtype: 'treecolumn',
                                                                        text: 'key',
                                                                        flex: 1,
                                                                        dataIndex: 'text',
                                                                        sortable: true
                                                                    },
                                                                    {
                                                                        text: 'value',
                                                                        flex: 1,
                                                                        dataIndex: 'value',
                                                                        sortable: true
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                },
                                                uxTextareaContextData: {
                                                    "context": {
                                                        "property": {
                                                            '属性Id': '属性值'
                                                        },
                                                        "languages": ["语言id_1", "语言id_2"]
                                                    }
                                                },
                                                defaultValueConfig: {
                                                    type: 'Boolean',
                                                    clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                                                    typeSetReadOnly: true,
                                                    clazzSetReadOnly: true
                                                }
                                            }
                                        }
                                    ]
                                }
                            ],
                            bbar: [
                                '->',
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('confirm'),
                                    iconCls: 'icon_agree',
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        var form = win.items.items[0];
                                        var controller = Ext.create('CGP.buildercommonresource.controller.Controller', {});
                                        if (form.isValid()) {
                                            var data = form.getValue();
                                            //新建还是编辑
                                            var currentConfigIndex = null;
                                            for (var i = 0; i < filterArr.length; i++) {
                                                var item = filterArr[i];
                                                if (item.defaultFont) {
                                                    item.defaultFont = {
                                                        _id: item.defaultFont._id,
                                                        displayName: item.defaultFont.displayName,
                                                        clazz: item.defaultFont.clazz
                                                    }
                                                }
                                                if (item.language.id === data.language.id) {
                                                    currentConfigIndex = i;
                                                }
                                            }
                                            if (currentConfigIndex) {
                                                filterArr[currentConfigIndex] = data;
                                            } else {
                                                filterArr.push(data);
                                            }
                                            win.el.mask('加载中...');
                                            setTimeout(function () {
                                                controller.setFontFilters(filterArr, function () {
                                                   
                                                    grid.store.load();
                                                    win.close();
                                                });
                                            })
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

                            ]
                        });
                        win.show();
                    }
                }
            ]
        },
        {
            text: i18n.getKey('language') + i18n.getKey('id'),
            dataIndex: 'id',
            itemId: 'id',
        }, {
            text: i18n.getKey('name'),
            dataIndex: 'name',
            width: 200,
            itemId: 'name',
        },
        {
            text: i18n.getKey('语言默认字体'),
            sortable: false,
            width: 200,
            dataIndex: 'defaultFont',
            itemId: 'defaultFont',
            renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                if (value) {
                    return value.displayName;
                }
            }
        },
        {
            text: i18n.getKey('过滤表达式'),
            sortable: false,
            dataIndex: 'filterExpression',
            flex: 1,
            itemId: 'filterExpression',
            xtype: 'componentcolumn',
            renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                if (value) {
                    return {
                        xtype: 'displayfield',
                        expression: value.expression.expression,
                        value: '<a href="#")>查看</a>',
                        listeners: {
                            render: function (display) {
                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                ela.on("click", function () {
                                    var tabchar = ' ';
                                    var tabsize = '4';
                                    var data = window.js_beautify(display.expression, tabsize, tabchar);
                                    var win = Ext.create("Ext.window.Window", {
                                        modal: true,
                                        maximizable: true,
                                        constrain: true,
                                        layout: 'fit',
                                        width: 600,
                                        height: 400,
                                        title: i18n.getKey('check') + i18n.getKey('expression'),
                                        items: [
                                            {
                                                xtype: 'textarea',
                                                itemId: 'JSONTextarea',
                                                fieldLabel: false,
                                                value: data
                                            }
                                        ]
                                    });
                                    win.show();
                                });
                            }
                        }
                    };
                } else {
                    return '使用全部公用字体'
                }

            }
        }
        /*   {
               text: i18n.getKey('语言默认字体'),
               sortable: false,
               itemId: 'operation',
               minWidth: 150,
               xtype: 'componentcolumn',
               renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                   var grid = gridView.ownerCt;
                   var queryGrid = grid.ownerCt;
                   var fontId = record.getId();
                   var defaultFontId = queryGrid.defaultFontId;
                   if (defaultFontId == fontId) {
                       return '默认配置'
                   } else {
                       return {
                           xtype: 'displayfield',
                           value: '<a href="#")>设置为默认</a>',
                           listeners: {
                               render: function (display) {
                                   var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                   var ela = Ext.fly(a); //获取到a元素的element封装对象
                                   ela.on("click", function () {
                                       var fontLanguageNavigate = queryGrid.ownerCt.ownerCt.getComponent('westPanel');
                                       var fontFilters = fontLanguageNavigate.fontFilters;
                                       var fonFilter = null;
                                       var languageId = queryGrid.languageId;
                                       for (var i = 0; i < fontFilters.length; i++) {
                                           if (fontFilters[i].language.id == languageId) {
                                               fonFilter = fontFilters[i];
                                           }
                                       }
                                       if (fonFilter) {
                                           fonFilter.defaultFont = {
                                               clazz: "com.qpp.cgp.domain.common.font.Font",
                                               _id: fontId
                                           };
                                       } else {
                                           fontFilters.push({
                                               language: {
                                                   id: languageId,
                                                   clazz: "com.qpp.cgp.domain.common.Language"
                                               },
                                               filterExpression: null,
                                               defaultFont: {
                                                   clazz: "com.qpp.cgp.domain.common.font.Font",
                                                   _id: fontId
                                               }
                                           })
                                       }
                                       queryGrid.defaultFontId = fontId;
                                       queryGrid.ownerCt.ownerCt.el.mask();
                                       queryGrid.updateLayout();
                                       setTimeout(function () {
                                           queryGrid.controller.setFontFilters(fontFilters);
                                           queryGrid.ownerCt.ownerCt.el.unmask();
                                           queryGrid.grid.store.load();
                                       }, 100)

                                   });
                               }
                           }
                       };
                   }
               }
           },
           {
               text: i18n.getKey('字体过滤规则'),
               dataIndex: 'id',
               xtype: 'componentcolumn',
               itemId: 'filterexpression',
               width: 150,
               renderer: function (value, mateData, record, rowIndex, colIndex, store, gridView) {
                  
                   var grid = gridView.ownerCt;
                   var languageId = value;
                   var fontFilters = grid.fontFilters;
                   var filterExpression = null;
                   var currentFontFilter = null;
                   for (var i = 0; i < fontFilters.length; i++) {
                       if (languageId == fontFilters[i].language.id) {
                           currentFontFilter = fontFilters[i];
                           filterExpression = fontFilters[i].filterExpression;
                       }
                   }
                   return {
                       xtype: 'valueexfield',
                       value: filterExpression,
                       saveHandler: function (btn) {
                           var win = btn.ownerCt.ownerCt;
                           var controller = Ext.create('CGP.buildercommonresource.controller.Controller');
                           var diyConditionExpressionBtn = win.diyConditionExpressionBtn;
                           var showValueField = diyConditionExpressionBtn.ownerCt.getComponent('showValueField');
                           var formPanel = win.getComponent('diyConditionExpressionWindow').getFormPanel();
                           var gridPanelValue = win.getComponent('diyConditionExpressionWindow').getGridPanelValue();
                           var formPanelValue = win.getComponent('diyConditionExpressionWindow').getFormPanelValue();
                           formPanelValue.constraints = gridPanelValue;
                           if (!formPanel.isValid()) {
                               return;
                           } else {
                               if (formPanelValue.clazz == 'com.qpp.cgp.value.ExpressionValueEx' && Ext.isEmpty(formPanelValue.expression)) {
                                   Ext.Msg.alert(i18n.getKey('prompt'), '基本信息中的表达式不能为空！')
                               } else {
                                   diyConditionExpressionBtn.value = formPanelValue;
                                   showValueField.setValue(formPanelValue);
                                   diyConditionExpressionBtn.setText(i18n.getKey('edit'));
                                   if (currentFontFilter) {
                                       currentFontFilter.filterExpression = formPanelValue;
                                   } else {
                                       currentFontFilter = {
                                           language: {
                                               id: languageId,
                                               clazz: "com.qpp.cgp.domain.common.Language"
                                           },
                                           filterExpression: formPanelValue,
                                           defaultFont: null
                                       };
                                       fontFilters.push(currentFontFilter);
                                   }
                                   for (var i = 0; i < fontFilters.length; i++) {
                                       if (fontFilters[i].language.id == languageId) {
                                           fontFilters[i].filterExpression = formPanelValue;
                                       }
                                   }
                                   var result = controller.setFontFilters(fontFilters);
                                   win.close();
                               }
                           }

                       },
                       deleteHandler: function (deleteDisplay) {
                           var valueexfield = deleteDisplay.ownerCt;
                           valueexfield.reset();
                           if (currentFontFilter) {
                               currentFontFilter.filterExpression = null;
                           }
                           var controller = Ext.create('CGP.buildercommonresource.controller.Controller');
                           controller.setFontFilters(fontFilters);

                       },
                       commonPartFieldConfig: {
                           uxTextareaContextData: true,
                           defaultValueConfig: {
                               type: 'String',
                               clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                               typeSetReadOnly: false,
                               clazzSetReadOnly: false

                           }
                       }
                   }
               }
           }*/
    ],
    /*    listeners: {
            select: function (selModel, record, rowIndex) {
               ;
                var me = this;
                var languageGrid = this;
                var languageId = record.getId();
                var centerPanel = languageGrid.ownerCt.getComponent('centerPanel');
                var fontGrid = centerPanel.items.items[0];
                fontGrid.show();
                var language = fontGrid.filter.getComponent('language');
                language.setValue(languageId + '');
                var defaultFontId = null;
                for (var i = 0; i < me.fontFilters.length; i++) {
                    if (languageId == me.fontFilters[i].language.id) {
                        if (me.fontFilters[i].defaultFont) {
                            defaultFontId = me.fontFilters[i].defaultFont._id;
                        }
                        break;
                    }
                }
                fontGrid.defaultFontId = defaultFontId;
                fontGrid.languageId = languageId;
                fontGrid.grid.store.load();
            }
        },*/
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.buildercommonresource.controller.Controller');
        me.fontFilters = controller.getFontFilters();
        me.store = Ext.create('CGP.language.store.LanguageStore', {
            listeners: {
                load: function (store, records) {
                    for (var i = 0; i < records.length; i++) {
                        var languageId = records[i].getId();
                        for (var j = 0; j < me.fontFilters.length; j++) {
                            if (languageId == me.fontFilters[j].language.id) {
                                records[i].set('defaultFont', me.fontFilters[j].defaultFont);
                                records[i].set('filterExpression', me.fontFilters[j].filterExpression);
                            }
                        }
                    }
                }
            }
        });
        me.bbar = {//底端的分页栏
            xtype: 'pagingtoolbar',
            store: me.store,
            displayInfo: true, // 是否 ? 示， 分 ? 信息
            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
            emptyMsg: i18n.getKey('noData')
        };
        me.callParent();
    }
})