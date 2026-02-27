Ext.Loader.syncRequire('Ext.ux.form.GridField');
Ext.onReady(function () {

    var notOptional = ['TextField', 'TextArea', 'Date', 'File', 'Canvas', 'YesOrNo', 'DiyConfig', 'DiyDesign'];

    var optionId = -1;
    var controller = Ext.create("CGP.attribute.controller.Edit");
    var optionGrid = {
        selModel: new Ext.selection.RowModel({
            mode: 'MULTI'
        }),
        store: Ext.create("CGP.attribute.store.LocalAttributeOption", {
            remoteSort: false,
            listeners: {
                load: function (store, records) {
                    store.sort('sortOrder', 'ASC');
                }
            }
        }),
        viewConfig: {
            enableTextSelection: true,
            listeners: {
                drop: function (node, Object, overModel, dropPosition, eOpts) {
                    var view = this;
                    this.store.suspendAutoSync();//挂起数据同步
                    view.ownerCt.suspendLayouts();
                    view.store.suspendEvents(true);//挂起事件粗触发，false表示丢弃事件，true表示阻塞事件队列*/
                    var data = this.store.data.items;
                    for (var i = 0; i < data.length; i++) {
                        data[i].index = i;
                        data[i].set('sortOrder', i);
                    }
                    this.store.sync({
                        callback: function () {
                            view.store.resumeEvents();//恢复事件触发
                            view.ownerCt.resumeLayouts();
                        }
                    });//同步数据

                }
            },
            plugins: {
                ptype: 'gridviewdragdrop',
                dragText: 'Drag and drop to reorganize',
            }
        },
        height: 200,
        width: 900,
        columns: [
            {
                xtype: 'rownumberer',
                autoSizeColumn: false,
                itemId: 'rownumberer',
                width: 45,
                resizable: true,
                menuDisabled: true,
                tdCls: 'vertical-middle'
            },
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                width: 60,
                sortable: false,
                resizable: false,
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        itemId: 'actionedit',
                        tooltip: 'Edit',
                        handler: function (view, rowIndex, colIndex) {
                            var store = view.getStore();
                            var record = store.getAt(rowIndex);
                            var valueType = page.form.getComponent('valueType').getValue();
                            controller.openOptionWindow(page, record, valueType);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actionremove',
                        tooltip: 'Remove',
                        handler: function (view, rowIndex, colIndex) {
                            var store = view.getStore();
                            store.removeAt(rowIndex);
                        }
                    }
                ]
            },
            {
                text: i18n.getKey('id'),
                sortable: false,
                dataIndex: 'id',
                width: 80,
                renderer: function (value) {
                    if (value < 0) {
                        return '';
                    } else {
                        return value;
                    }
                }
            },
            {
                text: i18n.getKey('name'),
                sortable: false,
                dataIndex: 'name',
                width: 180,
                renderer: function (value, metadata) {
                    metadata.tdAttr = 'data-qtip ="' + value + '"';
                    return value;
                }
            },
            {
                text: i18n.getKey('displayValue'),
                sortable: false,
                dataIndex: 'displayValue',
                width: 180,
                renderer: function (value, metadata) {
                    metadata.tdAttr = 'data-qtip ="' + value + '"';
                    return value;
                }
            },
            {
                text: i18n.getKey('value'),
                sortable: false,
                dataIndex: 'value',
                width: 180,
                renderer: function (value, metadata) {
                    metadata.tdAttr = 'data-qtip ="' + value + '"';
                    return value;
                }
            }/*,
            {
                text: i18n.getKey('sortOrder'),
                dataIndex: 'sortOrder',
                sortable: false,
                editor: {
                    xtype: 'numberfield'
                }
            },
            {
                text: i18n.getKey('imageUrl'),
                sortable: false,
                dataIndex: 'imageUrl',
                editor: {
                    allowBlank: true
                },
                renderer: function (value, metadata) {
                    metadata.tdAttr = 'data-qtip ="' + value + '"';
                    return value;
                }
            }*/
        ],
        tbar: [
            {
                text: i18n.getKey('addOption'),
                iconCls: 'icon_create',
                handler: function () {
                    var valueType = page.form.getComponent('valueType').getValue();
                    controller.openOptionWindow(page, null, valueType);
                }
            },
            {
                xtype: 'displayfield',
                value: '选中行号拖拽调整选项顺序',
                fieldStyle: {
                    color: 'red'
                },
            }
        ]

    };

    var page = Ext.widget({
        block: 'attribute',
        xtype: 'uxeditpage',
        tbarCfg: {
            btnCopy: {
                handler: function () {
                    var form = this.ownerCt.ownerCt;
                    var basicForm = this.ownerCt.ownerCt.form;
                    var me = basicForm;
                    me.changeMode(me.mode.creating);
                    me._rawModels.each(function (m) {
                        var rec = m.copy();
                        rec.setId(null);
                        var options = rec.get('options');
                        for (var i = 0; i < options.length; i++) {
                            options[i].id = null;
                        }
                        Ext.data.Model.id(rec);//自动生成id
                        me.loadModel(rec);
                        basicForm.setValuesByModel(rec);
                        for (var i = 0; i < options.length; i++) {
                            var gridFiled = form.getComponent('options');
                            gridFiled._grid.store.getAt(i).set('id', -i - 1);
                            gridFiled._grid.store.getAt(i).modified = {'id': -i - 1};
                        }
                        ;
                    });
                    top.Ext.getCmp("tabs").getComponent('attribute_edit').setTitle('新建_属性');
                }
            }
        },
        gridPage: 'attribute.html',
        formCfg: {
            layout: {
                layout: 'table',
                columns: 2,
                tdAttrs: {
                    style: {
                        'padding-right': '120px'
                    }
                }
            },
            model: 'CGP.attribute.model.Attribute',
            items: [
                /*{
                 name: 'name',
                 xtype: 'i18ndisplay',
                 errorsText : 'name.default can not be null',
                 fieldLabel: i18n.getKey('name'),
                 itemId: 'name',
                 rowspan: Ext.util.Cookies.get('locales').split(',').length
                 }*/{
                    name: 'name',
                    allowBlank: false,
                    xtype: 'textfield',
                    regex: /^\S+.*\S+$/,
                    regexText: '值的首尾不能存在空格！',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                /*{
                    name: 'sortOrder',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('sortOrder'),
                    autoStripChars: true,
                    maskRe: /[PE0-9.]/,
                    itemId: 'sortOrder'
                },*/
                {
                    name: 'validationExp',
                    xtype: 'textfield',
                    hidden: true,
                    fieldLabel: i18n.getKey('validationExp'),
                    itemId: 'validationExp'
                },
                {
                    name: 'code',
                    allowBlank: false,
                    xtype: 'textfield',
                    regex: /^\S+.*\S+$/,
                    regexText: '值的首尾不能存在空格！',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code'
                },
                {
                    name: 'required',
                    xtype: 'checkbox',
                    hidden: true,
                    fieldLabel: i18n.getKey('required'),
                    itemId: 'required'
                }, {
                    name: 'valueType',
                    allowBlank: false,
                    xtype: 'combo',
                    editable: false,
                    itemId: 'valueType',
                    fieldLabel: i18n.getKey('valueType'),
                    queryMode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: 'Boolean', value: 'Boolean'},
                            {name: 'String', value: 'String'},
                            {name: 'Array', value: 'Array'},
                            {name: 'Date', value: 'Date'},
                            {name: 'Number', value: 'Number'},
                            {name: 'YearMonth', value: 'YearMonth'},
                            {name: 'Color', value: 'Color'}
                        ]
                    })
                },
                {
                    name: 'showInFrontend',
                    xtype: 'checkbox',
                    hidden: true,
                    fieldLabel: i18n.getKey('showInFrontend'),
                    itemId: 'showInFrontend'
                }, {
                    name: 'selectType',
                    allowBlank: false,
                    xtype: 'combo',
                    editable: false,
                    itemId: 'selectType',
                    valueField: 'value',
                    displayField: 'name',
                    fieldLabel: i18n.getKey('selectType'),
                    queryMode: 'local',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: '输入型', value: 'NON'},
                            {name: '单选型', value: 'SINGLE'},
                            {name: '多选型', value: 'MULTI'}
                        ]
                    }),
                    listeners: {
                        change: function (view, newValue, oldValue) {
                            var inputType = view.ownerCt.getComponent('inputType');
                            var inputTypeValue = {
                                'NON': 'TextField',
                                'SINGLE': 'DropList',
                                'MULTI': 'CheckBox'
                            };
                            inputType.setValue(inputTypeValue[newValue]);
                        }
                    }
                },
                /*{
                    xtype: 'displayfield',
                    itemId: 'hidden'
                },*/
                {
                    editable: false,
                    allowBlank: false,
                    name: 'inputType',
                    hidden: true,
                    xtype: 'combo',
                    store: new Ext.data.ArrayStore({
                        fields: [
                            'name'
                        ],
                        data: [
                            ['TextField'],
                            ['TextArea'],
                            ['Date'],
                            ['File'],
                            ['Canvas'],
                            ['DropList'],
                            ['CheckBox'],
                            ['RadioButtons'],
                            ['YesOrNo'],
                            ['Color'],
                            ['DiyConfig'],
                            ['DiyDesign']
                        ]
                    }),
                    fieldLabel: i18n.getKey('inputType'),
                    displayField: 'name',
                    valueField: 'name',
                    itemId: 'inputType',
                    emptyText: '---' + i18n.getKey('selectInputType ') + '---',
                    //value: '---' + i18n.getKey('selectInputType ') + '---',
                    //defaultValue: '---' + i18n.getKey('selectInputType ') + '---',
                    listeners: {
                        "change": function (combo, newValue, oldValue) {
                            var p = combo.ownerCt.ownerCt;
                            var options = combo.ownerCt.getComponent('options');
                            if (Ext.Array.contains(notOptional, combo.getValue()) || Ext.isEmpty(newValue)) {
                                if (!Ext.isEmpty(options) && options.isVisible()) {
                                    options.setDisabled(true);
                                    options.setVisible(false);
                                    options.getGrid().setVisible(false);
                                }
                            } else {
                                if (Ext.isEmpty(options)) {
                                    var options = Ext.create("Ext.ux.form.GridField", {
                                        name: 'CGP.attribute.model.Attribute.options',
                                        xtype: 'gridfield',
                                        colspan: 2,
                                        allowBlank: false,
                                        gridConfig: optionGrid,
                                        fieldLabel: i18n.getKey('options'),
                                        itemId: 'options',
                                        id: 'options'
                                    });
                                    p.form.add(options);
                                    p.form.form._configData.push({
                                        data: {
                                            configuration: options.initialConfig,
                                            visible: options.isVisible()
                                        }
                                    });
                                } else if (!Ext.isEmpty(options) && !options.isVisible()) {
                                    options.setDisabled(false);
                                    options.setVisible(true);
                                    options.getGrid().setVisible(true);
                                }
                            }
                        }
                    }
                },
                {
                    name: 'useInCategoryNavigation',
                    xtype: 'checkbox',
                    hidden: true,
                    fieldLabel: i18n.getKey('useInCategoryNavigation'),
                    itemId: 'useInCategoryNavigation'
                }
            ]
        },
        listeners: {
            "render": function (page) {
                if (page.form.getCurrentMode() == 'editing') {
                    var option = Ext.create("Ext.ux.form.GridField", {
                        name: 'CGP.attribute.model.Attribute.options',
                        xtype: 'gridfield',
                        colspan: 2,
                        gridConfig: optionGrid,
                        fieldLabel: i18n.getKey('options'),
                        itemId: 'options',
                        id: 'options'
                    });
                    page.form.add(option);
                }
            },
            afterload: function (page) {
                if (page.form.getCurrentMode() == 'editing') {
                    page.toolbar.add({
                        xtype: 'button',
                        text: i18n.getKey('config') + i18n.getKey('multilingual'),
                        iconCls: 'icon_multilangual',
                        itemId: 'multilangual',
                        handler: function () {
                            var form = this.ownerCt.ownerCt.form;
                            var record = form._rawModels.items[0];
                            var id = record.getId();
                            var optionArr = record.get('options').map(function (option) {
                                return option.id;
                            }).toString();
                            var optionNameArr = record.get('options').map(function (option) {
                                return option.name;
                            }).toString();
                            var title = page.block;
                            var multilingualKey = record.get('multilingualKey');
                            JSOpen({
                                id: 'edit' + '_multilingual',
                                url: path + "partials/attribute/editmultilingual.html?id=" + id + '&title=' + title + '&multilingualKey=' + multilingualKey + '&optionArr=' + optionArr + '&optionNameArr=' + optionNameArr,
                                title: i18n.getKey(title) + i18n.getKey('multilingual') + i18n.getKey('config') + '(' + i18n.getKey('id') + ':' + id + ')',
                                refresh: true
                            });
                        }
                    })
                }
            },
            afterrender: function (page) {
                if (!Ext.isEmpty(JSGetQueryString('selectedAtr'))) {
                    var option = Ext.create("Ext.ux.form.GridField", {
                        name: 'CGP.attribute.model.Attribute.options',
                        xtype: 'gridfield',
                        colspan: 2,
                        gridConfig: optionGrid,
                        fieldLabel: i18n.getKey('options'),
                        itemId: 'options',
                        id: 'options'
                    });
                    page.form.add(option);
                    var selectedAtrdata = JSON.parse(decodeURI(JSGetQueryString('selectedAtr')));
                    var model = page.form.form.getModel()[0];
                    for (var i in selectedAtrdata) {
                        model.set(i, selectedAtrdata[i]);
                    }
                    setTimeout(function () {
                        page.form.form.setValuesByModel(model);
                    }, 500)
                }
            }
        }
    });
});
