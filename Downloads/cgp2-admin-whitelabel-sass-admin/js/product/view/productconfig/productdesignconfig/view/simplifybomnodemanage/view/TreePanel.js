/**
 * Created by nan on 2019/7/10.
 */

Ext.define("CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.view.TreePanel", {
    extend: "Ext.tree.Panel",
    width: 350,
    collapsible: true,
    region: 'west',
    header: false,
    rootVisible: false,
    viewConfig: {
        enableTextSelection: true,
        stripeRows: true
    },
    autoScroll: true,
    itemId: 'treePanel',
    selModel: {
        selType: 'rowmodel'
    },
    simplifyNodesMaterial: [],//一个记录的已经添加的物料
    categoryEventMenu: function (view, record, e) {
        var me = this;
        var tree = view.ownerCt;
        e.stopEvent();
        var menu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: i18n.getKey('add') + i18n.getKey('子节点'),
                    itemId: 'add',
                    handler: function () {
                        me.controller.addNewSimplifyBomNode(tree, record);
                    }
                },
                {
                    text: i18n.getKey('delete') + i18n.getKey('该节点'),
                    hidden: record.parentNode.isRoot()||!record.get('leaf'),//
                    handler: function () {
                        me.controller.deleteSimplifyBomNode(tree, record)
                    }
                }
            ]
        });
        menu.showAt(e.getXY());
    },
    productConfigDesignId: null,//关联的产品design配置编号
    initComponent: function () {
        var me = this;
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var isLock = builderConfigTab.isLock;
        var controller = me.controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.controller.Controller');
        var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.store.SimplifyBomNodeTreeStore', {
            productConfigDesignId: me.productConfigDesignId,
            root: 'root'//root表示要查询哪个节点下的数据
        });
        store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                var materialId = item.get('sbomPath').split(',').pop();
                me.simplifyNodesMaterial.push(item.get('sbomPath'));
                item.set('icon', '../simplifybomnodemanage/category.png');
                if ('root' != item.data._id) {
                    var parentNode = item.parentNode;
                    if (parentNode.getId() == 'root') {
                        item.set('materialPath', item.get('sbomPath'));
                    } else {
                        item.set('materialPath', parentNode.get('materialPath') + ',' + item.get('sbomPath'));
                    }
                    item.commit();
                }
            });
        });
        me.store = store;
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('expandAll'),
                iconCls: 'icon_expandAll',
                count: 0,
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
                xtype: 'button',
                text: i18n.getKey('查看结构图'),
                iconCls: 'icon_check',
                handler: function (btn) {
                    btn.up('viewport').el.mask('加载中...');
                    setTimeout(function () {
                        var win = Ext.create('CGP.common.commoncomp.CheckMaterialBomPictureWindow', {
                            imgSeverUrl: adminPath + 'api/simplifyMaterialViewTypeDiagrams/' + me.productConfigDesignId
                        });
                        btn.up('viewport').el.unmask();
                        win.show();
                    }, 100);
                }
            }
        ];
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('simplifyBomNode'),
                flex: 1,
                dataIndex: '_id',
                renderer: function (value, metadata, record) {
                    var isContainSimplifyMaterialViewType = record.get('isContainSimplifyMaterialViewType');
                    var type = '';
                    if (isContainSimplifyMaterialViewType) {
                        type += ' <img  style="width: 16px;height: 16px;vertical-align: middle;" src=' + path + 'ClientLibs/extjs/resources/themes/images/shared/32_32/accept.png>';
                    } else {
                        type += ' <img  style="width: 16px;height: 16px;vertical-align: middle;" src=' + path + 'ClientLibs/extjs/resources/themes/images/shared/32_32/cog_add.png>';
                    }
                    var result = record.get('description') + '(' + value + ')' + type;
                    return result
                }
            }
        ];
        me.listeners = {
            select: function (rowModel, record) {
                var infoTabPanel = rowModel.view.ownerCt.ownerCt.getComponent('infoTab');
                infoTabPanel.refreshData(record);
            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                var tree = view.ownerCt;
                if (isLock) {

                } else {
                    tree.categoryEventMenu(view, record, e);
                }
            },
            afterrender: function (treePanel) {
                treePanel.expandAll();
            }
        };
        me.callParent(arguments);

    }
});
