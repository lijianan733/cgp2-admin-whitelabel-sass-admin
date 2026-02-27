/**
 * Created by nan on 2020/7/30.
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.view.AssertantsGridField',
    'CGP.common.condition.ConditionFieldV3'
])
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.view.DiyComponentFieldSet', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.diycomponentfieldset',
    width: 700,
    collapsible: true,
    /*
        minHeight: 150,
    */
    margin: '10 50 50 50',
    style: {
        padding: '10 25 10 25',
        borderRadius: '8px'
    },
    defaults: {
        width: 650,
        margin: '10 25 10 25',
        labelWidth: 150,
        allowBlank: true,
    },
    controller: Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.controller.Controller'),
    editViewType: null,
    model3DStore: Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.store.3DModelStore'),
    colorStore: Ext.create('CGP.color.store.ColorStore', {
        params: {
            filter: Ext.JSON.encode([{
                name: 'clazz',
                type: 'string',
                value: 'com.qpp.cgp.domain.common.color.RgbColor'
            }])
        }
    }),
    componentClazz: null,//组件类型
    componentPath: null,//组件路径
    listeners: {
        afterrender: function (fieldSet) {
            fieldSet.legend.add(fieldSet.createDeleteCmp());
            if (fieldSet.data) {
                fieldSet.setValue(fieldSet.data);
            }
        }
    },
    showSelectPathWin: function (materialPath) {
        var me = this;
        var editViewDataConfigs = me.ownerCt;
        var usingPath = [];
        var data = [];
        var tbar = editViewDataConfigs.ownerCt.getDockedItems('toolbar[dock="top"]')[0];
        var editViewType = tbar.getComponent('editViewType').getArrayValue();
        //遍历已经已经添加的组件，记录已经使用的路径
        for (var i = 0; i < editViewDataConfigs.items.items.length; i++) {
            var item = editViewDataConfigs.items.items[i];
            if (item == me) {//当前组件不记录

            } else {
                var componentPath = item.getValue().componentPath.path;
                var area = componentPath.match(/(?<=layoutPosition==').+?(?=\'\)\])/)[0];
                var component = componentPath.match(/(?<=@.name==').+?(?=\'\)\])/)[0];
                usingPath.push(area + '：' + component);
            }
        }
        console.log(usingPath);
        for (var i = 0; i < editViewType.areas.length; i++) {
            var area = editViewType.areas[i];
            var children = [];
            var components = area.components;
            for (var j = 0; j < components.length; j++) {
                //排除已经添加的路径
                if (!Ext.Array.contains(usingPath, area.layoutPosition + '：' + components[j].name)) {
                    children.push(
                        {
                            text: components[j].name,
                            leaf: true,
                            id: area.layoutPosition + '-' + components[j].name,
                            name: components[j].name,
                            type: components[j].type,
                            icon: path + 'ClientLibs/extjs/resources/themes/images/ux/category.png'
                        }
                    )
                }
            }
            //去除只有宽高，没有组件的区块
            if (children.length > 0) {
                data.push({
                    text: area.layoutPosition,
                    children: children,
                    leaf: false,
                    id: area.layoutPosition,
                    icon: path + 'ClientLibs/extjs/resources/themes/images/ux/category.png'
                })
            }
        }
        var win = Ext.create('Ext.window.Window', {
            width: 350,
            modal: true,
            constrain: true,
            height: 500,
            layout: 'fit',
            title: i18n.getKey('select') + i18n.getKey('path'),
            items: [
                {
                    xtype: 'treepanel',
                    rootVisible: false,
                    itemId: 'tree',
                    store: Ext.create('Ext.data.TreeStore', {
                        root: {
                            expanded: true,
                            children: data
                        }
                    }),
                    columns: [
                        {
                            xtype: 'treecolumn',
                            dataIndex: 'text',
                            flex: 1,
                            text: i18n.getKey('位置')
                        }
                    ],
                }
            ],
            listeners: {
                afterrender: function (win) {
                    var treePanel = win.items.items[0];
                    treePanel.expandAll(function () {
                        var selectPath = materialPath.getValue();
                        /*   if (selectPath) {//有值
                               treePanel.selectPath('/root/' + selectPath.replace('：', '/'));
                           }*/
                    });
                }
            },
            bbar: ['->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var treePanel = win.getComponent('tree');
                    var selectNode = treePanel.getSelectionModel().getSelection()[0];
                    var clazzField = materialPath.ownerCt.ownerCt.getComponent('clazz');
                    if (!Ext.isEmpty(selectNode)) {
                        if (selectNode.isLeaf() == true) {
                            var path = selectNode.get('id');
                            var area = path.split('-')[0];
                            var component = path.split('-')[1];
                            var type = selectNode.raw.type
                            var pathStr = area + '：' + component;/*"$.areas[?(@.position.layoutPosition==\'" + area + "\')].components[?(@.name==\'" + component + "\')][0]"*/
                            materialPath.setValue(pathStr);
                            clazzField.setValue(me.componentMapping[type]);
                            /*
                                                        clazzField.setReadOnly(true);
                            */
                            win.close();
                        } else {
                            Ext.Msg.alert('提示', '请选择一个子叶节点');
                        }
                    } else {
                        Ext.Msg.alert('提示', '请选择一个子叶节点');
                    }
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    win.close();
                }
            }]
        });
        win.show();
    },
    componentInfo: {
        'com.qpp.cgp.domain.product.config.view.builder.config.H1NavBarConfig': ['enableNavButton'],
        'com.qpp.cgp.domain.product.config.view.builder.config.DiceNavBarConfig': ['faces', 'styling'],
        'com.qpp.cgp.domain.product.config.view.builder.config.ImageLibraryConfig': [
            'title',
            /*'actions',*/
            'informationLanguageKey',
            'informationVariable',
            'informationVariableValueEx',
            'maxFileSize',
            'maxFileSizeUnit',
            'fileExtensions',
            'fileFilters',
            'showOpenLibrary',
            'showAutoFill',
            'fileConfig',
            'imageConfig',//图片信息配置的几个属性
            'showSetBackground'/*,
            'setBackgroundWithColor',//idReference,由showSetBoackground值来控制*/
        ],
        'com.qpp.cgp.domain.product.config.view.builder.config.BackgroundLibraryConfig': ['title'/*, 'actions'*/],
        'com.qpp.cgp.domain.product.config.view.builder.config.ColorLibraryConfig': ['title'/*, 'actions'*/],
        'com.qpp.cgp.domain.product.config.view.builder.config.FontLibraryConfig': ['title'/*, 'actions'*/],
        'com.qpp.cgp.domain.product.config.view.builder.config.ToolBarConfig': ['toolButtons'],
        'com.qpp.cgp.domain.product.config.view.builder.config.ToolTipsConfig': ['toolTips'],
        'com.qpp.cgp.domain.product.config.view.builder.config.SingleViewUploadEditBoardConfig': [
            'scrollY',
            'fileConfig',//这是上传的几个属性
            'downloadStrategy',
            'downloadTemplateName',
            'tipsLanguageKey',
            'informationTemplateName'
        ],
        'com.qpp.cgp.domain.product.config.view.builder.config.SingleViewBoardConfig': [
            'scrollY',
        ],
        'com.qpp.cgp.domain.product.config.view.builder.config.SingleViewEditBoardConfig': [
            'scrollY',
        ],
        'com.qpp.cgp.domain.product.config.view.builder.config.MultiViewUploadEditBoardConfig': [
            'scrollY',
        ],
        'com.qpp.cgp.domain.product.config.view.builder.config.SingleViewPreviewBoardConfig': [
            'scrollY',
        ],
        'com.qpp.cgp.domain.product.config.view.builder.config.AssistBarConfig': [
            'assistants'
        ],
        'com.qpp.cgp.domain.product.config.view.builder.config.CalendarNavBarConfig': [
            'startMonthValueEx',
            'totalValueEx'
        ],
        'com.qpp.cgp.domain.product.config.view.builder.config.PagingNavBarConfig': [],
        'com.qpp.cgp.domain.product.config.view.builder.config.ImageButtonNavBarConfig': ['buttons'],
        'com.qpp.cgp.domain.product.config.view.builder.config.ThreeDPreviewBoardConfig': ['model', 'pageScale', 'assets'],
        'com.qpp.cgp.domain.product.config.view.builder.config.ColorPropertyLibraryConfig': ['color', 'title']
    },
    componentMapping: {
        'H1NavBar': ['com.qpp.cgp.domain.product.config.view.builder.config.H1NavBarConfig'],
        'DiceNavBar': ['com.qpp.cgp.domain.product.config.view.builder.config.DiceNavBarConfig'],
        'ImageLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.ImageLibraryConfig'],
        'BackgroundLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.BackgroundLibraryConfig'],
        'FontLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.FontLibraryConfig'],
        'ColorLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.ColorLibraryConfig'],
        'ToolTips': ['com.qpp.cgp.domain.product.config.view.builder.config.ToolTipsConfig'],
        'ToolBar': ['com.qpp.cgp.domain.product.config.view.builder.config.ToolBarConfig'],
        'SingleViewBoard': ['com.qpp.cgp.domain.product.config.view.builder.config.SingleViewBoardConfig'],
        'SingleViewEditBoard': ['com.qpp.cgp.domain.product.config.view.builder.config.SingleViewEditBoardConfig'],
        'SingleViewUploadEditBoard': ['com.qpp.cgp.domain.product.config.view.builder.config.SingleViewUploadEditBoardConfig'],
        'MultiViewUploadEditBoard': ['com.qpp.cgp.domain.product.config.view.builder.config.MultiViewUploadEditBoardConfig'],
        'AssistBar': ['com.qpp.cgp.domain.product.config.view.builder.config.AssistBarConfig'],
        'SingleViewPreviewBoard': ['com.qpp.cgp.domain.product.config.view.builder.config.SingleViewPreviewBoardConfig'],
        'CalendarNavBar': ['com.qpp.cgp.domain.product.config.view.builder.config.CalendarNavBarConfig'],
        'PagingNavBar': ['com.qpp.cgp.domain.product.config.view.builder.config.PagingNavBarConfig'],
        'ImageButtonNavBar': ['com.qpp.cgp.domain.product.config.view.builder.config.ImageButtonNavBarConfig'],
        'ThreeDPreviewBoard': ['com.qpp.cgp.domain.product.config.view.builder.config.ThreeDPreviewBoardConfig'],
        'ColorPropertyLibrary': ['com.qpp.cgp.domain.product.config.view.builder.config.ColorPropertyLibraryConfig']
    },
    initComponent: function () {
        var me = this;
        //actions字段现在设计中没了
        var componentInfo = me.componentInfo;
        //现在根据editViewType中选择的类型来映射到对应的配置
        var componentMapping = me.componentMapping;
        var clazzStoreData = [];
        for (var i in componentMapping) {
            clazzStoreData.push({
                value: componentMapping[i][0],
                display: i
            });
        }
        var profileStore = Ext.data.StoreManager.get('profileStore');
        var model3DStore = me.model3DStore;
        var colorStore = me.colorStore;
        //构建valueEx使用的上下文
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var productId = builderConfigTab.productId;
        var contentData = me.controller.buildPMVTTContentData(productId);
        //建立上下文模板数据
        var contentTemplate = {
            args: {
                "context": {
                    "smv": {
                        "_id": "",
                        "idReference": "SimplifyMaterialView",
                        "clazz": "com.qpp.cgp.domain.simplifyBom.SimplifyMaterialView",
                        "name": "EVA Top",
                        "materialViewType": null,
                        "isNeedPreprocess": false,
                        "isNeedInitPageContent": false,
                    },
                    "properties": {}
                }
            }
        };
        for (var i = 0; i < contentData.length; i++) {
            contentTemplate.args.context.properties[contentData[i].key] = null;
        }
        me.optionItems = [
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('id'),
                itemId: 'id',
                hidden: true,
                name: 'id',
                value: me.componentId
            },
            {
                xtype: 'fieldcontainer',
                name: 'componentPath',
                layout: 'hbox',
                allowBlank: false,
                itemId: 'componentPath',
                fieldLabel: i18n.getKey('component') + i18n.getKey('path'),
                items: [
                    {
                        xtype: 'textfield',
                        itemId: 'componentPath',
                        name: 'componentPath',
                        flex: 1,
                        margin: '0 5 0 0',
                        fieldStyle: 'background-color:silver',
                        editable: false,
                        readOnly: true,
                        allowBlank: false,
                        fieldLabel: false,
                        listeners: {
                            change: function (textarea, newValue, oldValue) {
                                if (newValue) {
                                    var clazz = textarea.ownerCt.ownerCt.getComponent('clazz');
                                    clazz.reset();
                                    clazz.show();
                                    clazz.setDisabled(false);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('choice'),
                        width: 50,
                        itemId: 'button',
                        handler: function (btn) {
                            var componentPath = btn.ownerCt.getComponent('componentPath');
                            var form = btn.ownerCt.ownerCt;
                            form.showSelectPathWin(componentPath);
                        }
                    }
                ],
                isValid: function () {
                    var me = this;
                    return me.getComponent('componentPath').isValid();
                },
                getName: function () {
                    return this.name;
                },
                setValue: function (data) {
                    var me = this;
                    if (data) {
                        if (data.clazz == "com.qpp.cgp.domain.product.config.view.builder.config.NamePath") {
                            var name = data.name;
                            var area = data.path.match(/(?<=layoutPosition==').+?(?=\'\)\])/)[0];
                            me.getComponent('componentPath').setValue(area + '：' + name);
                        } else {
                            var area = data.path.match(/(?<=layoutPosition==').+?(?=\'\)\])/)[0];
                            var component = data.path.match(/(?<=@.name==').+?(?=\'\)\])/)[0];
                            me.getComponent('componentPath').setValue(area + '：' + component);
                        }

                    }
                },
                getValue: function () {
                    var me = this;
                    var path = me.getComponent('componentPath').getValue();
                    var area = path.split('：')[0];
                    var component = path.split('：')[1];
                    var pathStr = "$.areas[?(@.position.layoutPosition==\'" + area + "\')].components[?(@.name==\'" + component + "\')]";
                    return {
                        clazz: 'com.qpp.cgp.domain.product.config.view.builder.config.FullPath',
                        path: pathStr
                    }
                }
            },
            {
                xtype: 'combo',
                name: 'clazz',
                itemId: 'clazz',
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('type'),
                valueField: 'value',
                displayField: 'display',
                allowBlank: false,
                editable: false,
                /*
                                readOnly: true,
                */
                fieldStyle: 'background-color:silver',
                listeners: {
                    afterrender: function (combo) {
                        var me = this;
                        var picker = this.getPicker();
                        var componentPath = me.ownerCt.getComponent('componentPath');
                        picker.on('show', function () {
                            var componentPathValue = componentPath.getValue();
                            if (componentPathValue) {
                                me.store.clearFilter();
                                me.store.load();
                                var path = componentPathValue.path;
                                me.store.filter(function (record) {
                                    if (path.indexOf("layoutPosition=='H1'") != -1) {
                                        return record.get('value') == 'com.qpp.cgp.domain.product.config.view.builder.config.H1NavBarConfig';
                                    } else if (path.indexOf("layoutPosition=='Document'") != -1) {
                                        return true;
                                    } else {
                                        return true;
                                    }
                                });
                            } else {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择组件路径'));
                            }
                        })
                    },
                    change: function (combo, newValue, oldValue) {
                        var componentFieldset = combo.ownerCt;
                        componentFieldset.suspendLayouts();//挂起布局
                        var allowUseFields = ['clazz', 'componentPath'];
                        allowUseFields = allowUseFields.concat(componentInfo[newValue]);
                        for (var i = 0; i < componentFieldset.items.items.length; i++) {
                            var item = componentFieldset.items.items[i];
                            if (item.getName() == 'id') {

                            } else {
                                if (Ext.Array.contains(allowUseFields, item.getName())) {
                                    item.show();
                                    item.setDisabled(false);
                                } else {
                                    item.hide();
                                    item.setDisabled(true);
                                }
                            }
                        }
                        componentFieldset.resumeLayouts();//恢复布局
                        componentFieldset.doLayout();
                    }
                },
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'display',
                        'value'
                    ],
                    data: clazzStoreData
                })
            },
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('title'),
                itemId: 'title',
                hidden: true,
                disabled: true,
                name: 'title',
                valueField: 'value',
                displayField: 'display',
                editable: true,
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: 'TAB_IMAGES',
                            display: 'TAB_IMAGES'
                        }, {
                            value: 'TAB_TEXT',
                            display: 'TAB_TEXT'
                        },
                        {
                            value: 'TAB_COLOR',
                            display: 'TAB_COLOR'
                        }
                    ]
                })
            },
            {
                xtype: 'uxfieldset',
                itemId: 'imageConfig',
                name: 'imageConfig',
                hidden: true,
                disabled: true,
                autoRender: true,
                collapsible: true,
                title: i18n.getKey('提示信息配置'),
                layout: {
                    type: 'vbox'
                },
                defaults: {
                    labelWidth: 150,
                    width: '100%',
                },
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('information LanguageKey'),
                        itemId: 'informationLanguageKey',
                        name: 'informationLanguageKey',
                        displayField: 'display',
                        valueField: 'value',
                        editable: true,
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value', 'display'
                            ],
                            data: [
                                {
                                    value: 'FILE_TYPES_ACCEPTED',
                                    display: 'FILE_TYPES_ACCEPTED',
                                }, {
                                    value: 'FILE_TYPES_ACCEPTED_ENGRAVED_DICE',
                                    display: 'FILE_TYPES_ACCEPTED_ENGRAVED_DICE',
                                }
                            ]
                        })
                    },
                    {
                        xtype: 'objectvaluefield',
                        fieldLabel: i18n.getKey('information Variable'),
                        itemId: 'informationVariable',
                        name: 'informationVariable',
                        maxHeight: 350,
                        optionalKey: ['format', 'dpi', 'maxFileSize', 'maxFileSizeUnit', 'width', 'height'],
                        jsonTreePanelConfig: {
                            isHideActionColumn: false,
                            importBtnConfig: {
                                hidden: false,
                            }
                        },
                        initData: {
                            format: 'jpg, jpeg, bmp, png, gif',
                            dpi: 300,
                            maxFileSize: 300,
                            maxFileSizeUnit: 'MB'
                        }
                    },
                    {
                        xtype: 'gridfieldwithcrudv2',
                        fieldLabel: i18n.getKey('information VariableValueEx'),
                        itemId: 'informationVariableValueEx',
                        name: 'informationVariableValueEx',
                        minHeight: 100,
                        diySetValue: function (data) {
                            var me = this;
                            var keys = Object.keys(data || {});
                            var result = [];
                            for (var i = 0; i < keys.length; i++) {
                                result.push({
                                    key: keys[i],
                                    value: data[keys[i]]
                                })
                            }
                            me.setSubmitValue(result);
                        },
                        diyGetValue: function () {
                            var me = this;
                            var data = me.getSubmitValue();
                            var result = {};
                            for (var i = 0; i < data.length; i++) {
                                result[data[i].key] = data[i].value;
                            }
                            return result;
                        },
                        gridConfig: {
                            store: Ext.create('Ext.data.Store', {
                                autoSync: true,
                                fields: [
                                    {name: 'key', type: 'string'},
                                    {name: 'value', type: 'object'}
                                ],
                                data: []
                            }),
                            columns: [
                                {
                                    flex: 1,
                                    text: i18n.getKey('key'),
                                    dataIndex: 'key',
                                    tdCls: 'vertical-middle'
                                },
                                {
                                    text: i18n.getKey('value'),
                                    dataIndex: 'value',
                                    flex: 1,
                                    readOnly: true,
                                    canChangeValue: false,
                                    xtype: 'valueexcomponentcolumn',
                                    tdCls: 'vertical-middle'
                                }
                            ]
                        },
                        winConfig: {
                            formConfig: {
                                isValid: function () {
                                    var me = this;
                                    var isValid = true;
                                    for (var i = 0; i < me.items.items.length; i++) {
                                        if (me.items.items[i].isValid() == false) {
                                            isValid = false;
                                        }
                                    }
                                    return isValid;
                                },
                                saveHandler: function (btn) {
                                    var form = btn.ownerCt.ownerCt;
                                    var win = form.ownerCt;
                                    if (form.isValid()) {
                                        var data = {};
                                        form.items.items.forEach(function (item) {
                                            if (item.disabled == false) {
                                                //自定义获取值优先级高于普通getValue
                                                if (item.diyGetValue) {
                                                    data[item.getName()] = item.diyGetValue();
                                                } else {
                                                    data[item.getName()] = item.getValue();
                                                }
                                            }
                                        });
                                        console.log(data);
                                        var record = win.outGrid.store.findRecord('key', data.key);
                                        if (win.createOrEdit == 'create') {
                                            if (record) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('该key已经存在，不予许重复添加'));
                                            } else {
                                                win.outGrid.store.add(data);
                                                win.close();
                                            }
                                        } else {
                                            if (record && record != win.record) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('该key已经存在，不予许重复添加'));
                                            } else {
                                                for (var i in data) {
                                                    win.record.set(i, data[i]);
                                                }
                                                win.close();
                                            }
                                        }
                                    }
                                },
                                items: [
                                    {
                                        xtype: 'combo',
                                        name: 'key',
                                        itemId: 'key',
                                        allowBlank: false,
                                        fieldLabel: i18n.getKey('key'),
                                        displayField: 'display',
                                        valueField: 'value',
                                        editable: true,
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['value', 'display'],
                                            data: [
                                                {
                                                    value: 'width',
                                                    display: 'width'
                                                },
                                                {
                                                    value: 'height',
                                                    display: 'height'
                                                }
                                            ]
                                        })
                                    },
                                    {
                                        name: 'value',
                                        itemId: 'value',
                                        allowBlank: false,
                                        xtype: 'valueexfield',
                                        msgTarget: 'side',
                                        combineErrors: true,
                                        fieldLabel: i18n.getKey('value'),
                                        commonPartFieldConfig: {
                                            uxTextareaContextData: true,
                                            defaultValueConfig: {
                                                type: 'String',
                                                clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                                                typeSetReadOnly: false,
                                                clazzSetReadOnly: true

                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                ]
            },
            {
                xtype: 'uxfieldset',
                itemId: 'fileConfig',
                name: 'fileConfig',
                hidden: true,
                disabled: true,
                autoRender: true,
                collapsible: true,
                title: i18n.getKey('文件上传配置'),
                layout: {
                    type: 'vbox'
                },
                defaults: {
                    labelWidth: 150,
                    width: '100%',
                },
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('maxFileSize'),
                        itemId: 'maxFileSize',
                        minValue: 0,
                        /* hidden: true,
                         disabled: true,*/
                        name: 'maxFileSize'
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('maxFileSizeUnit'),
                        itemId: 'maxFileSizeUnit',
                        name: 'maxFileSizeUnit',
                        /*hidden: true,
                        disabled: true,*/
                        valueField: 'value',
                        displayField: 'display',
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value', 'display'
                            ],
                            data: [
                                {
                                    value: 'B',
                                    display: 'B'
                                }, {
                                    value: 'KB',
                                    display: 'KB'
                                }, {
                                    value: 'MB',
                                    display: 'MB'
                                }, {
                                    value: 'GB',
                                    display: 'GB'
                                }
                            ]
                        })
                    },
                    {
                        name: 'fileExtensions',
                        itemId: 'fileExtensions',
                        xtype: 'arraydatafield',
                        allowBlank: true,
                        /*hidden: true,
                        disabled: true,*/
                        fieldLabel: i18n.getKey('fileExtensions'),
                        resultType: 'String',
                        panelConfig: {
                            width: '100%',
                            minHeight: 50,
                            allowBlank: true,
                            bodyStyle: {
                                borderColor: '#c0c0c0'
                            }
                        },
                        optionalData: [
                            {
                                value: 'jpg',
                                display: 'jpg'
                            }, {
                                value: 'jpeg',
                                display: 'jpeg'
                            }, {
                                value: 'bmp',
                                display: 'bmp'
                            }, {
                                value: 'png',
                                display: 'png'
                            }, {
                                value: 'gif',
                                display: 'gif'
                            }
                        ]
                    },
                    {
                        name: 'fileFilters',
                        itemId: 'fileFilters',
                        xtype: 'arraydatafield',
                        allowBlank: true,
                        resultType: 'String',
                        /*   hidden: true,
                           disabled: true,*/
                        fieldLabel: i18n.getKey('fileFilters'),
                        panelConfig: {
                            width: '100%',
                            minHeight: 50,
                            allowBlank: true,
                            bodyStyle: {
                                borderColor: '#c0c0c0'
                            }
                        },
                        optionalData: [
                            {
                                value: 'image/jpg',
                                display: 'image/jpg'
                            }, {
                                value: 'image/jpeg',
                                display: 'image/jpeg'
                            }, {
                                value: 'image/bmp',
                                display: 'image/bmp'
                            }, {
                                value: 'image/png',
                                display: 'image/png'
                            }, {
                                value: 'image/gif',
                                display: 'image/gif'
                            }, {
                                value: 'image/tif',
                                display: 'image/tif'
                            }, {
                                value: 'image/tiff',
                                display: 'image/tiff'
                            }
                        ]
                    },
                ]
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18n.getKey('showOpenLibrary'),
                itemId: 'showOpenLibrary',
                name: 'showOpenLibrary',
                hidden: true,
                disabled: true
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18n.getKey('showAutoFill'),
                itemId: 'showAutoFill',
                name: 'showAutoFill',
                hidden: true,
                disabled: true,
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18n.getKey('"设置为背景"是否显示'),
                itemId: 'showSetBackground',
                name: 'showSetBackground',
                hidden: true,
                disabled: true,
                listeners: {
                    change: function (checkbox, newValue, oldValue) {
                       
                        var setBackgroundWithColor = checkbox.ownerCt.getComponent('setBackgroundWithColor');
                        if (newValue) {
                            setBackgroundWithColor.setDisabled(false);
                            setBackgroundWithColor.show();
                        } else {
                            setBackgroundWithColor.setDisabled(true);
                            setBackgroundWithColor.hide();
                        }
                    }
                }
            },
            {
                xtype: 'gridcombo',
                fieldLabel: i18n.getKey('背景遮盖颜色'),
                itemId: 'setBackgroundWithColor',
                name: 'setBackgroundWithColor',
                valueField: '_id',
                hidden: true,
                disabled: true,
                displayField: 'colorName',
                store: colorStore,
                editable: false,
                matchFieldWidth: true,
                filterCfg: {
                    minHeight: 60,
                    layout: {
                        type: 'column',
                        columns: 2
                    },
                    items: [
                        {
                            name: '_id',
                            xtype: 'textfield',
                            hideTrigger: true,
                            isLike: false,
                            allowDecimals: false,
                            fieldLabel: i18n.getKey('id'),
                            itemId: '_id'
                        }, {
                            name: 'colorName',
                            xtype: 'textfield',
                            hideTrigger: true,
                            isLike: false,
                            margin: 0,
                            allowDecimals: false,
                            fieldLabel: i18n.getKey('color') + i18n.getKey('name'),
                            itemId: 'colorName'
                        }
                    ]
                },
                gridCfg: {
                    width: 600,
                    height: 450,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            itemId: '_id',
                        }, {
                            text: i18n.getKey('color') + i18n.getKey('name'),
                            dataIndex: 'colorName',
                            itemId: 'colorName',
                            width: 110,
                        }, {
                            text: i18n.getKey('color') + i18n.getKey('code') + '(16进制)',
                            dataIndex: 'displayCode',
                            itemId: 'displayCode',
                            width: 150,
                        },
                        {
                            text: i18n.getKey('显示颜色'),
                            itemId: 'color',
                            dataIndex: 'color',
                            flex: 1,
                            minWidth: 100
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: colorStore,
                        displayInfo: true,
                        displayMsg: '',
                        emptyMsg: i18n.getKey('noData')
                    })
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setInitialValue([data._id]);
                    } else {
                        me.setValue(null);
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    var dataMapping = me.getValue();
                    var id = me.getSubmitValue()[0];
                    if (id) {
                        return {
                            '_id': id,
                            'clazz': 'com.qpp.cgp.domain.common.color.RgbColor'
                        };
                    } else {
                        return null;
                    }
                }
            },
            {
                name: 'toolButtons',
                itemId: 'toolButtons',
                xtype: 'arraydatafield',
                allowBlank: true,
                hidden: true,
                disabled: true,
                allowChangSort: true,
                resultType: 'Array',
                tipInfo: '可拖拽调整顺序',
                fieldLabel: i18n.getKey('按钮列表'),
                colspan: 2,
                panelConfig: {
                    width: '100%',
                    minHeight: 50,
                    allowBlank: true,
                    bodyStyle: {
                        borderColor: '#c0c0c0'
                    }
                },
                value: ["undo", "redo", "centered", "horizontally", "vertical", "elementDelete"],
                optionalData: [
                    {
                        value: 'undo',
                        display: i18n.getKey('undo')
                    }, {
                        value: 'redo',
                        display: i18n.getKey('redo')
                    }, {
                        value: 'moveDown',
                        display: i18n.getKey('moveDown')
                    }, {
                        value: 'moveUp',
                        display: i18n.getKey('moveUp')
                    }, {
                        value: 'moveToTop',
                        display: i18n.getKey('moveToTop')
                    }, {
                        value: 'moveToBottom',
                        display: i18n.getKey('moveToBottom')
                    }, {
                        value: 'centered',
                        display: i18n.getKey('centered')
                    }, {
                        value: 'horizontally',
                        display: i18n.getKey('horizontally')
                    }, {
                        value: 'vertical',
                        display: i18n.getKey('vertical')
                    }, {
                        value: 'elementDelete',
                        display: i18n.getKey('elementDelete')
                    }
                ]
            },
            {
                name: 'toolTips',
                itemId: 'toolTips',
                xtype: 'arraydatafield',
                allowChangSort: true,
                allowBlank: true,
                hidden: true,
                disabled: true,
                resultType: 'Array',
                tipInfo: '可拖拽调整顺序',
                fieldLabel: i18n.getKey('提示信息列表'),
                colspan: 2,
                value: ["supportIntroduce", "cutlineIntroduce", "imgIntroduce"],
                panelConfig: {
                    width: '100%',
                    minHeight: 50,
                    allowBlank: true,
                    bodyStyle: {
                        borderColor: '#c0c0c0'
                    }
                },
                optionalData: [
                    {
                        value: 'supportIntroduce',
                        display: i18n.getKey('supportIntroduce')
                    }, {
                        value: 'fontIntroduce',
                        display: i18n.getKey('fontIntroduce')
                    }, {
                        value: 'cutlineIntroduce',
                        display: i18n.getKey('cutlineIntroduce')
                    }, {
                        value: 'imgIntroduce',
                        display: i18n.getKey('imgIntroduce')
                    }
                ]
            },
            {
                xtype: 'arraydatafield',
                fieldLabel: i18n.getKey('customFaces'),
                name: 'faces',
                itemId: 'faces',
                hidden: true,
                multiSelect: true,
                disabled: true,
                valueField: 'value',
                displayField: 'display',
                editable: false,
                tipInfo: '可拖拽内容项调整顺序',
                fieldStyle: 'background-color:silver',
                value: ['top', 'front', 'left', 'right', 'back', 'bottom'],
                allowBlank: true,
                allowChangSort: true,
                allowDelete: false,
                resultType: 'Array',
                colspan: 2,
                panelConfig: {
                    dockedItems: [],
                    width: '100%',
                    minHeight: 50,
                    allowBlank: true,
                    bodyStyle: {
                        borderColor: '#c0c0c0'
                    }
                },
                optionalData: [
                    {
                        value: 'top',
                        display: '上面'
                    }, {
                        value: 'front',
                        display: '前面'
                    }, {
                        value: 'left',
                        display: '左面'
                    }, {
                        value: 'right',
                        display: '右面'
                    }, {
                        value: 'back',
                        display: '后面'
                    }, {
                        value: 'bottom',
                        display: '下面'
                    }
                ]
            },
            {

                xtype: 'combo',
                fieldLabel: i18n.getKey('styling'),
                itemId: 'styling',
                name: 'styling',
                hidden: true,
                disabled: true,
                valueField: 'value',
                displayField: 'display',
                editable: false,
                value: 'straight',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: 'round',
                            display: i18n.getKey('round')
                        },
                        {
                            value: 'straight',
                            display: i18n.getKey('straight')
                        }
                    ]

                })
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18n.getKey('enableNavButton'),
                itemId: 'enableNavButton',
                name: 'enableNavButton',
                hidden: true,
                disabled: true,
            },
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('downloadStrategy'),
                itemId: 'downloadStrategy',
                name: 'downloadStrategy',
                hidden: true,
                disabled: true,
                valueField: 'value',
                displayField: 'display',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: 'immediately',
                            display: i18n.getKey('立即下载')
                        },
                        {
                            value: 'detail',
                            display: i18n.getKey('详情页下载')
                        }
                    ]

                })
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('download TemplateName'),
                itemId: 'downloadTemplateName',
                name: 'downloadTemplateName',
                hidden: true,
                disabled: true,
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('information TemplateName'),
                itemId: 'informationTemplateName',
                name: 'informationTemplateName',
                hidden: true,
                disabled: true,
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('tipsLanguageKey'),
                itemId: 'tipsLanguageKey',
                name: 'tipsLanguageKey',
                hidden: true,
                disabled: true,
            },
            {
                xtype: 'assertantsgridfield',
                maxHeight: 350,
                allowBlank: false,
                hidden: true,
                disabled: true,
                profileStore: profileStore,
                name: 'assistants',
                itemId: 'assistants',
                fieldLabel: i18n.getKey('assistants')
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18n.getKey('适应界面宽'),
                itemId: 'scrollY',
                name: 'scrollY',
                hidden: true,
                disabled: true
            },
            {
                name: 'startMonthValueEx',
                itemId: 'startMonthValueEx',
                allowBlank: false,
                xtype: 'valueexfield',
                msgTarget: 'side',
                combineErrors: true,
                hidden: true,
                disabled: true,
                tipInfo: 'startMonthValueEx返回数据格式为： yyyy-MM，如2020-01',
                fieldLabel: i18n.getKey('startMonthValueEx'),
                commonPartFieldConfig: {
                    uxTextareaContextData: true,
                    defaultValueConfig: {
                        type: 'String',
                        clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                        typeSetReadOnly: true,
                        clazzSetReadOnly: false

                    }
                }
            },
            {
                name: 'totalValueEx',
                itemId: 'totalValueEx',
                allowBlank: false,
                xtype: 'valueexfield',
                msgTarget: 'side',
                hidden: true,
                disabled: true,
                combineErrors: true,
                fieldLabel: i18n.getKey('totalValueEx'),
                commonPartFieldConfig: {
                    uxTextareaContextData: true,
                    defaultValueConfig: {
                        type: 'Number',
                        clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                        typeSetReadOnly: true,
                        clazzSetReadOnly: false

                    }
                }
            },
            {
                xtype: 'gridfieldwithcrudv2',
                fieldLabel: i18n.getKey('buttons'),
                itemId: 'buttons',
                name: 'buttons',
                minHeight: 100,
                winConfig: {
                    formConfig: {
                        width: 500,
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'displayName',
                                itemId: 'displayName',
                                width: 450,
                                allowBlank: false,
                                fieldLabel: i18n.getKey('displayName'),
                            }, {
                                xtype: 'fileupload',
                                editable: false,
                                name: 'imagePath',
                                width: 450,
                                itemId: 'imagePath',
                                fieldLabel: i18n.getKey('imagePath'),
                            }
                        ]
                    },
                },
                hidden: true,
                disabled: true,
                gridConfig: {
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        fields: [
                            {name: 'imagePath', type: 'string'},
                            {name: 'displayName', type: 'string'}
                        ],
                        data: []
                    }),
                    columns: [
                        {
                            text: i18n.getKey('displayName'),
                            dataIndex: 'displayName',
                            tdCls: 'vertical-middle'
                        },
                        {
                            text: i18n.getKey('imagePath'),
                            dataIndex: 'imagePath',
                            flex: 1,
                        }
                    ]
                },
            },
            {
                xtype: 'gridcombo',
                fieldLabel: i18n.getKey('3D模型数据'),
                allowBlank: false,
                valueField: '_id',
                displayField: 'modelName',
                store: model3DStore,
                editable: false,
                itemId: 'model',
                hidden: true,
                disabled: true,
                name: 'model',
                matchFieldWidth: false,
                colspan: 1,
                gridCfg: {
                    width: 650,
                    store: model3DStore,
                    height: 350,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            itemId: '_id',
                        }, {
                            text: i18n.getKey('name'),
                            dataIndex: 'modelName',
                            itemId: 'modelName',
                            flex: 1
                        }, {
                            text: i18n.getKey('description'),
                            dataIndex: 'description',
                            itemId: 'description',
                            flex: 1
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: model3DStore,
                        displayInfo: true,
                        displayMsg: '',
                        emptyMsg: i18n.getKey('noData')
                    })
                },
                filterCfg: {
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    defaults: {
                        width: 250,
                    },
                    height: 80,
                    items: [
                        {
                            name: '_id',
                            xtype: 'textfield',
                            isLike: false,
                            fieldLabel: i18n.getKey('id'),
                            itemId: 'id'
                        },
                        {
                            name: 'description',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('description'),
                            itemId: 'description'
                        },
                        {
                            name: 'modelName',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            itemId: 'name'
                        }
                    ]
                },
                diyGetValue: function () {
                    var me = this;
                    console.log(me.getSubmitValue())
                    return {
                        clazz: "com.qpp.cgp.domain.product.config.model.ThreeDModelConfig",
                        multilingualKey: "com.qpp.cgp.domain.product.config.model.ThreeDModelConfig",
                        _id: me.getSubmitValue()[0]
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setInitialValue([data._id]);
                    }
                }
            },
            {
                xtype: 'numberfield',
                name: 'pageScale',
                minValue: 0,
                itemId: 'pageScale',
                value: 1,
                hidden: true,
                disabled: true,
                allowDecimals: true,
                decimalPrecision: 2,
                fieldLabel: i18n.getKey('pageScale'),
            },
            {
                xtype: 'gridfieldwithcrudv2',
                fieldLabel: i18n.getKey('assets'),
                itemId: 'assets',
                name: 'assets',
                hidden: true,
                disabled: true,
                height: 200,
                gridConfig: {
                    autoScroll: true,
                    viewConfig: {
                        autoScroll: true,
                    },
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        fields: [
                            {name: 'name', type: 'string'},
                            {name: 'pcIndex', type: 'number', useNull: true},
                            {
                                name: 'imageName', type: 'string', useNull: true, convert: function (value, record) {
                                    if (Ext.isEmpty(value)) {
                                        return null;
                                    } else {
                                        return value;
                                    }
                                }
                            },
                            {name: 'description', type: 'string'},
                            {name: 'useTransparentMaterial', type: 'boolean'},
                            {name: 'condition', type: 'object'},
                            {name: 'conditionDTO', type: 'object'},
                            {name: 'type', type: 'string'}
                        ],
                        data: []
                    }),
                    columns: [
                        {
                            text: i18n.getKey('材质名'),
                            dataIndex: 'name',
                            width: 150,
                            tdCls: 'vertical-middle'
                        },
                        {
                            text: i18n.getKey('description'),
                            dataIndex: 'description',
                            width: 150,
                            tdCls: 'vertical-middle'
                        },
                        {
                            text: i18n.getKey('condition'),
                            dataIndex: 'condition',
                            xtype: 'componentcolumn',
                            width: 100,
                            renderer: function (value, metadata, record) {
                                if (value) {
                                    metadata.tdAttr = 'data-qtip="查看"';
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>查看</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    JSShowJsonData(value, i18n.getKey('condition'));
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            text: i18n.getKey('pcIndex'),
                            dataIndex: 'pcIndex',
                            width: 100,
                        },
                        {
                            text: i18n.getKey('image') + i18n.getKey('name'),
                            dataIndex: 'imageName',
                            tdCls: 'vertical-middle',
                            xtype: 'componentcolumn',
                            width: 100,
                            renderer: function (value, metadata, record) {
                                if (!Ext.isEmpty(value)) {
                                    metadata.tdAttr = 'data-qtip="查看"';
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>查看</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    JSShowJsonData(value, '查看图片路径');
                                                });
                                            }
                                        }
                                    };
                                }
                            }
                        },
                        {
                            dataIndex: 'useTransparentMaterial',
                            text: i18n.getKey('是否使用透明材质'),
                            width: 100,
                        },
                        {
                            text: i18n.getKey('image') + i18n.getKey('type'),
                            dataIndex: 'type',
                            width: 100,
                            tdCls: 'vertical-middle',
                            renderer: function (value, mateData, record) {
                                if (value == 'Fix') {
                                    return '固定内容';
                                } else if (value == 'Dynamic') {
                                    return '定制内容';
                                }
                            }
                        },
                    ]
                },
                winConfig: {
                    setValueHandler: function (data) {
                        var win = this;
                        //本来应该是去修改组件获取数据的方法，使它们获取到的数据每次都是个独立的对象，使之修改获取到的数据不会互相影响
                        data = Ext.clone(data);
                        var form = win.getComponent('form');
                        form.items.items.forEach(function (item) {
                            if (item.disabled == false) {
                                if (item.diySetValue) {
                                    item.diySetValue(data[item.getName()]);
                                } else {
                                    item.setValue(data[item.getName()]);
                                }
                            }
                        })

                        //对数据进行处理
                        var condition = form.getComponent('condition');
                        var conditionDTO = form.getComponent('conditionDTO');
                        if (data.conditionDTO) {
                            //如果有配置conditionDto，则显示新的条件组件，否则使用旧的
                            conditionDTO.show();
                            conditionDTO.setDisabled(false);
                            condition.hide();
                            condition.setDisabled(true);
                        } else {
                            if (Ext.isEmpty(data.condition)) {
                                //两个都没配置使用新的组件
                                conditionDTO.show();
                                conditionDTO.setDisabled(false);
                                condition.hide();
                                condition.setDisabled(true);
                            } else {
                                condition.show();
                                condition.setDisabled(false);
                                conditionDTO.hide();
                                conditionDTO.setDisabled(true);
                            }
                        }
                    },
                    formConfig: {
                        width: 500,
                        defaults: {
                            width: 450
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'name',
                                itemId: 'name',
                                allowBlank: false,
                                fieldLabel: i18n.getKey('材质名'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'description',
                                itemId: 'description',
                                allowBlank: false,
                                fieldLabel: i18n.getKey('description'),
                            },
                            {
                                xtype: 'valueexfield',
                                name: 'condition',
                                minValue: 0,
                                itemId: 'condition',
                                allowBlank: true,
                                hidden: true,
                                fieldLabel: i18n.getKey('condition'),
                                commonPartFieldConfig: {
                                    uxTextareaContextData: true,
                                    defaultValueConfig: {
                                        type: 'Boolean',
                                        typeSetReadOnly: true,
                                    }
                                }
                            },
                            {
                                xtype: 'conditionfieldv3',
                                fieldLabel: i18n.getKey('condition'),
                                name: 'conditionDTO',
                                allowBlank: true,
                                contentData: contentData,
                                contentTemplate: contentTemplate,
                                itemId: 'conditionDTO'
                            },
                            {
                                xtype: 'numberfield',
                                name: 'pcIndex',
                                minValue: 0,
                                itemId: 'pcIndex',
                                allowBlank: true,
                                fieldLabel: i18n.getKey('pcIndex'),
                            },
                            {
                                xtype: 'fileuploadv2',
                                name: 'imageName',
                                itemId: 'imageName',
                                allowBlank: true,
                                formFileName: 'file',
                                valueUrlType: 'part',
                                staticDir:'model-preview/data/image',
                                fieldLabel: i18n.getKey('image') + i18n.getKey('name'),
                            },
                            {
                                xtype: 'checkbox',
                                name: 'useTransparentMaterial',
                                itemId: 'useTransparentMaterial',
                                checked: false,
                                fieldLabel: i18n.getKey('是否使用透明材质'),
                            },
                            {
                                xtype: 'combo',
                                editable: false,
                                name: 'type',
                                itemId: 'type',
                                valueField: 'value',
                                displayField: 'display',
                                value: 'Dynamic',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['value', 'display'],
                                    data: [{
                                        value: 'Dynamic',
                                        display: i18n.getKey('定制内容')
                                    }, {
                                        value: 'Fix',
                                        display: '固定内容'
                                    }]
                                }),
                                fieldLabel: i18n.getKey('image') + i18n.getKey('type'),
                            }
                        ],
                        saveHandler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            if (form.isValid()) {
                                var data = {};
                                form.items.items.forEach(function (item) {
                                    if (item.disabled == false) {
                                        //自定义获取值优先级高于普通getValue
                                        if (item.diyGetValue) {
                                            data[item.getName()] = item.diyGetValue();
                                        } else {
                                            data[item.getName()] = item.getValue();
                                        }
                                    }
                                });
                                console.log(data);

                                //对conditionDTO字段进行处理，用改字段生成condition字段,如果以前有旧数据,使用以前的
                                //如果是使用conditionDTO组件，再期其清空数据时，把condition也做清除
                                var conditionDTO = form.getComponent('conditionDTO');
                                if (conditionDTO.hidden == false) {
                                    if (data.conditionDTO) {
                                        data.condition = conditionDTO.getExpression();
                                    } else {
                                        data.condition = null;
                                    }
                                } else {
                                    data.conditionDTO = null;
                                }

                                if (win.createOrEdit == 'create') {
                                    win.outGrid.store.add(data);
                                } else {
                                    for (var i in data) {
                                        win.record.set(i, data[i]);
                                    }
                                }
                                win.close();
                            }
                        },
                        isValid: function () {
                            var form = this;
                            this.msgPanel.hide();
                            var isValid = true,
                                errors = {};
                            this.items.items.forEach(function (f) {
                                if (!f.isValid()) {
                                    var errorInfo = f.getErrors();
                                    if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                                        errors = Ext.Object.merge(errors, errorInfo);
                                    } else {
                                        errors[f.getFieldLabel()] = errorInfo;
                                    }
                                    isValid = false;

                                }
                            });
                            var pcIndex = form.getComponent('pcIndex').getValue();
                            var imageName = form.getComponent('imageName').getValue();
                            if (Ext.isEmpty(pcIndex) && Ext.isEmpty(imageName)) {
                                errors['提示'] = 'pcIndex或imageName必须配置一项';
                                isValid = false;
                            } else if ((!Ext.isEmpty(pcIndex)) && (!Ext.isEmpty(imageName))) {
                                errors['提示'] = '不允许pcIndex和imageName同时配置';
                                isValid = false;
                            }
                            isValid ? null : this.showErrors(errors);
                            return isValid;
                        }
                    }
                },
            },
            {
                name: 'color',
                xtype: 'attributetreecombo',
                hidden: true,
                disabled: true,
                profileStore: profileStore,
                fieldLabel: i18n.getKey('color'),
                itemId: 'color',
            }
        ];
        me.items = me.optionItems;
        /*     var usingComponentItems = [];
             usingComponentItems = usingComponentItems.concat(me.componentInfo['common']);
             usingComponentItems = usingComponentItems.concat(me.componentInfo[me.data.clazz]);
             for (var i = 0; i < me.optionItems.length; i++) {
                 if (Ext.Array.contains(usingComponentItems, me.optionItems[i]['name'])) {
                     me.items.push(me.optionItems[i]);
                 }
             }*/
        me.callParent();
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {};
        me.items.items.forEach(function (item) {
            if (item.disabled == false) {
                if (item.diyGetValue) {
                    result[item.getName()] = item.diyGetValue();
                } else {
                    if (item.getName() == 'imageConfig' || item.getName() == 'fileConfig') {
                        result = Ext.Object.merge(result, item.getValue());
                    } else {
                        result[item.getName()] = item.getValue();
                    }
                }
            }
        });
        for (var i in result) {
            //去除空值
            if (typeof result[i] == 'object') {
                Ext.Object.isEmpty(result[i]) ? delete result[i] : null;
            } else {
                if (i == 'id') {

                } else {
                    Ext.isEmpty(result[i]) ? delete result[i] : null;
                }
            }
        }
        return result;
    },
    getName: function () {
    },
    getFieldLabel: function () {
        var me = this;
        return me.title;
    },
    getErrors: function () {
        return '该配置必须完备';
    },
    setValue: function (data) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.diySetValue) {
                if (data[item.getName()]) {
                    item.diySetValue(data[item.getName()])
                }
            } else {
                if (item.getName() == 'imageConfig' || item.getName() == 'fileConfig') {
                    item.setValue(data);
                } else {
                    if (data[item.getName()]) {
                        item.setValue(data[item.getName()]);
                    }
                }
            }
        }
    },
    createDeleteCmp: function () {
        var me = this;
        me.deleteCmp = Ext.widget({
            xtype: 'button',
            margin: '-2 5 0 5',
            tooltip: '删除配置',
            componentCls: 'btnOnlyIcon',
            icon: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png',
            handler: function (btn) {
                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                    if (selector == 'yes') {
                        //触发修改事件
                        var container = me.ownerCt;
                        container.remove(me);
                    }
                })
            }
        });
        return me.deleteCmp;
    },
})
