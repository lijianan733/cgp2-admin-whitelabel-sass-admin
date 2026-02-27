/**
 * Created by nan on 2020/7/29.
 *
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.view.DiyComponentFieldSet',
])
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.view.CenterBuilderViewConfigPanel', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.centerbuilderviewconfigpanel',
    flex: 1,
    height: '100%',
    autoScroll: true,
    scrollData: {
        top: 0,
        left: 0
    },
    layout: 'fit',
    isValidForItems: true,
    record: null,//记录对应树上那个节点
    isDirty: true,//记录是否修改过
    navigationDTOId: null,
    productViewConfigId: null,
    isValid: function () {
        var me = this;
        me.msgPanel.hide();
        var isValid = true,
            errors = {};
        var tbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var editViewType = tbar.getComponent('editViewType');
        if (editViewType.isValid()) {
            me.items.items.forEach(function (f) {
                if (!f.isValid()) {
                    var errorInfo = f.getErrors();
                    if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                        errors = Ext.Object.merge(errors, errorInfo);
                    } else {
                        errors[f.getFieldLabel()] = errorInfo;
                    }
                    isValid = false;
                }
            })
        } else {
            isValid = false;
            errors[editViewType.getFieldLabel()] = editViewType.getErrors();

        }
        isValid ? null : this.showErrors(errors);
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {
            navItemId: null,
            editViewType: null,
            configs: []
        };
        var tbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var editViewDataConfigs = me.getComponent('editViewDataConfigs');
        result.configs = editViewDataConfigs.getValue();
        var editViewTypeDto = tbar.getComponent('editViewType').getArrayValue();
        //精简下editViewTypeDto的数据
        if (editViewTypeDto) {
            result.editViewType = {
                clazz: "com.qpp.cgp.domain.product.config.view.builder.dto.EditViewTypeDto",
                description: editViewTypeDto.description,
                multilingualKey: "com.qpp.cgp.domain.product.config.view.builder.dto.EditViewTypeDto",//接口
                editViewTypeDomain: {
                    _id: editViewTypeDto.editViewTypeDomain._id,
                    multilingualKey: "com.qpp.cgp.domain.product.config.view.builder.config.EditViewType",//接口
                    clazz: "com.qpp.cgp.domain.product.config.view.builder.config.EditViewType",
                },
                _id: editViewTypeDto._id
            }
        }
        result.navItemId = me.record.get('id');
        if (Ext.isEmpty(result.editViewType)) {
            return null;
        } else {
            return result;
        }
    },
    setValue: function (data) {
        var me = this;
        var tbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var editViewType = tbar.getComponent('editViewType');
        var editViewDataConfigs = me.getComponent('editViewDataConfigs');
        editViewDataConfigs.removeAll();
        if (data) {
            tbar.show();
            editViewDataConfigs.setValue(data.configs);
            if (data.editViewType) {
                editViewType.setInitialValue([data.editViewType._id]);
            } else {
                editViewType.setValue();
            }
        } else {
            tbar.hide();
            editViewDataConfigs.setValue();
            editViewType.setValue();
        }

    },
    initComponent: function () {
        var me = this;
        var editViewTypeStore = Ext.create('CGP.editviewtypeconfig.store.EditViewConfigStore');
        var controller = Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.controller.Controller');
        me.tbar = {
            hidden: true,
            items: [
                {
                    name: 'editViewType',
                    xtype: 'gridcombo',
                    itemId: 'editViewType',
                    fieldLabel: i18n.getKey('editViewType'),
                    multiSelect: false,
                    displayField: 'descriptionId',
                    valueField: '_id',
                    labelAlign: 'right',
                    allowBlank: true,
                    haveReset: true,
                    store: editViewTypeStore,
                    editable: false,
                    matchFieldWidth: false,
                    pickerAlign: 'bl',
                    filterCfg: {
                        height: 80,
                        layout: {
                            type: 'column',
                            columns: 2
                        },
                        fieldDefaults: {
                            labelAlign: 'right',
                            layout: 'anchor',
                            width: 180,
                            style: 'margin-right:20px; margin-top : 5px;',
                            labelWidth: 50
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('id'),
                                name: '_id',
                                itemId: '_id',
                                hideTrigger: true,
                                isLike: false,
                                labelWidth: 40
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('description'),
                                name: 'description',
                                itemId: 'description',
                                labelWidth: 40
                            }
                        ]
                    },
                    onTrigger1Click: function () {
                        var configs = Ext.getCmp('configsFieldContainer');
                        if (configs.items.items.length > 0) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('已配置了组件数据，不能修改editViewType'));
                            return false;
                        } else {
                            this.reset();
                        }
                    },
                    gridCfg: {
                        store: editViewTypeStore,
                        height: 300,
                        width: 400,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 80,
                                dataIndex: '_id'
                            },
                            {
                                text: i18n.getKey('description'),
                                dataIndex: 'description',
                                flex: 1
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: editViewTypeStore,
                            emptyMsg: i18n.getKey('noData')
                        }),
                        listeners: {
                            beforeselect: function () {
                                var configs = Ext.getCmp('configsFieldContainer');
                                if (configs.items.items.length > 0) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('已配置了组件数据，不能修改editViewType'));
                                    return false;
                                }
                            }
                        }
                    },
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('check') + i18n.getKey('editViewType'),
                    iconCls: 'icon_check',
                    handler: function (btn) {
                        var toolbar = btn.ownerCt;
                        var editViewType = toolbar.getComponent('editViewType');
                        var editViewTypeId = editViewType.getSubmitValue()[0];
                        if (editViewTypeId) {
                            JSOpen({
                                id: 'editviewconfigpage',
                                url: path + 'partials/editviewtypeconfig/main.html?_id=' + editViewTypeId,
                                title: i18n.getKey('editViewConfig'),
                                refresh: true
                            })
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('config') + i18n.getKey('component'),
                    iconCls: 'icon_add',
                    handler: function (btn) {
                        var toolbar = btn.ownerCt;
                        var panel = toolbar.ownerCt;
                        var editViewType = toolbar.getComponent('editViewType');
                        var editViewTypeId = editViewType.getSubmitValue()[0];
                        if (Ext.isEmpty(editViewTypeId)) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择editViewType'));
                        } else {
                            panel.selectComponentPath(editViewType);
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    itemId: 'saveBtn',
                    handler: function (btn) {
                        var btn = this;
                        var toolbar = btn.ownerCt;
                        var form = toolbar.ownerCt;
                        var panel = form.ownerCt;
                        if (form.isValid()) {
                            var data = form.getValue();
                            form.record.set('editViewConfigDTO', data);
                            var leftGridPanel = panel.getComponent('navigationTree');
                            var rootNode = leftGridPanel.getRootNode();
                            //变量树中的FixedNavItemDto节点，取出数据
                            var result = panel.recordData || {
                                productConfigViewId: me.productViewConfigId,
                                description: null,
                                clazz: 'com.qpp.cgp.domain.product.config.view.builder.dto.OrdinaryBuilderViewConfigDto',
                                builderViewConfigDomain: null,
                                editViewConfigs: [],
                                _id: null
                            };
                            result.editViewConfigs = [];
                            rootNode.cascadeBy(function (node) {
                                var editViewConfigDTO = node.get('editViewConfigDTO');
                                if (Ext.isEmpty(editViewConfigDTO) != true) {
                                    result.editViewConfigs.push(editViewConfigDTO);
                                }
                            })
                            return controller.saveBuilderViewConfigDTO(panel, result);
                        }
                    }
                }
            ]
        };
        me.items = [
            {
                xtype: 'uxfieldcontainer',
                name: 'editViewDataConfigs',
                itemId: 'editViewDataConfigs',
                id: 'configsFieldContainer',
                defaults: {},
                autoScroll: true,
                layout: 'vbox',
                combineErrors: false,
                scrollData: {
                    top: 0,
                    left: 0
                },
                listeners: {
                    afterrender: function (fieldSet) {
                        var me = this;
                        //代理监听内部body的滚动条事件
                        me.relayEvents(me.containerEl, ['scroll']);
                    },
                    //记录滚动条位置
                    scroll: function () {
                        var me = this;
                        me.scrollData = me.containerEl.getScroll();
                    },
                    afterLayout: function () {
                        var me = this;
                        me.containerEl.setScrollTop(me.scrollData.top);
                    }
                },
                getValue: function () {
                    var me = this;
                    var result = [];
                    for (var i = 0; i < me.items.items.length; i++) {
                        result.push(me.items.items[i].getValue());
                    }
                    return result;
                },
                setValue: function (data) {
                    var me = this;
                    var panel = me.ownerCt;
                    console.log(new Date())
                    if (data) {
                        panel.addComponentFieldset(data);

                    }
                    console.log(new Date())
                }
            }
        ];
        me.callParent();
        me.on('afterrender', function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    },
    selectComponentPath: function (editViewTypeField) {
        var centerBuilderViewConfigPanel = this;
        var editViewDataConfigsContainer = centerBuilderViewConfigPanel.items.items[0];
        var usingPath = [];
        var data = [];
        var editViewType = editViewTypeField.getArrayValue();
        //遍历已经已经添加的组件，记录已经使用的路径
        for (var i = 0; i < editViewDataConfigsContainer.items.items.length; i++) {
            var item = editViewDataConfigsContainer.items.items[i];
            var componentPath = item.getValue().componentPath.path;
            var area = componentPath.match(/(?<=layoutPosition==').+?(?=\'\)\])/)[0];
            var component = componentPath.match(/(?<=@.name==').+?(?=\'\)\])/)[0];
            usingPath.push(area + '：' + component);
        }
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
            bbar: ['->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var treePanel = win.getComponent('tree');
                    var selectNode = treePanel.getSelectionModel().getSelection()[0];
                    if (!Ext.isEmpty(selectNode)) {
                        if (selectNode.isLeaf() == true) {
                            var path = selectNode.get('id');
                            var area = path.split('-')[0];
                            var component = path.split('-')[1];
                            var componentType = selectNode.raw.type
                            var componentMapping = CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.config.Config.componentMapping;
                            var pathStr = "$.areas[?(@.position.layoutPosition==\'" + area + "\')].components[?(@.name==\'" + component + "\')]";
                            centerBuilderViewConfigPanel.setLoading(true);
                            win.close();
                            setTimeout(function () {
                                console.log(new Date())
                                centerBuilderViewConfigPanel.addComponentFieldset([{
                                    componentPath: {
                                        clazz: 'com.qpp.cgp.domain.product.config.view.builder.config.FullPath',
                                        path: pathStr
                                    },
                                    clazz: componentMapping[componentType][0],
                                    //这是默认数据
                                    informationVariable: {
                                        format: 'jpg, jpeg, bmp, png, gif',
                                        dpi: 300,
                                        maxFileSize: 300,
                                        maxFileSizeUnit: 'MB'
                                    }
                                }]);
                                centerBuilderViewConfigPanel.items.items[0].containerEl.setScrollTop(centerBuilderViewConfigPanel.items.items[0].containerEl.dom.scrollHeight);
                                centerBuilderViewConfigPanel.setLoading(false);
                                console.log(new Date())
                            }, 50)

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

        /*           panel.addComponentFieldset();
                   panel.items.items[0].containerEl.setScrollTop(panel.items.items[0].containerEl.dom.scrollHeight);*/

    },
    addComponentFieldset: function (rawData) {
        var me = this;
        Ext.suspendLayouts();
        var container = me.items.items[0];
        var tbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var editViewTypeField = tbar.getComponent('editViewType');
        if (rawData) {
            var conponents = [];
            for (var i = 0; i < rawData.length; i++) {
                var data = rawData[i];
                var componentId = data.id;
                conponents.push({
                    componentId: componentId,
                    xtype: 'diycomponentfieldset',
                    title: i18n.getKey('component') + i18n.getKey('config') + (container.items.items.length + i + 1),
                    editViewType: editViewTypeField.getArrayValue(),
                    data: data
                })
            }
            container.add(conponents);
        } else {
            var data = null;
            var componentId = JSGetCommonKey(false);
            container.add({
                componentId: componentId,
                xtype: 'diycomponentfieldset',
                title: i18n.getKey('component') + i18n.getKey('config') + (container.items.items.length + 1),
                editViewType: editViewTypeField.getArrayValue(),
                data: data
            })
        }
        Ext.resumeLayouts();
        me.doLayout();
    },
    refreshData: function (data, record) {
        var me = this;
        me.record = record;
        me.ownerCt.el.mask('loading...');
        me.updateLayout();
        setTimeout(function () {
            me.setValue(data);
            me.ownerCt.el.unmask();
        }, 100);
    }
})

