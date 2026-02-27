/**
 * @Description:先根据类目，得到该类目关联的产品，再根据产品，显示对应产品的属性，把产品的属性添加到属性列表中
 * @author nan
 * @date 2022/4/29
 */
Ext.Loader.syncRequire([
    'CGP.attribute.model.Attribute',
    'CGP.cmsconfig.view.OptionContainer',
    'CGP.cmsconfig.model.ProductAttributeTreeModel'
])
Ext.define('CGP.cmsconfig.view.EditFilterWin', {
    extend: 'Ext.panel.Panel',
    modal: true,
    itemId: 'editFilterWin',
    constrain: true,
    maximized: false,
    maximizable: true,
    closable: true,
    alias: 'widget.filterwindow',
    layout: 'fit',
    usedOptionIds: null,//已经被使用了的选项id,
    outGird: null,
    record: null,
    categoryProductInfoStore: null,
    tbar: {
        items: [
            {
                iconCls: 'icon_save',
                text: '保存产品筛选配置',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var form = win.getComponent('form');
                    if (form.isValid()) {
                        var data = form.getValue();
                        console.log(data);
                        if (win.record) {
                            for (var i in data) {
                                win.record.set(i, data[i]);
                            }
                        } else {
                            win.outGrid.store.add(data);
                        }
                        win.outGrid.ownerCt.setActive(win.outGrid);
                        win.close();
                    }
                }
            }
        ]
    },
    isValid: function () {
        return true;
    },
    initComponent: function () {
        var me = this;
        var usedOptionIds = me.usedOptionIds = [];
        me.title = (me.record ? i18n.getKey('edit') : i18n.getKey('create')) + i18n.getKey('产品筛选配置');
        //改写删除操作的逻辑
        var categoryProductInfoStore = me.outGrid.categoryProductInfoStore;
        window.deleteOption = window.deleteOption || function (itemId) {
            var field = Ext.getCmp(itemId);
            var arrayField = field.ownerCt.ownerCt;
            var array = arrayField.value;
            var optionData = field.realValue;
            var optionId = field.realValue.id;
            var leftTree = arrayField.ownerCt.view.ownerCt.ownerCt.ownerCt.getComponent('leftTree');
            field.ownerCt.remove(field);
            for (var i = 0; i < array.length; i++) {
                if (optionId == array[i].id) {
                    array.splice(i, 1);
                    break;
                }
            }
            leftTree.fireEvent('itemDelete', [optionData]);
        };
        var attributeStore = Ext.create('Ext.data.Store', {
            model: 'CGP.attribute.model.Attribute',
            proxy: {
                type: 'memory'
            },
            autoLoad: false,
            data: [],
            listeners: {
                datachanged: function () {
                    var store = this;
                    if (me.rendered) {
                        var form = me.items.items[0];
                        var optionPanel = form.getComponent('optionPanel');
                        var leftTree = optionPanel.getComponent('leftTree');
                        leftTree.fireEvent('itemChange', Ext.clone(store.proxy.data));
                    }
                }
            }
        });
        me.items = [{
            xtype: 'errorstrickform',
            height: 600,
            width: 800,
            isValidForItems: true,
            itemId: 'form',
            autoScroll: true,
            bodyStyle: {
                borderColor: 'silver'
            },
            defaults: {
                margin: '5 25 5 25'
            },
            layout: 'vbox',
            items: [
                {
                    xtype: 'textfield',
                    width: 400,
                    itemId: 'name',
                    name: 'name',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('过滤参数名')
                },
                {
                    xtype: 'gridfieldextendcontainer',
                    name: 'attributes',
                    itemId: 'attributeGrid',
                    msgTarget: 'none',
                    allowBlank: false,
                    width: '100%',
                    minHeight: 150,
                    labelAlign: 'top',
                    labelStyle: 'display:none',
                    maxHeight: 300,
                    fieldLabel: i18n.getKey('关联的产品属性列表'),
                    store: attributeStore,
                    gridConfig: {
                        width: '100%',
                        minHeight: 150,
                        maxHeight: 300,
                        usedOptionIds: usedOptionIds,
                        itemId: 'attributeGrid',
                        header: {
                            style: 'background-color:white;',
                            color: 'black',
                            title: '<font color=green>' + i18n.getKey('关联的产品属性列表') + '</font>',
                            border: '0 0 0 0'
                        },
                        tbar: {
                            xtype: 'uxstandardtoolbar',
                            disabledButtons: ['export', 'import', 'delete'],
                            hiddenButtons: ['read', 'clear', 'config', 'help'],
                            btnCreate: {
                                iconCls: 'icon_add',
                                text: i18n.getKey('add'),
                                handler: function (btn) {
                                    var outGrid = btn.ownerCt.ownerCt;
                                    //构建treeData
                                    var data = categoryProductInfoStore.data.items;
                                    var treeData = {
                                        children: []
                                    };
                                    for (var i = 0; i < data.length; i++) {
                                        var productInfo = data[i].raw;
                                        productInfo.leaf = false;
                                        if (productInfo.attributes && productInfo.attributes.length > 0) {
                                            var map = new Map();
                                            var arr = productInfo.attributes.filter(function (item) {
                                                //筛选掉输入类型数据,和已经添加过的,
                                                var attributeId = item.id;
                                                var isValid = true;
                                                if (outGrid.store.data.getByKey(attributeId)) {
                                                    isValid = false;
                                                }
                                                if (item.selectType == 'NON') {
                                                    isValid = false;
                                                }
                                                return isValid;
                                            });
                                            //过滤掉重复的属性
                                            arr.map(function (item) {
                                                var attributeId = item.id;
                                                item.leaf = true;
                                                map.set(attributeId, item);
                                            });
                                            arr = [...map.values()];
                                            productInfo.children = arr;
                                        }
                                        treeData.children.push(productInfo);
                                    }
                                    var treeStoreData = Ext.create('Ext.data.TreeStore', {
                                        model: 'CGP.cmsconfig.model.ProductAttributeTreeModel',
                                        root: treeData,
                                    });
                                    var win = Ext.create('Ext.window.Window', {
                                        title: '可用于筛选的产品属性',
                                        modal: true,
                                        constrain: true,
                                        width: 700,
                                        height: 600,
                                        outGrid: outGrid,
                                        layout: 'fit',
                                        items: [
                                            {
                                                xtype: 'treepanel',
                                                rootVisible: false,
                                                store: treeStoreData,
                                                lines: true,
                                                rowLines: true,
                                                useArrows: true,
                                                selModel: Ext.create("Ext.selection.CheckboxModel", {
                                                    injectCheckbox: 0,
                                                    mode: "simple",
                                                    checkOnly: false,
                                                    allowDeselect: true,
                                                    enableKeyNav: true,
                                                    showHeaderCheckbox: true,
                                                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                                                        if (record.raw.clazz == 'com.qpp.cgp.domain.attribute.Attribute') {
                                                            var baseCSSPrefix = Ext.baseCSSPrefix;
                                                            metaData.tdCls = baseCSSPrefix + 'grid-cell-special ' + baseCSSPrefix + 'grid-cell-row-checker';
                                                            return '<div class="' + baseCSSPrefix + 'grid-row-checker">&#160;</div>';
                                                        }
                                                    },
                                                }),
                                                multiSelect: true,
                                                listeners: {
                                                    //不能选择产品
                                                    beforeselect: function (RowModel, record, index, eOpts) {
                                                        return record.raw?.clazz == 'com.qpp.cgp.domain.attribute.Attribute';
                                                    }
                                                },
                                                columns: [{
                                                    text: i18n.getKey('id'),
                                                    xtype: 'treecolumn',
                                                    flex: 1,
                                                    tdCls: 'vertical-middle',
                                                    dataIndex: '_id',
                                                    sortable: true,
                                                    renderer: function (value, opt, node) {
                                                        var raw = node.raw;
                                                        if (raw.clazz == "com.qpp.cgp.domain.product.SkuProduct"
                                                            || raw.clazz == 'com.qpp.cgp.domain.product.ConfigurableProduct') {
                                                            return '产品:' + raw.name + '(' + raw.id + ')';
                                                        } else {
                                                            return '属性:' + raw.name + '(' + raw.id + ')';
                                                        }
                                                    }
                                                }, {
                                                    text: i18n.getKey('属性类型'),
                                                    width: 100,
                                                    dataIndex: '_id',
                                                    sortable: true,
                                                    renderer: function (value, opt, node) {
                                                        var raw = node.raw;
                                                        if (raw.clazz == 'com.qpp.cgp.domain.attribute.Attribute') {
                                                            return raw.selectType;
                                                        }
                                                    }
                                                }, {
                                                    text: i18n.getKey('选项'),
                                                    flex: 1,
                                                    dataIndex: '_id',
                                                    sortable: true,
                                                    renderer: function (value, opt, node) {
                                                        var raw = node.raw;
                                                        if (raw.clazz == 'com.qpp.cgp.domain.attribute.Attribute') {
                                                            var item = [];
                                                            var options = raw.options;
                                                            var str = '';
                                                            options.map(function (option) {
                                                                str += option.name + ','
                                                            });
                                                            return JSAutoWordWrapStr(str);
                                                        }
                                                    }
                                                }]
                                            }
                                        ],
                                        bbar: {
                                            xtype: 'bottomtoolbar',
                                            saveBtnCfg: {
                                                handler: function (btn) {
                                                    var win = btn.ownerCt.ownerCt;
                                                    var treePanel = win.items.items[0];
                                                    var selectedRecord = treePanel.getSelectionModel().getSelection();
                                                    if (selectedRecord) {
                                                        var data = [];
                                                        selectedRecord.map(function (record) {
                                                            data.push(record.raw);
                                                        })
                                                        win.outGrid.store.proxy.data = win.outGrid.store.proxy.data.concat(data);
                                                        win.outGrid.store.load();
                                                        win.close();
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    win.show();
                                }
                            }
                        },
                        store: attributeStore,
                        columns: [
                            {
                                xtype: 'actioncolumn',
                                width: 30,
                                items: [
                                    {
                                        iconCls: 'icon_remove icon_margin',
                                        tooltip: 'Delete',
                                        handler: function (view, rowIndex, colIndex, a, b, record) {
                                            var store = view.getStore();
                                            var grid = view.ownerCt;
                                            //判断是否有用到该属性里面的选项
                                            var options = record.raw.options;
                                            var usedOptionIds = grid.usedOptionIds;
                                            for (var i = 0; i < options.length; i++) {
                                                if (Ext.Array.contains(usedOptionIds, options[i].id)) {
                                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('该属性的选项已经被使用中'));
                                                    return;
                                                }
                                            }
                                            if (store.proxy.data) {//处理本地数据
                                                store.proxy.data.splice(rowIndex, 1);
                                            }
                                            store.remove(record);
                                        }
                                    }
                                ]
                            },
                            {
                                text: i18n.getKey('id'),
                                width: 100,
                                dataIndex: 'id',
                                sortable: true
                            },
                            {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                width: 200,
                            },
                            {
                                text: i18n.getKey('code'),
                                dataIndex: 'code',
                                width: 300,
                                sortable: true
                            },
                            {
                                text: i18n.getKey('valueType'),
                                dataIndex: 'valueType',
                                width: 120,
                                sortable: true
                            }, {
                                text: i18n.getKey('值输入方式'),
                                dataIndex: 'selectType',
                                flex: 1,
                                width: 150,
                                sortable: true,
                                renderer: function (value, mate, record) {
                                    if (value == 'NON') {
                                        return '手动输入';
                                    } else if (value == 'MULTI') {
                                        return '多选';
                                    } else {
                                        return '单选';
                                    }
                                }
                            },
                        ],
                    }
                },
                {
                    xtype: 'panel',
                    height: '100%',
                    width: '100%',
                    flex: 1,
                    layout: 'border',
                    border: false,
                    bodyStyle: {
                        borderColor: 'silver',
                        backgroundColor: 'silver'
                    },
                    itemId: 'optionPanel',
                    header: {
                        style: 'background-color:white;',
                        color: 'black',
                        border: '0 0 0 0'
                    },
                    items: [
                        {
                            xtype: 'treepanel',
                            region: 'west',
                            itemId: 'leftTree',
                            width: 400,
                            usedOptionIds: usedOptionIds,
                            height: '100%',
                            header: {
                                style: 'background-color:white;border-color:silver',
                                color: 'black',
                                height: 37,
                                title: '<font color=green>' + i18n.getKey('可映射的属性选项') +
                                    '</font><div style="display: table-column;width: 50px"></div>' +
                                    '<font color=red>' + i18n.getKey('拖拽叶子节点到右侧亮色区域进行添加') + '</font>',
                            },
                            rootVisible: false,
                            store: {
                                xtype: 'treestore',
                                fields: ['id', 'code', {
                                    name: 'icon',
                                    type: 'string',
                                    convert: function (value, record) {
                                        var clazz = record.raw.clazz;
                                        if (clazz == "com.qpp.cgp.domain.attribute.Attribute") {
                                            return path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_red.png';
                                        } else {
                                            return path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_green.png';
                                        }
                                    }
                                }],
                                root: {
                                    expanded: true,
                                    children: []
                                },
                            },
                            columns: [
                                {
                                    xtype: 'treecolumn',
                                    dataIndex: 'name',
                                    flex: 1,
                                    renderer: function (value, el, node) {
                                        return (node.raw.code || node.raw.name) + '(' + node.raw.id + ')';
                                    }
                                }
                            ],
                            viewConfig: {
                                stripeRows: true,
                            },
                            listeners: {
                                itemChange: function (data) {
                                    var leftTree = this;
                                    var usedOptionIds = leftTree.ownerCt.ownerCt.ownerCt.usedOptionIds;
                                    leftTree.suspendLayouts();
                                    leftTree.store.getRootNode().removeAll();
                                    if (data.length > 0) {
                                        data = data.map(function (attribute) {
                                            var attributeId = attribute.id;
                                            attribute.leaf = false;
                                            attribute.children = attribute.options?.filter(function (option) {
                                                option.leaf = true;
                                                option.attributeId = attributeId;
                                                return !Ext.Array.contains(usedOptionIds, option.id);
                                            });
                                            return attribute;
                                        });
                                        leftTree.store.getRootNode().appendChild(data);
                                    }
                                    leftTree.expandAll();
                                    leftTree.resumeLayouts();
                                    leftTree.doLayout();
                                },
                                itemDelete: function (optionData) {
                                    var leftTree = this;
                                    var rootNode = leftTree.getRootNode();
                                    var win = leftTree.ownerCt.ownerCt.ownerCt;
                                    //需要找出被删除的option原本所在的属性
                                    var categoryProductInfoStore = win.categoryProductInfoStore;
                                    for (var i = 0; i < optionData.length; i++) {
                                        leftTree.usedOptionIds.splice(leftTree.usedOptionIds.indexOf(optionData[i].id), 1);
                                        var parentNode = rootNode.findChild('id', optionData[i].attributeId);

                                        Ext.Object.merge(optionData[i], {
                                            leaf: true,
                                            cls: 'nantest',
                                            qtip: '拖拽到右边进行添加',
                                            code: optionData[i].displayValue
                                        });
                                        parentNode.appendChild(optionData[i]);
                                    }
                                },
                                afterrender: function () {
                                    var me = this;
                                    var view = me.getView();
                                    new Ext.dd.DragZone(view.el, {
                                        view: view,
                                        ddGroup: 'someGroup',
                                        getDragData: function (e) {
                                            var sourceEl = e.getTarget('.x-grid-tree-node-leaf', 10);
                                            if (sourceEl) {
                                                var d = sourceEl.cloneNode(true);
                                                d.id = Ext.id();
                                                return {
                                                    ddel: d,
                                                    sourceEl: sourceEl,
                                                    repairXY: Ext.fly(sourceEl).getXY(),
                                                    sourceStore: view.store,
                                                    record: view.getRecord(sourceEl)
                                                }
                                            }
                                        },
                                    });
                                }
                            }
                        },
                        {
                            xtype: 'componentgrid',
                            region: 'center',
                            itemId: 'optionGrid',
                            bodyStyle: {
                                borderColor: 'silver',
                            },
                            usedOptionIds: usedOptionIds,
                            store: Ext.create('Ext.data.Store', {
                                xtype: 'store',
                                proxy: {
                                    type: 'pagingmemory'
                                },
                                pageSize: 5,
                                fields: [
                                    'name',
                                    {
                                        name: 'relationOptions',
                                        type: 'array'
                                    }
                                ],
                                data: [{
                                    name: '选项_0',
                                    relationOptions: []
                                }]
                            }),
                            height: '100%',
                            flex: 1,
                            autoScroll: true,
                            header: {
                                style: 'background-color:white;border-color:silver',
                                color: 'black',
                                height: 37,
                                title: '<font color=green>' + i18n.getKey('过滤参数选项') + '</font>',
                            },
                            componentViewCfg: {
                                columns: 3,
                                multiSelect: false,
                                tableAlign: 'left',
                                actionBarCfg: {
                                    hidden: true
                                },//编辑和删除的区域配置
                                editHandler: function (btn) {
                                },
                                deleteHandler: function (btn) {
                                },
                                renderer: function (record, view) {
                                    var me = this;
                                    var rowIndex = record.index;
                                    var store = record.store;
                                    var page = store.currentPage;
                                    if (page > 1) {
                                        rowIndex += (page - 1) * store.pageSize;
                                    }
                                    rowIndex = rowIndex + 1;
                                    var relationOptions = record.get('relationOptions');
                                    return {
                                        xtype: "panel",
                                        width: 350,
                                        height: 250,
                                        margin: 5,
                                        border: 1,
                                        itemId: 'container_' + rowIndex,
                                        layout: 'fit',
                                        record: record,
                                        view: view,
                                        index: rowIndex,
                                        borderColor: 'red',
                                        fieldLabel: i18n.getKey('name'),
                                        tbar: [
                                            {
                                                xtype: 'textfield',
                                                value: record.get('name') || ('选项_' + rowIndex),
                                                labelWidth: 60,
                                                fieldLabel: i18n.getKey('选项名'),
                                                checkChangeBuffer: 500,
                                                listeners: {
                                                    change: function () {
                                                        var textField = this;
                                                        view.store.proxy.data[rowIndex - 1].name = textField.getValue();
                                                    }
                                                }
                                            },
                                            '->',
                                            {
                                                iconCls: 'x-tool-img',
                                                componentCls: 'btnOnlyIcon',
                                                handler: function (btn) {
                                                    var record = btn.ownerCt.ownerCt.record;
                                                    var relationOptions = record.get('relationOptions');
                                                    var leftTree = btn.ownerCt.ownerCt.view.ownerCt.ownerCt.ownerCt.getComponent('leftTree');
                                                    leftTree.fireEvent('itemDelete', relationOptions);
                                                    if (view.store.proxy.data) {//处理本地数据
                                                        view.store.proxy.data.splice(record.index - 1, 1);
                                                    }
                                                    view.store.load();
                                                }
                                            }
                                        ],
                                        bodyStyle: {
                                            borderColor: 'silver',
                                            backgroundColor: 'red'
                                        },
                                        items: [{
                                            xtype: 'optioncontainer',
                                            height: 250,
                                            maxHeight: undefined,
                                            deleteHandlerName: 'deleteOption',
                                            getDisplayValue: function (value) {
                                                return value.displayValue + '(' + value.id + ')';
                                            },
                                            panelConfig: {
                                                bodyCls: 'nantest',
                                                dockedItems: [],
                                            },
                                            value: relationOptions
                                        }]
                                    };
                                }
                            },
                            tbarCfg: {
                                style: {
                                    borderColor: 'silver',
                                },
                                padding: '3 3',
                                height: 29,
                                btnCreate: {
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerCt;
                                        grid.ownerCt.store.proxy.data.push({
                                            name: '选项_' + grid.ownerCt.store.getCount(),
                                            relationOptions: []
                                        });
                                        grid.ownerCt.store.load();
                                    }
                                },
                                btnDelete: {
                                    hidden: true,
                                },
                                btnExport: {
                                    hidden: true,
                                },
                                btnImport: {
                                    hidden: true,
                                }
                            },
                            filterCfg: {
                                hidden: true,
                            },
                            listeners: {
                                select: function (selectMode, record, rowIndex) {
                                    var me = this;
                                    var panel = me.ownerCt;
                                    var leftTree = panel.getComponent('leftTree');
                                    leftTree.show();
                                },
                                afterrender: function () {
                                    var me = this;
                                    var view = me.getView();
                                    new Ext.dd.DropZone(view.el, {
                                        view: view,
                                        ddGroup: 'someGroup',
                                        dataView: view,
                                        /**
                                         * 获取下放目标的数据
                                         * @param e
                                         * @returns {*}
                                         */
                                        getTargetFromEvent: function (e) {
                                            var dom = e.getTarget('.nantest');
                                            var dataView = this.dataView;
                                            if (dom) {
                                                //获取到所属View
                                                var targetView = null;
                                                var component = Ext.ComponentQuery.query('[itemId*=container_]');
                                                for (var i = 0; i < component.length; i++) {
                                                    var item = component[i];
                                                    if (item?.el?.dom?.contains(dom)) {
                                                        targetView = item;
                                                        break;
                                                    }
                                                }
                                                return {
                                                    component: targetView,
                                                    dataView: this.dataView,
                                                    dom: dom
                                                }
                                            }
                                        },
                                        onNodeDrop: function (target, dd, e, data) {
                                            try {
                                                var newData = target.component.record.get('relationOptions');
                                                var optionId = data.record.raw.id;
                                                newData.push(Ext.clone(data.record.raw));
                                                newData = newData.map(function (item) {
                                                    return item;
                                                });
                                                var usedOptionIds = this.view.ownerCt.ownerCt.usedOptionIds
                                                target.component.items.items[0].setValue(newData);
                                                data.record.parentNode.removeChild(data.record);
                                                usedOptionIds.push(optionId);
                                                return true;
                                            } catch (e) {
                                                return false;
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    ],
                    getValue: function () {
                        var me = this;
                        var optionsGrid = me.getComponent('optionGrid');
                        return optionsGrid.store.proxy.data;
                    },
                    diySetValue: function (data) {
                        var panel = this;
                        var optionGrid = panel.getComponent('optionGrid');
                        optionGrid.store.proxy.data = data;
                        optionGrid.store.load();
                    },
                    getErrors: function () {
                        return '该输入项为必输项'
                    },
                    getName: function () {
                        return 'options';
                    },
                    getFieldLabel: function () {
                        return '属性选项列表';
                    },
                    isValid: function () {
                        var me = this;
                        return me.getComponent('optionGrid').store.getCount() > 0
                    }
                }
            ],
        }];
        me.callParent();
    },
    listeners: {
        afterrender: function () {
            var win = this;
            if (win.record) {
                JSSetLoading(true);
                var form = win.getComponent('form');
                //先提取出usedOptionIds
                var data = Ext.clone(win.record.getData());
                for (var i = 0; i < data.options.length; i++) {
                    var item = data.options[i];
                    for (var j = 0; j < item.relationOptions.length; j++) {
                        win.usedOptionIds.push(item.relationOptions[j].id);
                    }
                }
                //为attibute填充选项数据
                form.setValue(data);
                JSSetLoading(false);
            }
        }
    }
})