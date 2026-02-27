/**
 * @Description:
 * @author nan
 * @date 2022/10/17
 */
Ext.Loader.syncRequire([
    'CGP.common.conditionv2.view.ValueDisplayColumn',
    'CGP.common.conditionv2.view.ILogicalField'
])
Ext.define("CGP.common.conditionv2.view.ConditionTree", {
    extend: 'Ext.tree.Panel',
    alias: 'widget.conditiontree',
    autoScroll: true,
    border: '50',
    maxHeight: 350,
    hideConditionModel: false,//隐藏执行模式
    CompareOperation: [
        {
            value: '==',
            display: '='
        },
        {
            value: '!=',
            display: '!='
        },
        {
            value: '<',
            display: '<'
        },
        {
            value: '<=',
            display: '<='
        },
        {
            value: '>',
            display: '>'
        },
        {
            value: '>=',
            display: '>='
        },
    ],
    IntervalOperation: [
        {
            display: '[min,max]',
            value: '[min,max]'
        },
        {
            display: '[min,max)',
            value: '[min,max)'
        },
        {
            display: '(min,max)',
            value: '(min,max)'
        },
        {
            display: '(min,max]',
            value: '(min,max]'
        }

    ],
    RangeOperation: [
        {
            display: 'In',
            value: 'In'
        }, {
            display: 'NotIn',
            value: 'NotIn'
        }],
    componentUUId: null,//一个独一无二的编号，用于加在grid中componentcolumn中渲染出的组件Id的后缀上，使创建多个该组件时不会发生组件id重复
    viewConfig: {
        markDirty: false//标识修改的字段
    },
    /*
        hideHeaders: true,
    */
    //必须有的配置，如下
    productId: null,
    contextAttributeStore: null,//上下文store
    contextData: null,
    listeners: {
        itemcontextmenu: function (view, record, item, index, e, eOpts) {
            var tree = view.ownerCt;
            tree.showRightClickMenu(view, record, item, index, e, eOpts);
        },
    },
    /**
     * 右鍵菜單
     */
    showRightClickMenu: function (treeView, record, item, index, e, eOpts) {
        var treePanel = treeView.ownerCt;
        e.stopEvent();
        var isRoot = record.isRoot();
        var nodemenu = new Ext.menu.Menu({
            items: [
                {
                    text: "添加简单条条件",
                    hidden: record.raw.clazz != 'LogicalOperation',
                    handler: function () {
                        var contextAttributeStore = treePanel.contextAttributeStore;
                        var win = Ext.create('Ext.window.Window', {
                            modal: true,
                            constrain: true,
                            record: record,
                            title: i18n.getKey('create'),
                            layout: {
                                type: 'fit'
                            },
                            items: [
                                {
                                    xtype: 'ilogicalfield',
                                    margin: '0 50',
                                    productId: treePanel.productId,
                                    width: 400,
                                    allowBlank: false,
                                    contextStore: contextAttributeStore,
                                    itemId: 'ilogicalfield',
                                }
                            ],
                            bbar: {
                                xtype: 'bottomtoolbar',
                                saveBtnCfg: {
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        var ilogicalfield = win.getComponent('ilogicalfield');
                                        var data = ilogicalfield.diyGetValue();
                                        win.record.appendChild(data);
                                        win.record.expand();
                                        win.close();
                                    }
                                }
                            },
                        });
                        win.show();
                    }
                },
                {
                    text: "添加复杂条条件",
                    hidden: record.raw.clazz != 'LogicalOperation',
                    handler: function () {
                        record.appendChild({
                            clazz: 'LogicalOperation',
                            operator: 'AND',
                            expressions: []
                        });
                    }
                }/*,
                {

                    text: "删除结点",
                    hidden: isRoot,
                    cls: 'x-btn-text-icon',
                    handler: function () {
                        Ext.MessageBox.confirm("提示", "是否确定删除？", function (e) {
                            if (e == "yes") {
                                record.parentNode.removeChild(record);
                                record.remove();
                            }
                        });
                    }
                }*/
            ]
        });
        var menuCount = 0;
        for (var i = 0; i < nodemenu.items.items.length; i++) {
            if (!nodemenu.items.items[i].isHidden()) {
                menuCount++;
            }
        }
        if (menuCount > 0) {
            nodemenu.showAt(e.getPoint());//menu的showAt，不要忘记
        }
    },
    isValid: function () {
        var tree = this;
        var valid = true;
        //模糊查找出指定itemId的组件列表
        var components = tree.query('[itemId*=' + tree.componentUUId + ']');
        for (var i = 0; i < components.length; i++) {
            var component = components[i];
            if (component.isValid && component.isValid() == false) {
                valid = false;
            }
        }
        return valid;
    },
    /**
     *
     * @param rowIndex
     * @param record
     */
    getComponentData: function (rowIndex, record) {
        var treePanel = this;
        var components = treePanel.query('[itemId*=' + treePanel.componentUUId + '_' + rowIndex + ']') || [];
        if (components.length > 0) {
            var data = {};
            components.map(function (item) {
                data[item.name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
            });
            if (record.raw.clazz == 'LogicalOperation') {
                data.clazz = 'LogicalOperation';
            } else {
                data.clazz = data.operator.clazz;
                data.operator = data.operator.operator;
                if (data.clazz == "IntervalOperation") {
                    data = Ext.Object.merge(data, data.value);
                    delete data.value;
                }
            }
            return data;
        }
    },
    initComponent: function () {
        var me = this;
        me.componentUUId = JSGetUUID();
        me.store = Ext.create('Ext.data.TreeStore', {
            fields: [
                {
                    name: 'contentAttribute',
                    type: 'object'
                },
                {
                    name: 'operationType',
                    type: 'string',
                    defaultValue: me.operationType
                },
                {
                    name: 'operator',
                    type: 'string'
                },
                {
                    name: 'value',
                    type: 'object'
                },
                'text',
                {
                    name: 'source',
                    type: 'object'
                },
                {
                    name: 'icon',
                    type: 'string',
                    convert: function (value, record) {
                        if (record.raw.clazz == 'LogicalOperation') {
                            return path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_green.png';
                        } else {
                            return path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_orange.png';
                        }
                    }
                }
            ],
            root: {
                "clazz": "LogicalOperation",
                "operator": "AND",
            }
        });
        me.columns = {
            defaults: {
                menuDisabled: true,
                sortable: false,
            },
            items: [
                {
                    xtype: 'treecolumn',
                    dataIndex: 'text',
                    width: 100,
                    text: '<font color="red">鼠标右键新建</font>',
                    tdCls: 'vertical-middle',
                    renderer: function (value, metadata, record, row, col, store, gridView) {
                        var ui = JSGetUUID();
                        var clazz = record.raw.clazz;
                        var displayStr = '';
                        if (clazz == 'LogicalOperation') {
                            displayStr = '';
                        }
                        return '<font id="' + ui + '" color="green">' + displayStr + '</font>';
                    }
                },
                {
                    xtype: 'valuedisplaycolumn',
                    text: i18n.getKey('value'),
                    dataIndex: 'source',
                    flex: 2,
                    contextAttributeStore: me.contextAttributeStore,//上下文store
                    contextData: me.contextData,
                    productId: me.productId,
                    componentUUId: me.componentUUId,
                    diyRenderer: function (value, meta, record, rowIndex, colIndex, store, gridView) {
                        if (record.raw.clazz == 'LogicalOperation') {
                            meta.tdCls = 'hidden';
                        }
                    }
                },
                {
                    xtype: 'componentcolumn',
                    text: i18n.getKey('比较操作符'),
                    contextAttributeStore: me.contextAttributeStore,//上下文store
                    contextData: me.contextData,
                    productId: me.productId,
                    flex: 1,
                    autoWidthComponents: true,
                    dataIndex: 'operator',
                    setChildWidth: function (component, newWidth, oldWidth) {
                        if (oldWidth === newWidth) {
                            return false;
                        }
                        component.el.setWidth('auto')
                        return true;
                    },
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var tree = gridView.ownerCt;
                        var itemId = tree.componentUUId + '_' + rowIndex + '_' + colIndex + '_operator';
                        if (record.raw.clazz == 'LogicalOperation') {
                            metadata.tdAttr = 'colSpan=3';
                            return {
                                xtype: 'combo',
                                itemId: itemId,
                                name: 'operator',
                                value: value,
                                width: 'auto',
                                flex: 1,
                                editable: false,
                                store: {
                                    fields: [
                                        'value',
                                        'display'
                                    ],
                                    data: [
                                        {
                                            value: 'AND',
                                            display: '满足以下全部条件'
                                        },
                                        {
                                            value: 'OR',
                                            display: '满足以下任一条件'
                                        }
                                    ]

                                },
                                valueField: 'value',
                                displayField: 'display',
                                listeners: {
                                    afterrender: function () {
                                        console.log('aa');
                                        this.el.setWidth('auto');
                                    }
                                }
                            }
                        } else {
                            var operationClazz = record.raw.clazz;
                            return {
                                xtype: 'combo',
                                itemId: itemId,
                                name: 'operator',
                                value: value,
                                width: 'auto',
                                flex: 1,
                                editable: false,
                                store: {
                                    fields: [
                                        'value',
                                        'display'
                                    ],
                                    data: tree[operationClazz]

                                },
                                valueField: 'value',
                                displayField: 'display',
                                diyGetValue: function () {
                                    return {
                                        clazz: operationClazz,
                                        operator: this.getValue()
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    xtype: 'valuedisplaycolumn',
                    text: i18n.getKey('value'),
                    flex: 2,
                    componentUUId: me.componentUUId,
                    contextAttributeStore: me.contextAttributeStore,//上下文store
                    contextData: me.contextData,
                    productId: me.productId,
                    dataIndex: 'value',
                    diyRenderer: function (value, meta, record, rowIndex, colIndex, store, gridView) {
                        if (record.raw.clazz == 'LogicalOperation') {
                            meta.tdCls = 'hidden';
                        }
                    }
                },
                {
                    xtype: 'actioncolumn',
                    sortable: false,
                    hidden: me.checkOnly,
                    tdCls: 'vertical-middle',
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_create',
                            tooltip: 'Add',
                            isDisabled: function (gridView, rowIndex, colIndex, dom, record) {
                                if (record.raw.clazz == 'LogicalOperation') {
                                    return false;
                                } else {
                                    return true;
                                }
                            },
                            handler: function (view, rowIndex, colIndex, a, event, record) {
                                view.ownerCt.showRightClickMenu(view, record, null, null, event, null);
                            }
                        },
                        {
                            iconCls: 'icon_edit',
                            tooltip: 'Edit',
                            isDisabled: function (gridView, rowIndex, colIndex, dom, record) {
                                if (record.raw.clazz == 'LogicalOperation') {
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                var treePanel = view.ownerCt;
                                var contextAttributeStore = treePanel.contextAttributeStore;
                                var data = treePanel.getComponentData(rowIndex, record);
                                var win = Ext.create('Ext.window.Window', {
                                    modal: true,
                                    constrain: true,
                                    record: record,
                                    title: i18n.getKey('edit'),
                                    layout: {
                                        type: 'fit'
                                    },
                                    items: [
                                        {
                                            xtype: 'ilogicalfield',
                                            margin: '0 25',
                                            productId: treePanel.productId,
                                            width: 400,
                                            allowBlank: false,
                                            contextStore: contextAttributeStore,
                                            itemId: 'ilogicalfield',
                                        }
                                    ],
                                    bbar: {
                                        xtype: 'bottomtoolbar',
                                        saveBtnCfg: {
                                            handler: function (btn) {
                                                var win = btn.ownerCt.ownerCt;
                                                var ilogicalfield = win.getComponent('ilogicalfield');
                                                var data = ilogicalfield.diyGetValue();
                                                for (var i in data) {
                                                    win.record.raw = data;
                                                    win.record.set(i, data[i]);
                                                }
                                                win.close();
                                            }
                                        }
                                    },
                                    listeners: {
                                        afterrender: function () {
                                            var me = this;
                                            var ilogicalfield = me.getComponent('ilogicalfield');
                                            ilogicalfield.diySetValue(data);
                                        }
                                    }
                                });
                                win.show();
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            tooltip: 'Delete',
                            isDisabled: function (gridView, rowIndex, colIndex, dom, record) {
                                return record.isRoot();

                            },
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                var store = view.getStore();
                                Ext.Msg.confirm('提示', '确定删除？', callback);

                                function callback(id) {
                                    if (id === 'yes') {
                                        record.parentNode.removeChild(record);
                                        store.remove(record);
                                    }
                                }
                            }
                        }
                    ]
                },
            ]
        };
        me.callParent();
        me.on('afterrender', function () {
            var me = this;
            me.expandAll();
        });
        me.on('beforeitemcollapse', function () {
            /*
                        return false
            */
        });
    },
    /**
     *轉換獲取到的數據
     * @returns {null}
     */
    diyGetValue: function () {
        var me = this;
        var rootNode = me.getRootNode();
        var buildData = function (node) {
            var result = {};
            if (node.raw.clazz == 'LogicalOperation') {
                result = node.currentData;
                result.expressions = [];
                node.eachChild(function (item) {
                    result.expressions.push(buildData(item));
                })
                return result;
            } else {
                return node.currentData;
            }
        };
        var count = 0;
        rootNode.cascadeBy(function (node) {
            var result = me.getComponentData(count, node)
            node.currentData = result;
            count++;
        });
        var result = buildData(rootNode);
        return result;
    },
    diySetValue: function (data) {
        var me = this;
        var rootNode = me.getRootNode();
        rootNode.removeAll();
        rootNode.set('operator', data.operator);
        rootNode.raw = {
            'operator': data.operator,
            clazz: 'LogicalOperation'
        }
        rootNode.appendChild(data.expressions);
        me.expandAll();
    }
})
