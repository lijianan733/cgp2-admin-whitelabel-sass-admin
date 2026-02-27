/**
 * Created by nan on 2020/7/29.
 *
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.DiyComponentFieldSet',
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.SelectComponentPathWin'
])
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.CenterBuilderViewConfigPanel', {
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
    controller: null,
    isValid: function () {
        var me = this;
        me.msgPanel.hide();
        var isValid = true,
            errors = {};
        var container = me.items.items[0];
        container.items.items.forEach(function (f) {
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
        isValid ? null : this.showErrors(errors);
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {
            id: null,
            navItemId: null,
            editViewType: null,
            configs: []
        };
        var tbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var editViewDataConfigs = me.getComponent('editViewDataConfigs');
        result.configs = editViewDataConfigs.getValue();
        var editViewTypeDto = tbar.getComponent('editViewType').getArrayValue();
        var id = tbar.getComponent('id').getValue() || JSGetCommonKey();
        //精简下editViewTypeDto的数据
        if (editViewTypeDto) {
            result.editViewType = {
                clazz: "com.qpp.cgp.domain.product.config.view.builder.dto.v3.EditViewTypeDto",
                description: editViewTypeDto.description,
                multilingualKey: "com.qpp.cgp.domain.product.config.view.builder.dto.v3.EditViewTypeDto",//接口
                editViewTypeDomain: {
                    _id: editViewTypeDto.editViewTypeDomain._id,
                    multilingualKey: "com.qpp.cgp.domain.product.config.view.builder.config.v3.EditViewType",//接口
                    clazz: "com.qpp.cgp.domain.product.config.view.builder.config.v3.EditViewType",
                },
                _id: editViewTypeDto._id
            }
        }
        result.id = id;
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
        var idField = tbar.getComponent('id');
        editViewDataConfigs.removeAll();
        if (data) {
            tbar.show();
            idField.setValue(data.id);
            editViewDataConfigs.setValue(data.configs);
            if (data.editViewType) {
                editViewType.setInitialValue([data.editViewType._id]);
            } else {
                editViewType.setValue();
            }
        } else {
            tbar.hide();
            idField.setValue(null);
            editViewDataConfigs.setValue();
            editViewType.setValue();
        }

    },
    showUsingInfo: function (dirtyComponent, callback) {
        var me = this;
        var usingInfo = me.controller.getComponentUsingInfo(Ext.getCmp('navigationTree'));
        var storeData = [];
        for (var i = 0; i < dirtyComponent.length; i++) {
            var tipInfo = '';
            var usingCount = 0;
            for (var j in usingInfo[dirtyComponent[i]]) {
                usingCount += usingInfo[dirtyComponent[i]][j].count;
                tipInfo += usingInfo[dirtyComponent[i]][j].description + '(' + j + ')<br>';
            }
            storeData.push({
                componentId: dirtyComponent[i],
                info: tipInfo,
                count: usingCount
            })
        }
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('prompt'),
            modal: true,
            constrain: true,
            layout: {
                type: 'table',
                columns: 2
            },
            width: 550,
            height: 400,
            defaults: {
                width: '100%'
            },
            items: [
                {
                    xtype: 'component',
                    cls: 'x-message-box-question',
                    width: 50,
                    height: 35

                },
                {
                    xtype: 'displayfield',
                    width: 500,
                    value: i18n.getKey('组件使用信息如下,是否确定修改？')
                },
                {
                    xtype: 'grid',
                    colspan: 2,
                    minHeight: 350,
                    columns: [
                        {
                            dataIndex: 'componentId',
                            text: '组件',
                            flex: 1
                        }, {
                            dataIndex: 'info',
                            text: '导航项',
                            flex: 2,
                        },
                        {
                            dataIndex: 'count',
                            text: '使用次数',
                            flex: 1,
                        }
                    ],
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'componentId', 'info', 'count'
                        ],
                        data: storeData
                    })
                }
            ],
            bbar: {
                layout: {
                    type: 'hbox',
                    align: 'center',
                    pack: 'center'
                },
                items: [
                    {
                        text: i18n.getKey('confirm'),
                        itemId: 'okBtn',
                        iconCls: 'icon_agree',
                        width: 80,
                        handler: function (btn) {
                            callback();
                            btn.ownerCt.ownerCt.close();
                        }
                    },
                    {
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        width: 80,
                        handler: function (btn) {
                            btn.ownerCt.ownerCt.close()
                        }
                    },
                ]

            }
        });
        win.show();
    },
    initComponent: function () {
        var me = this;
        var editViewTypeStore = Ext.create('CGP.editviewtypeconfigv3.store.EditViewConfigStore', {
            storeId: 'editViewTypeStore',
            autoLoad: false,
        });
        var controller = me.controller = Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.controller.Controller');
        me.tbar = {
            hidden: true,
            items: [
                {
                    name: 'editViewType',
                    xtype: 'gridcombo',
                    itemId: 'editViewType',
                    fieldLabel: i18n.getKey('editViewType'),
                    multiSelect: false,
                    displayField: 'displayInfo',
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
                    name: 'id',
                    xtype: 'numberfield',
                    itemId: 'id',
                    hidden: true,
                    fieldLabel: i18n.getKey('id'),
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
                                url: path + 'partials/editviewtypeconfigv3/main.html?_id=' + editViewTypeId,
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
                            var configs = data.configs;
                            var leftGridPanel = panel.getComponent('navigationTree');
                            var result = leftGridPanel.getValue();
                            console.log(result);
                            var dirtyComponentArr = [];
                            for (var i = 0; i < configs.length; i++) {
                                var newConfigs = Ext.clone(configs[i]);
                                delete newConfigs.componentPath;
                                delete newConfigs.configId;
                                if (controller.compareComponent(newConfigs) == false) {
                                    dirtyComponentArr.push(newConfigs._id);
                                }
                            }
                            if (dirtyComponentArr.length > 0) {
                                form.showUsingInfo(dirtyComponentArr, function () {
                                    for (var i = 0; i < configs.length; i++) {
                                        var newConfigs = Ext.clone(configs[i]);
                                        delete newConfigs.componentPath;
                                        delete newConfigs.configId;
                                        if (controller.compareComponent(newConfigs) == false) {
                                            controller.updateComponentData(newConfigs, result);
                                        }
                                    }
                                    return controller.saveBuilderViewConfigDTO(panel, result);
                                });
                            } else {
                                return controller.saveBuilderViewConfigDTO(panel, result);

                            }


                            /*
                            */
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
                    if (data) {
                        panel.addComponentFieldset(data);

                    }
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
        var win = Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.SelectComponentPathWin', {
            centerBuilderViewConfigPanel: centerBuilderViewConfigPanel,
            editViewTypeField: editViewTypeField
        });
        win.show();
    },
    addComponentFieldset: function (rawData) {
        var me = this;
        console.log(new Date())
        Ext.suspendLayouts();
        var container = me.items.items[0];
        var tbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var editViewTypeField = tbar.getComponent('editViewType');
        if (rawData) {
            var conponents = [];
            for (var i = 0; i < rawData.length; i++) {
                var data = rawData[i];
                var componentId = data.id;
                var configId = data.configId || JSGetCommonKey();
                var path = null;
                if (data.clazz == "com.qpp.cgp.domain.product.config.view.builder.config.v3.NamePath") {
                    var name = data.componentPath.name;
                    var area = data.componentPath.path.match(/(?<=layoutPosition==').+?(?=\'\)\])/)[0];
                    path = (area + '：' + name);
                } else {
                    var area = data.componentPath.path.match(/(?<=layoutPosition==').+?(?=\'\)\])/)[0];
                    var component = data.componentPath.path.match(/(?<=@.name==').+?(?=\'\)\])/)[0];
                    path = (area + '：' + component);
                }
                conponents.push({
                    componentId: componentId,
                    clazz: data.clazz,
                    xtype: 'diycomponentfieldset',
                    title: '<font color="green" style="font-weight: bold">组件路径：' + path + ' ,组件Id: ' + data._id + ' ,描述：' + (data.description || data.type) + '</font>',
                    editViewType: editViewTypeField.getArrayValue(),
                    data: data,
                    configId: configId,
                    collapsed: true,
                })
            }
            var newComponent = container.add(conponents);
        } /*else {
            var data = null;
            var componentId = JSGetCommonKey(false);
            container.add({
                componentId: componentId,
                componentClazz: '',
                xtype: 'diycomponentfieldset',
                title: i18n.getKey('component') + i18n.getKey('config') + (container.items.items.length + 1),
                editViewType: editViewTypeField.getArrayValue(),
                data: data
            })
        }*/
        Ext.resumeLayouts(true);
        console.log(new Date())

        /*
                me.doLayout();
        */
    },
    refreshData: function (data, record) {
        var me = this;
        me.record = record;
        me.ownerCt.el.mask('loading...');
        me.clearErrorMsg();
        me.updateLayout();
        setTimeout(function () {
            me.setValue(data);
            me.ownerCt.el.unmask();
        }, 100);
    },
    /**
     * 更新指定数据
     */
    refreshDataByArr: function (componentIdArr) {
        //更新界面
        var me = this;
        me.ownerCt.el.mask('loading...');
        var container = me.items.items[0];
        me.suspendLayouts();
        setTimeout(function () {
            for (var i = 0; i < componentIdArr.length; i++) {
                var componentId = componentIdArr[i];
                var component = null;
                var componentData = null;
                //找出对应的组件
                for (let j = 0; j < container.items.items.length; j++) {
                    var fieldset = container.items.items[j];
                    if (fieldset.title.indexOf(componentId) != -1) {
                        component = fieldset;
                        continue;
                    }
                }
                if (component) {
                    for (let j = 0; j < window.componentArr.length; j++) {
                        if (componentId == window.componentArr[j]._id) {
                            componentData = Ext.clone(window.componentArr[j]);
                            continue;
                        }
                    }
                    component.setValue(componentData);
                }
            }
            me.resumeLayouts();
            me.ownerCt.el.unmask()
        }, 100);
    }
})

