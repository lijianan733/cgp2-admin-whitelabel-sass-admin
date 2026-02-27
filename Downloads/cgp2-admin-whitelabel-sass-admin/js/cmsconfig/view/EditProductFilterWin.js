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
Ext.define('CGP.cmsconfig.view.EditProductFilterWin', {
    extend: 'Ext.panel.Panel',
    modal: true,
    itemId: 'editProductFilterWin',
    constrain: true,
    maximized: false,
    maximizable: true,
    closable: true,
    alias: 'widget.editproductfilterwin',
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
        window.deleteProduct = window.deleteProduct || function (itemId) {
            var field = Ext.getCmp(itemId);
            var arrayField = field.ownerCt.ownerCt;
            var array = arrayField.value;
            var optionData = field.realValue;
            var productId = field.realValue.id;
            var leftTree = arrayField.ownerCt.view.ownerCt.ownerCt.ownerCt.getComponent('leftTree');
            field.ownerCt.remove(field);
            for (var i = 0; i < array.length; i++) {
                if (productId == array[i].id) {
                    array.splice(i, 1);
                    break;
                }
            }
            leftTree.fireEvent('itemDelete', [optionData]);
        };
        var usedOptionIds = me.usedOptionIds = [];
        me.title = (me.record ? i18n.getKey('edit') : i18n.getKey('create')) + i18n.getKey('产品筛选配置');
        //改写删除操作的逻辑
        var categoryProductInfoStore = me.outGrid.categoryProductInfoStore;
        var localProductData = [];
        categoryProductInfoStore.data.items.map(function (item) {
            localProductData.push(Ext.clone(item.raw));
        })
        var localProductStore = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'id',
                    type: 'number'
                }, {
                    name: 'mode',
                    type: 'string'
                }, {
                    name: 'model',
                    type: 'string'
                }, {
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'sku',
                    type: 'string'
                }, {
                    name: 'type',
                    type: 'string',
                    convert: function (value) {
                        return value.toLowerCase();
                    }
                }],
            proxy: {
                type: 'memory'
            },
            data: localProductData,
            filters: [
                function (item) {
                    var productId = item.get('id');
                    return !Ext.Array.contains(usedOptionIds, productId);
                }
            ]
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
            layout: 'vbox',
            items: [
                {
                    xtype: 'textfield',
                    width: 400,
                    itemId: 'name',
                    name: 'name',
                    allowBlank: false,
                    margin: '15 25 5 25',
                    fieldLabel: i18n.getKey('过滤参数名')
                },
                {
                    xtype: 'panel',
                    height: '100%',
                    width: '100%',
                    flex: 1,
                    margin: '5 25 5 25',
                    layout: 'border',
                    border: false,
                    bodyStyle: {
                        borderColor: 'silver',
                        backgroundColor: 'silver'
                    },
                    itemId: 'optionPanel',
                    header: false,
                    items: [
                        {
                            xtype: 'grid',
                            region: 'west',
                            itemId: 'leftTree',
                            width: 400,
                            usedOptionIds: usedOptionIds,
                            height: '100%',
                            split: true,
                            header: {
                                style: 'background-color:white;border-color:silver',
                                color: 'black',
                                height: 37,
                                title: '<font color=green>' + i18n.getKey('可筛选产品列表') +
                                    '</font><div style="display: table-column;width: 100%"></div>' +
                                    '<font color=red style="float: right;">' + i18n.getKey('拖拽数据到右侧亮色区域进行添加') + '</font>',
                            },
                            rootVisible: false,
                            store: localProductStore,
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    tdCls: 'vertical-middle',
                                },
                                {
                                    dataIndex: 'name',
                                    flex: 1,
                                    itemId: 'name',
                                    text: i18n.getKey('product'),
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
                                    optionData.map(function (item) {
                                        var productId = item.id;
                                        leftTree.usedOptionIds.splice(leftTree.usedOptionIds.indexOf(productId), 1);
                                    })
                                    leftTree.store.load();
                                    //需要找出被删除的option原本所在的属性

                                },
                                afterrender: function () {
                                    var me = this;
                                    var view = me.getView();
                                    new Ext.dd.DragZone(view.el, {
                                        view: view,
                                        ddGroup: 'someGroup',
                                        getDragData: function (e) {
                                            var sourceEl = e.getTarget('.x-grid-row', 10);
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
                                fields: [
                                    'name',
                                    {
                                        name: 'products',
                                        type: 'array'
                                    }
                                ],
                                data: [{
                                    name: '选项_0',
                                    products: []
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
                                /*
                                                                columns: 3,
                                */
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
                                    var products = record.get('products');
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
                                                    var products = record.get('products');
                                                    var leftTree = btn.ownerCt.ownerCt.view.ownerCt.ownerCt.ownerCt.getComponent('leftTree');
                                                    leftTree.fireEvent('itemDelete', products);
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
                                            deleteHandlerName: 'deleteProduct',
                                            getDisplayValue: function (value) {
                                                return value.name + '(' + value.id + ')';
                                            },
                                            panelConfig: {
                                                bodyCls: 'nantest',
                                                dockedItems: [],
                                            },
                                            value: products
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
                                            products: []
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
                                                var newData = target.component.record.get('products');
                                                var raw = data.record.raw;
                                                var productId = raw.id;
                                                newData.push({
                                                    id: raw.id,
                                                    type: raw.type.toLowerCase(),
                                                    clazz: raw.clazz,
                                                    name: raw.name
                                                });
                                                newData = newData.map(function (item) {
                                                    return item;
                                                });
                                                var usedOptionIds = this.view.ownerCt.ownerCt.usedOptionIds
                                                usedOptionIds.push(productId);
                                                target.component.items.items[0].setValue(newData);
                                                data.record.store.load();
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
                        var leftTree = panel.getComponent('leftTree');
                        optionGrid.store.proxy.data = data;
                        optionGrid.store.load();
                        leftTree.store.load();
                    },
                    getErrors: function () {
                        return '该输入项为必输项'
                    },
                    getName: function () {
                        return 'options';
                    },
                    getFieldLabel: function () {
                        return '过滤参数选项';
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
                var data = Ext.clone(win.record.getData());
                for (var i = 0; i < data.options.length; i++) {
                    var item = data.options[i];
                    for (var j = 0; j < item.products.length; j++) {
                        win.usedOptionIds.push(item.products[j].id);
                    }
                }
                //为attibute填充选项数据
                form.setValue(data);
                JSSetLoading(false);
            }
        }
    }
})