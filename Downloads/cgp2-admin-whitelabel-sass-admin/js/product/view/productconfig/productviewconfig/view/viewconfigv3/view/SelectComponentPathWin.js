/**
 * Created by nan on 2021/7/16
 * 选择物料路径的弹窗
 */

Ext.define("CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.SelectComponentPathWin", {
    extend: 'Ext.window.Window',
    width: 450,
    modal: true,
    constrain: true,
    height: 500,
    layout: 'fit',
    centerBuilderViewConfigPanel: null,
    editViewTypeField: null,
    title: i18n.getKey('select') + i18n.getKey('path'),
    getTreeData: function (centerBuilderViewConfigPanel, editViewTypeField) {
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
        return data;
    },
    initComponent: function () {
        var me = this;
        var data = null;
        var centerBuilderViewConfigPanel = me.centerBuilderViewConfigPanel;
        var editViewTypeField = me.editViewTypeField;
        var treeData = me.getTreeData(centerBuilderViewConfigPanel, editViewTypeField);
        me.items = [
            {
                xtype: 'treepanel',
                rootVisible: false,
                itemId: 'tree',
                store: Ext.create('Ext.data.TreeStore', {
                    root: {
                        expanded: true,
                        children: treeData
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
            },
        ];
        me.bbar = ['->',
            {
                xtype: 'button',
                text: i18n.getKey('nextStep'),
                iconCls: 'icon_next_step',
                itemId: 'useOldBtn',
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
                            var pathStr = "$.areas[?(@.position.layoutPosition==\'" + area + "\')].components[?(@.name==\'" + component + "\')]";
                            var navigationTree = Ext.getCmp('navigationTree');
                            var nextWin = Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.managecomponent.ManageComponentInstanceWin', {
                                lastWin: win,
                                pathStr: pathStr,
                                navigationTree: navigationTree,
                                centerBuilderViewConfigPanel: centerBuilderViewConfigPanel,
                                optionalCmpTypeArr: [componentType],
                                componentInstanceArr: window.componentArr
                            });
                            nextWin.show();
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
            }];
        me.callParent();
    }

})