/**
 * Created by nan on 2019/11/22.
 * 使用决策树来创建
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.ConstraintRuleDecisionTreeDataFieldSet', {
    extend: 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.DiyFieldSet',
    alias: 'widget.constraintRuleDecisionTreeDataFieldSet',
    productId: null,
    layout: 'fit',
    maxHeight: 600,
    isInclude: true,
    checkOnly: false,//是否只能查看
    attributeArray: null,
    isValid: function () {
        var me = this;
        var grid = me.items.items[0];
        var editor = grid.editingPlugin.getEditor();
        if (grid.store.getCount() == 0) {
            Ext.Msg.alert(i18n.getKey('prompt'), '属性组合列表不予许为空');
            return false;
        } else if (editor.hidden == false && editor.completeEdit() == false) {
            Ext.Msg.alert(i18n.getKey('prompt'), '请先完成属性组合的编辑');
            return false;
        } else {
            return true;
        }
    },
    /**
     * 生成该决策树下属性选项全部可能性组合
     * @param root
     * @param arrayAttribute
     * @param exclude
     * @returns {Array}
     */
    createAttributeValues: function (root, arrayAttribute, exclude) {
        var me = this;

        function depthFirstPreOrder(node, paths, position) {
            var i, count, path;
            var children = node.childNodes;
            if (children.length > 0) {
                for (i = 0, count = children.length; i < count; i++) {
                    var child = children[i];
                    if (i > 0) {
                        position.pop();
                    }
                    position.push(child);
                    depthFirstPreOrder(child, paths, position);
                    if (i == count - 1) {
                        position.pop();
                    }
                }
            } else {
                var data = [];
                Ext.Array.each(position, function (item) {
                    data.push({
                        clazz: 'com.qpp.cgp.domain.attributeMapping.enableoption.DecisionTreeNode',
                        skuAttributeId: item.data.attributeId,
                        optionId: item.data.optionId
                    })
                });
                paths.push(data);
            }
        }

        var paths = new Array(), position = new Array();
        depthFirstPreOrder(root, paths, position);
        if (!exclude) {
            return paths
        } else {
            return me.excludeAttributeValues(paths, arrayAttribute);
        }
    },
    /**
     * 将数据组合成要求的格式
     * @returns {*}
     */
    getValue: function () {
        var me = this;
        var treePanel = me.items.items[0];
        var root = treePanel.getRootNode();
        //递归遍历树，如果是叶子节点就返回其路径
        var result = root.raw;
        result.children = [];
        result = JSTreeNodeToJsonTree(root, result);
        return {
            rules: [{
                clazz: 'com.qpp.cgp.domain.attributemapping.enableoption.DecisionTree',
                tree: result.children
            }],
            isInclude: me.isInclude,
            executeCondition: null
        }
        return result;
    },
    /**
     * 将数据组合成要求的格式
     * @param data
     */
    setValue: function (data) {
        var me = this;
        var isInclude = data.isInclude;
        var grid = me.items.items[0];
        var toolbar = grid.getDockedItems('toolbar[dock="top"]')[0];
        var isIncludeCheckBoxGroup = toolbar.getComponent('isInclude');
        grid.store.getRootNode().removeAll();
        grid.store.getRootNode().appendChild(Ext.JSON.decode(Ext.JSON.encode(data.rules[0].tree)));
        grid.expandAll();
        isIncludeCheckBoxGroup.setValue({
            isInclude: isInclude
        })
    },
    initComponent: function () {
        var me = this;
        var root = {id: 0, name: 'root', optionId: 'root', children: []};
        var createTreeData = function (n, parent, attributeObj) {
            var me = this;
            Ext.Array.each(attributeObj[n].attribute.options, function (item, index) {
                var child = {
                    skuAttributeId: attributeObj[n].id,
                    attributeName: attributeObj[n].displayName,
                    optionId: item.id,
                    optionName: item.name,
                    leaf: true,
                    clazz: 'com.qpp.cgp.domain.attributemapping.enableoption.DecisionTreeNode'

                };
                parent.children.push(child);
                if (n < attributeObj.length - 1) {
                    child.children = [];
                    child.leaf = false;
                    createTreeData(n + 1, child, attributeObj);
                }
            });
        };
        createTreeData(0, root, me.attributeArray);
        var dataStructureStore = Ext.create('CGP.product.view.productattributeconstraint.store.DataStructureStore', {
            root: root
        });
        me.items = [
            {
                xtype: 'treepanel',
                collapsible: true,
                header: false,
                maxHeight: 400,
                padding: 10,
                rootVisible: false,
                useArrows: false,
                viewConfig: {
                    stripeRows: true
                },
                autoScroll: true,
                itemId: 'dataStructureTree',
                listeners: {
                    afterrender: function (treepanel) {
                        treepanel.expandAll();
                    }
                },
                store: dataStructureStore,
                tbar: [
                    {
                        text: i18n.getKey('reset'),
                        iconCls: 'icon_reset',
                        handler: function (btn) {
                            var treePanel = btn.ownerCt.ownerCt;
                            var rootNode = {id: 0, name: 'root', optionId: 'root', children: []};
                            createTreeData(0, rootNode, treePanel.ownerCt.attributeArray);
                            treePanel.store.setRootNode(rootNode);
                            treePanel.expandAll();
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('expandAll'),
                        iconCls: 'icon_collapseAll',
                        count: 1,
                        handler: function (btn) {
                            var treepanel = btn.ownerCt.ownerCt;
                            if (btn.count % 2 == 0) {
                                treepanel.expandAll();
                                btn.setText(i18n.getKey('collapseAll'));
                                btn.setIconCls('icon_collapseAll');

                            } else {
                                treepanel.collapseAll();
                                btn.setText(i18n.getKey('expandAll'));
                                btn.setIconCls('icon_expandAll');
                            }
                            btn.count++;
                        }
                    },
                    {
                        xtype: 'radiogroup',
                        columns: 2,
                        width: 500,
                        name: 'isInclude',
                        itemId: 'isInclude',
                        vertical: true,
                        items: [
                            {boxLabel: '启用以下项组合', name: 'isInclude', inputValue: true, checked: true},
                            {boxLabel: '禁用以下选项组合', name: 'isInclude', inputValue: false}
                        ],
                        listeners: {
                            change: function (btn, newValue, oldValue) {
                                btn.ownerCt.ownerCt.ownerCt.isInclude = newValue.isInclude;
                            }
                        }
                    }
                ],
                columns: [
                    {
                        xtype: 'actioncolumn',
                        itemId: 'actioncolumn',
                        width: 30,
                        sortable: false,
                        resizable: false,
                        menuDisabled: true,
                        items: [
                            {
                                iconCls: 'icon_remove icon_margin',
                                itemId: 'actiondelete',
                                tooltip: i18n.getKey('remove'),
                                handler: function (view, rowIndex, colIndex, a, b, record) {
                                    var store = view.getStore();
                                    if (record.parentNode.childNodes.length == 1) {
                                        Ext.Msg.alert('提示', '删除此节点将不能构成完整的结构组合！');
                                    } else {
                                        record.remove();
                                        store.load();
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'treecolumn',
                        text: i18n.getKey('attribute'),
                        flex: 1,
                        dataIndex: 'skuAttributeId',
                        renderer: function (value, metadata, record) {
                            return record.get('attributeName') + '（' + value + '）';
                        }
                    },
                    {
                        text: i18n.getKey('options'),
                        flex: 1,
                        lockable: true,
                        iconCls: 'hidden',
                        xtype: 'treecolumn',
                        dataIndex: 'optionId',
                        renderer: function (value, metadata, record) {
                            return record.get('optionName') + '（' + value + '）';
                        }
                    }
                ]
            }
        ];
        me.callParent();
    }
})
