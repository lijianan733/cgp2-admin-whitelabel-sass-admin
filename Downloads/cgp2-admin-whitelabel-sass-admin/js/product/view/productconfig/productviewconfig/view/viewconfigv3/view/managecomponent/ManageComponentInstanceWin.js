/**
 * Created by nan on 2021/6/1
 * 选择路径后，选择组件实例的弹窗
 * 当为每个导航节点配置其view配置后，每个导航配置中的view配置中配置的组件配置(即啥tooltipsConfg，SingleViewBoardConfig)
 * 都提取出来，放到一个数组里面，在存放组件时，改数组不允许有完全相同的组件配置
 * 添加，删除，更新组件都发送请求更新数据
 * 关闭界面后刷新组件配置展示区域
 */
Ext.define("CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.managecomponent.ManageComponentInstanceWin", {
    extend: 'Ext.window.Window',
    title: i18n.getKey('可选的') + i18n.getKey('组件配置'),
    modal: true,
    constrain: true,
    componentInstanceArr: null,//组件列表
    lastWin: null,//上一布的弹窗
    height: 600,
    width: 1150,
    maximizable: true,
    layout: 'border',
    pathStr: null,
    centerBuilderViewConfigPanel: null,
    bbarCfg: null,
    navigationTree: null,
    treePanelCfg: null,
    centerPanelCfg: null,
    diyComponentFieldSet: null,
    controller: Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.controller.Controller'),
    componentUsingInfo: null,//组件的使用情况
    optionalCmpTypeArr: null,//规定可选的组件
    dirtyComponentArr: null,
    buildTreeNode: function (componentInstanceArr) {
        var me = this;
        var children = [];
        var map = {};
        for (var i = 0; i < componentInstanceArr.length; i++) {
            var componentType = componentInstanceArr[i].clazz;
            componentType = componentType.split('.').pop();
            componentType = componentType.split('Config')[0];
            if (me.optionalCmpTypeArr) {
                if (!Ext.Array.contains(me.optionalCmpTypeArr, componentType)) {
                    continue;
                }
            }
            if (map[componentType]) {

            } else {
                map[componentType] = [];
            }
            map[componentType].push(componentInstanceArr[i]);
        }
        for (var i in map) {
            children.push({
                icon: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_purple.png',
                display: i,
                type: 'parentNode',
                children: map[i]
            })
        }
        return children;
    },
    /**
     * 选择组件
     */
    selectComponent: function () {
        var me = this;
        var componentMapping = CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config.componentMapping;
        var clazzStoreData = function () {
            var arr = [];
            for (var i in componentMapping) {
                //特殊规定了那些组件可用
                if (me.optionalCmpTypeArr) {
                    if (Ext.Array.contains(me.optionalCmpTypeArr, i)) {
                        arr.push({
                            value: componentMapping[i][0],
                            display: i
                        });
                    }
                } else {
                    arr.push({
                        value: componentMapping[i][0],
                        display: i
                    });
                }
            }
            return arr;
        }();
        var lastWin = Ext.create('Ext.window.Window', {
            title: i18n.getKey('选择组件类型'),
            modal: true,
            constrain: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        width: 450,
                        margin: '10 25 15 25'
                    },
                    items: [
                        {
                            xtype: 'combo',
                            name: 'clazz',
                            itemId: 'clazz',
                            fieldLabel: i18n.getKey('type'),
                            valueField: 'value',
                            displayField: 'display',
                            allowBlank: false,
                            editable: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    'display',
                                    'value'
                                ],
                                data: clazzStoreData
                            })
                        }
                    ]
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    hidden: true,
                },
                nextStepBtnCfg: {
                    hidden: false,
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var form = win.getComponent('form');
                        if (form.isValid()) {
                            var clazz = form.getComponent('clazz').getValue();
                            var defaultCfg = CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config.componentDefaultConfig2[clazz];
                            var initValue = Ext.Object.merge({
                                _id: JSGetCommonKey(),
                                clazz: clazz,
                            }, defaultCfg);
                            me.createComponent(initValue, win);
                        }
                    }
                }
            }
        });
        lastWin.show();
    },
    /**
     * 统计组件的使用情况，不是实时的，都是保存后的数据
     */
    showComponentUsingInfo: function (componentId) {
        var me = this;
        var storeData = [];
        var navigate = me.componentUsingInfo[componentId];
        for (var i in navigate) {
            storeData.push({
                'navigate': navigate[i].description + '(' + i + ')',
                'count': navigate[i].count
            })
        }
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('组件使用情况'),
            modal: true,
            constrain: true,
            layout: 'fit',
            width: 450,
            height: 450,
            items: [
                {
                    xtype: 'grid',
                    columns: [
                        {
                            dataIndex: 'navigate',
                            text: '导航项',
                            flex: 2
                        }, {
                            dataIndex: 'count',
                            text: '使用次数',
                            flex: 1,
                        }
                    ],
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'navigate', 'count'
                        ],
                        data: storeData
                    })
                }
            ]
        });
        win.show();
    },
    createComponent: function (data, lastWin) {
        var me = this;
        var win = Ext.create('Ext.window.Window', {
            width: 800,
            height: 600,
            modal: true,
            constrain: true,
            title: i18n.getKey('create') + i18n.getKey('component'),
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    region: 'center',
                    layout: 'fit',
                    itemId: 'centerPanel',
                    autoScroll: true,
                    isValidForItems: true,
                    bodyStyle: {
                        borderColor: 'silver'
                    },
                    items: [
                        {
                            xtype: 'diycomponentfieldset',
                            allowDelete: false,
                            collapsible: false,
                            autoScroll: true,
                            border: false,
                            margin: 0,
                            padding: '10 0 10 10',
                            data: data,
                            clazz: data.clazz
                        }
                    ]
                }
            ],
            bbar: [
                '->',
                {
                    text: i18n.getKey('confirm'),
                    itemId: 'confirm',
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var treePanel = me.getComponent('treePanel');
                        var form = win.items.items[0]
                        var fieldSet = form.items.items[0];
                        if (form.isValid()) {
                            var data = fieldSet.getValue();
                            var id = data._id;
                            window.componentArr.push(data);
                            me.controller.saveBuilderViewConfigDTO(me.navigationTree.ownerCt, me.navigationTree.getValue(), i18n.getKey('addsuccessful'));
                            var rootNode = treePanel.store.getRootNode();
                            rootNode.removeAll();
                            var children = treePanel.ownerCt.buildTreeNode(window.componentArr);
                            rootNode.appendChild(children);
                            var record = rootNode.findChildBy(function (node) {
                                if (node.raw._id == id) {
                                    return true
                                }
                            }, null, true);
                            console.log(record)
                            treePanel.expandAll();
                            treePanel.getSelectionModel().select(record);
                            lastWin.close();
                            win.close();
                        }
                    }
                }, {
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        lastWin.close();
                        win.close();
                    }
                }
            ]
        });
        win.show();
    },
    /**
     * 获取到最新的配置数据，更新界面
     * @param treePanel
     * @param centerPanel
     */
    updateComponent: function (treePanel, centerPanel) {
        var me = this;
        var fieldSet = centerPanel.items.items[0];
        var data = fieldSet.getValue();
        var tipInfo = '该组件在如下导航项：<br>';
        var usingInfo = me.componentUsingInfo;
        var usingCount = 0;
        for (var i in usingInfo[data._id]) {
            usingCount += usingInfo[data._id][i].count;
            tipInfo += usingInfo[data._id][i].description + '(' + i + ')<br>';
        }
        tipInfo += '共<font color="red">' + usingCount + '</font>处使用,是否确定修改?';
        var saveData = function () {
            var selectedRecord = treePanel.getSelectionModel().getSelection()[0];
            selectedRecord.raw = data
            selectedRecord.set('data', Ext.clone(data));
            me.dirtyComponentArr.push(data._id);
            var currentData = me.navigationTree.getValue();
            me.controller.updateComponentData(data, currentData);
            me.controller.saveBuilderViewConfigDTO(me.navigationTree.ownerCt, currentData);
        }
        if (usingCount > 0) {
            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey(tipInfo), function (selector) {
                if (selector == 'yes') {
                    saveData();
                }
            })
        } else {
            saveData();
        }
    },
    initComponent: function () {
        var me = this;
        me.dirtyComponentArr = [];
        me.componentUsingInfo = me.controller.getComponentUsingInfo(me.navigationTree);
        var children = me.buildTreeNode(me.componentInstanceArr);
        var store = Ext.create('Ext.data.TreeStore', {
            fields: [
                {
                    name: 'icon',
                    type: 'string',
                    defaultValue: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_green.png'
                },
                {
                    name: 'display',
                    type: 'string',
                },
                {
                    name: 'type',
                    type: 'string',
                    defaultValue: 'component'
                },
                {
                    name: 'data',
                    type: 'object',
                    convert: function (value, record) {
                        return Ext.clone(record.raw);
                    }
                }
            ],
            root: {
                expanded: true,
                children: children
            }
        });
        me.items = [
            Ext.Object.merge({
                xtype: 'treepanel',
                region: 'west',
                width: 350,
                store: store,
                rootVisible: false,
                itemId: 'treePanel',
                multiSelect: false,
                lines: true,
                rowLines: true,
                useArrows: true,
                split: true,// enable resizing
                tbar: {
                    items: [
                        {
                            xtype: 'button',
                            text: i18n.getKey('create'),
                            iconCls: 'icon_add',
                            handler: function (btn) {
                                var treePanel = btn.ownerCt.ownerCt;
                                treePanel.ownerCt.selectComponent();
                            }
                        }
                    ]
                },
                columns: [
                    {
                        xtype: 'actioncolumn',
                        width: 25,
                        items: [
                            {
                                iconCls: 'icon_remove icon_margin',
                                tooltip: 'Delete',
                                isDisabled: function (treeView, rowIndex, colIndex, column, record) {
                                    if (record.childNodes.length > 0) {
                                        //暂时不知道如何让指定行不显示该功能,所以出报错，
                                        throw new Error('故意');
                                        return true;
                                    } else {
                                        if (me.componentUsingInfo[record.raw._id] && Object.keys(me.componentUsingInfo[record.raw._id]).length > 0) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                        return false;
                                    }
                                },
                                /*           getClass: function (column, mateData, record, attr, rowIndex, colIndex, store) {
                                               if (record.childNodes.length > 0) {
                                                   return true;
                                               } else {
                                                   if (Object.keys(me.componentUsingInfo[record.raw._id]).length > 0) {
                                                       return true;
                                                   } else {
                                                       return 'icon_remove icon_margin';
                                                   }
                                                   return 'icon_remove icon_margin';
                                               }
                                           },*/
                                handler: function (view, rowIndex, colIndex, a, b, record) {
                                    Ext.Msg.confirm('提示', '确定删除？', callback);
                                    var treePanel = view.ownerCt;
                                    var manageWin = treePanel.ownerCt;

                                    function callback(id) {
                                        if (id === 'yes') {
                                            var data = record.raw;
                                            for (var i = 0; i < window.componentArr.length; i++) {
                                                if (data._id == window.componentArr[i]._id) {
                                                    window.componentArr.splice(i, 1);
                                                }
                                            }
                                            manageWin.controller.saveBuilderViewConfigDTO(manageWin.navigationTree.ownerCt, manageWin.navigationTree.getValue(), i18n.getKey('deleteSuccess'));
                                            record.parentNode.removeChild(record);
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'treecolumn',
                        dataIndex: 'display',
                        flex: 1,
                        renderer: function (value, mateData, record, rowIndex, colIndex) {
                            var description = record.raw.description || '';
                            var str = '';
                            if (value) {
                                str = value;
                            } else {
                                str = description + '(组件Id:' + record.raw._id + ')';
                            }
                            mateData.tdAttr = 'data-qtip="' + str + '"';//显示的文本
                            return str;
                        }
                    },
                ],
                listeners: {
                    select: function (rowModel, record) {
                        var data = Ext.clone(record.get('data'));
                        var treePanel = this;
                        var centerPanel = treePanel.ownerCt.getComponent('centerPanel');
                        if (record.get('type') != 'parentNode' && data) {
                            centerPanel.refreshData(data);
                        } else {
                            centerPanel.refreshData();
                        }
                    },
                    beforeselect: function (rowModel, record) {
                        var treePanel = this;
                        var centerPanel = treePanel.ownerCt.getComponent('centerPanel');
                        if (record.get('type') == 'parentNode') {
                            centerPanel.refreshData();
                            return false;
                        } else {
                            return true;
                        }
                    },
                    afterrender: function () {
                        var me = this;
                        me.columnManager.headerCt.setHeight(0)
                        me.expandAll();
                    }
                }
            }, me.treePanelCfg),
            Ext.Object.merge({
                xtype: 'errorstrickform',
                region: 'center',
                layout: 'fit',
                itemId: 'centerPanel',
                autoScroll: true,
                bodyStyle: {
                    borderColor: 'silver'
                },
                tbar: {
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'saveBtn',
                            iconCls: 'icon_save',
                            text: '<font color="red">' + i18n.getKey('save') + '</font>',
                            disabled: true,
                            handler: function (btn) {
                                var centerPanel = btn.ownerCt.ownerCt;
                                var treePanel = centerPanel.ownerCt.getComponent('treePanel');
                                if (centerPanel.isValid()) {
                                    centerPanel.ownerCt.updateComponent(treePanel, centerPanel);
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            itemId: 'useInfoBtn',
                            iconCls: 'icon_audit',
                            disabled: true,
                            text: i18n.getKey('组件引用情况'),
                            handler: function (btn) {
                                var centerPanel = btn.ownerCt.ownerCt;
                                var win = centerPanel.ownerCt;
                                var fieldSet = centerPanel.items.items[0];
                                var componentId = fieldSet.getComponent('_id').getValue();
                                win.showComponentUsingInfo(componentId);
                            }
                        },
                        '->',
                        {
                            xtype: 'displayfield',
                            itemId: 'usingCount',
                            value: '<font color="green"">组件详情</font>'
                        }
                    ]
                },
                items: [
                    {
                        xtype: 'diycomponentfieldset',
                        allowDelete: false,
                        allowSelectComponent: false,
                        collapsible: false,
                        autoScroll: true,
                        border: false,
                        margin: 0,
                        hidden: true,
                        padding: '10 0 10 10'
                    }
                ],
                refreshData: function (data) {
                    var me = this;
                    me.msgPanel.hide();
                    var win = me.ownerCt;
                    var fieldSet = me.items.items[0];
                    var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
                    var saveBtn = toolbar.getComponent('saveBtn');
                    var useInfoBtn = toolbar.getComponent('useInfoBtn');
                    var usingCount = toolbar.getComponent('usingCount');
                    if (data) {
                        me.setLoading(true);
                        var count = 0;
                        var usingInfo = win.componentUsingInfo[data._id];
                        if (!Ext.Object.isEmpty(usingInfo)) {
                            for (var i in usingInfo) {
                                count += usingInfo[i].count;
                            }
                        }
                        setTimeout(function () {
                            saveBtn.setDisabled(false);
                            useInfoBtn.setDisabled(false);
                            usingCount.setDisabled(false);
                            fieldSet.refreshData(data);
                            usingCount.setValue('<font color="green"">组件引用次数:' + count + '</font>')
                            me.setLoading(false);
                            fieldSet.show();
                        }, 250)
                    } else {
                        saveBtn.setDisabled(true);
                        useInfoBtn.setDisabled(true);
                        usingCount.setDisabled(true);
                        usingCount.setValue('<font color="green"">组件引用次数:0</font>')
                        fieldSet.hide();
                    }
                }
            }, me.centerPanelCfg)
        ];
        me.bbar = Ext.Object.merge({
            items: [
                {
                    text: i18n.getKey('lastStep'),
                    iconCls: 'icon_previous_step',
                    hidden: me.lastWin ? false : true,
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.lastWin.show();
                        win.destroy();
                    }
                },
                '->',
                {
                    text: i18n.getKey('confirm'),
                    itemId: 'confirm',
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var treePanel = win.getComponent('treePanel');
                        var pathStr = win.pathStr;
                        var centerBuilderViewConfigPanel = win.centerBuilderViewConfigPanel;
                        var selection = treePanel.getSelectionModel().getSelection();
                        var initData = {};
                        if (selection.length > 0) {
                            initData = selection[0].raw;
                            initData.componentPath = {
                                clazz: 'com.qpp.cgp.domain.product.config.view.builder.config.v3.FullPath',
                                path: pathStr
                            };
                            centerBuilderViewConfigPanel.setLoading(true);
                            win.hide();
                            win.lastWin ? win.lastWin.close() : null;
                            setTimeout(function () {
                                centerBuilderViewConfigPanel.addComponentFieldset([initData]);
                                centerBuilderViewConfigPanel.items.items[0].containerEl.setScrollTop(centerBuilderViewConfigPanel.items.items[0].containerEl.dom.scrollHeight);
                                centerBuilderViewConfigPanel.setLoading(false);
                                win.close();
                            }, 50);
                        } else {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请选择或新建一组件配置'));
                        }
                    }
                },
                {
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.lastWin ? win.lastWin.close() : null;

                        win.close();
                    }
                }
            ]
        }, me.bbarCfg);
        me.callParent();
    },
    listeners: {
        //关闭窗口前更新界面
        beforedestroy: function () {
            var me = this;
            var centerBuilderViewConfigPanel = Ext.getCmp('centerBuilderViewConfigPanel');
            if (me.dirtyComponentArr.length > 0 && centerBuilderViewConfigPanel) {
                centerBuilderViewConfigPanel.refreshDataByArr(me.dirtyComponentArr);
            }
        }
    }
})