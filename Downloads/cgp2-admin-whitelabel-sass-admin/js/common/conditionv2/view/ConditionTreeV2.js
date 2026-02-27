/**
 * @Description:树状复杂结构
 * 树状结构里面如何找到对应记录的组件，
 * 不能用行号和列号来进行标识，
 * 应为经过删增，会有重复的行号
 * @author nan
 * @date 2022/10/17
 */
Ext.Loader.syncRequire([
    'CGP.common.conditionv2.view.ValueDisplayColumn',
    'CGP.common.conditionv2.view.EditConditionWin',
    'CGP.common.conditionv2.model.ConditionTreeModel',
    'CGP.common.conditionv2.view.AttributeGridCombo'
])
Ext.define("CGP.common.conditionv2.view.ConditionTreeV2", {
    extend: 'Ext.tree.Panel',
    alias: 'widget.condition_tree_v2',
    autoScroll: true,
    border: '50',
    componentUUId: null,//一个独一无二的编号，用于加在grid中componentcolumn中渲染出的组件Id的后缀上，使创建多个该组件时不会发生组件id重复
    columnLines: true,
    rowLines: true,
    viewConfig: {
        stripeRows: true,
        markDirty: false//标识修改的字段
    },
    /*
    
        hideHeaders: true,
    */
    //必须有的配置，如下
    contextStore: null,//上下文store
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
        var nodemenu = new Ext.menu.Menu({
            items: [
                {
                    text: "添加简单条条件",
                    hidden: record.raw.clazz != 'LogicalOperation',
                    handler: function () {
                        var contextStore = treePanel.contextStore;
                        var win = Ext.create('CGP.common.conditionv2.view.EditConditionWin', {
                            record: record,
                            createOrEdit: 'create',
                            contextStore: contextStore,

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
                }
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
     * 获取对应行的数据当前数据,该数据可能已经被修改
     * @param rowIndex
     * @param record
     */
    getComponentData: function (rowIndex, record) {
        var treePanel = this;
        var components = treePanel.query('[recordId*=' + record.id + ']') || [];
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
                'clazz',
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
                    xtype: 'componentcolumn',
                    text: i18n.getKey('上下文属性'),
                    dataIndex: 'source',
                    flex: 2,
                    componentUUId: me.componentUUId,
                    renderer: function (value, meta, record, rowIndex, colIndex, store, gridView) {
                        var tree = gridView.ownerCt;
                        var itemId = tree.componentUUId + '_' + rowIndex + '_' + colIndex + '_source';
                        var operatorId = tree.componentUUId + '_' + rowIndex + '_' + (colIndex + 1) + '_operator';
                        var valueFieldId = tree.componentUUId + '_' + rowIndex + '_' + (colIndex + 2) + '_value';
                        if (record.raw.clazz == 'LogicalOperation') {
                            meta.tdCls = 'hidden';
                        } else {
                            return {
                                xtype: 'attribute_grid_combo',
                                name: 'source',
                                itemId: itemId,
                                allowBlank: false,
                                attributeData: value,
                                haveReset: false,
                                readOnly: true,
                                recordId: record.id,//用来筛选记录对应的组件
                                store: tree.contextStore,
                                listeners: {
                                    afterrender: function () {
                                        var me = this;
                                        me.diySetValue(me.attributeData);
                                    },
                                    change: function (gridCombo, newValue, oldValue) {
                                        //单选 多选，输入  string number boolean
                                        var attribute = gridCombo.getArrayValue();
                                        var valueType = attribute.valueType;
                                        var selectType = attribute.selectType;
                                        var operator = tree.query('[itemId*=' + operatorId + ']').pop();
                                        //影响可选操作符
                                        operator.setOption(selectType, valueType);
                                        //影响设置值类型，输入方式
                                        //影响值的选项值
                                        var valueField = tree.query('[itemId*=' + valueFieldId + ']').pop();

                                        //清空数据
                                        if (oldValue) {
                                            operator.setValue('');
                                            valueField.diySetValue(null);

                                        }
                                    }
                                },
                            }
                        }
                    }
                },
                {
                    xtype: 'componentcolumn',
                    text: i18n.getKey('比较操作符'),
                    contextStore: me.contextStore,//上下文store
                    contextData: me.contextData,
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
                        var operationClazz = record.raw.clazz;
                        var attributeFieldId = tree.componentUUId + '_' + rowIndex + '_' + (colIndex - 1) + '_source';
                        var valueFieldId = tree.componentUUId + '_' + rowIndex + '_' + (colIndex + 1) + '_value';
                        var valueColumn = gridView.headerCt.items.items[3];//显示的值列
                        if (record.raw.clazz == 'LogicalOperation') {
                            metadata.tdAttr = 'colSpan=3';
                            return {
                                xtype: 'combo',
                                itemId: itemId,
                                name: 'operator',
                                value: value,
                                width: 'auto',
                                flex: 1,
                                recordId: record.id,//用来筛选记录对应的组件
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
                            return {
                                xtype: 'compare_operator_v2',
                                itemId: itemId,
                                name: 'operator',
                                value: value,
                                width: 'auto',
                                flex: 1,
                                record: record,
                                recordId: record.id,//用来筛选记录对应的组件
                                allowBlank: false,
                                readOnly: true,
                                fieldLabel: null,
                                diyGetValue: function () {
                                    return {
                                        clazz: operationClazz,
                                        operator: this.getValue()
                                    }
                                },
                                /*      listeners: {
                                          change: function (combo, newValue, oldValue) {
                                              if (oldValue) {
                                                  var newValue = tree.getComponentData(rowIndex, combo.record);
                                                  if ("IntervalOperation") {
                                                      //区间

                                                  } else {

                                                      if (value.clazz == 'ContextPathValue') {   //ContextPathValue

                                                      } else if (value.clazz == 'ProductAttributeValue') { //ProductAttributeValue

                                                      } else if (value.clazz == 'ConstantValue') {//ConstantValue

                                                      } else if (value.clazz == 'CalculationValue') {//CalculationValue

                                                      }
                                                  }
      /!*
                                                  var component = valueColumn.getDisplayComponent(null, metadata, record, rowIndex, colIndex, store, gridView);
      *!/

                                              }
                                          },
                                      }*/
                            }
                        }
                    }
                },
                {
                    xtype: 'valuedisplaycolumn',
                    text: i18n.getKey('value'),
                    flex: 2,
                    componentUUId: me.componentUUId,
                    contextStore: me.contextStore,//上下文store
                    contextData: me.contextData,
                    dataIndex: 'value',
                    beforeRenderer: function (value, meta, record, rowIndex, colIndex, store, gridView) {
                        if (record.raw.clazz == 'LogicalOperation') {
                            meta.tdCls = 'hidden';
                        }
                    }
                },
                {
                    xtype: 'actioncolumn',
                    sortable: false,
                    hidden: me.checkOnly,
                    menuDisabled: true,
                    tdCls: 'flex_center',
                    text: '操作',
                    width: 80,
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
                                var contextStore = treePanel.contextStore;
                                var data = treePanel.getComponentData(rowIndex, record);
                                var win = Ext.create('CGP.common.conditionv2.view.EditConditionWin', {
                                    record: record,
                                    createOrEdit: 'edit',
                                    data: data,
                                    contextStore: contextStore,
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
        //判断是否为一个空的树
        if (result.expressions.length == 0) {
            return null;
        } else {
            return result;
        }
    },
    diySetValue: function (data) {
        var me = this;
        var render = function () {
            var cloneData = Ext.clone(data);
            Ext.suspendLayouts();
            var rootNode = me.getRootNode();
            rootNode.removeAll();
            rootNode.set('operator', cloneData.operator);
            rootNode.raw = {
                'operator': cloneData.operator,
                clazz: 'LogicalOperation'
            }
            //转换expressions为children
            JSReplaceKeyName(cloneData.expressions, 'expressions', 'children');
            rootNode.appendChild(cloneData.expressions);
            me.expandAll();
            Ext.resumeLayouts();
            setTimeout(function () {
                me.doLayout();
            }, 500)
        };
        if (me.rendered) {
            render();
        } else {
            me.on('afterrender', function () {
                render();
            })
        }
    }
})

