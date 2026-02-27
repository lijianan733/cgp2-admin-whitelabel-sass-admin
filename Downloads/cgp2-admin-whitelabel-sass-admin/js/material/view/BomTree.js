Ext.syncRequire(['CGP.material.model.Material', 'CGP.material.override.Filter']);
Ext.define("CGP.material.view.BomTree", {
    extend: "Ext.tree.Panel",
    mixins: {
        Filter: 'CGP.material.override.Filter'
    },
    width: 450,
    collapsible: true,
    region: 'west',
    header: false,
    config: {
        rootVisible: true,
        useArrows: true,
        viewConfig: {
            markDirty: false,
            enableTextSelection: true,
            stripeRows: true
        }
    },
    autoScroll: true,
    children: null,
    itemId: 'bomTree',
    selModel: {
        selType: 'rowmodel'
    },

    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.material.controller.Controller');
        var name = me.getQueryString('materialName');
        var materialId = me.getQueryString('materialId');
        var type = me.getQueryString('type');
        var leaf = me.getQueryString('leaf');
        var store = Ext.create('CGP.material.store.BomTree', {
            root: {
                _id: materialId,
                name: name,
                type: type,
                leaf: leaf,
                icon: type == 'MaterialSpu' ? '../material/S.png' : '../material/T.png'
            }/*,
             params: {
             type: 'material'
             }*/
        });
        me.store = store;
        //me.store.filter('type', 'MaterialSpu', true, false);
        store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                var type = item.get('type');
                if (type == 'MaterialType') {
                    item.set('icon', '../material/T.png');
                } else if (type == 'MaterialSpu') {
                    item.set('icon', '../material/S.png');
                } else {
                    item.set('icon', '../material/B.png');
                }
            });
            Ext.each(records, function (item) {
                if ('root' != item.data._id) {
                    item.setId(item.data.parentId + '-' + item.data._id);
                    item.commit();
                }
            });
        });
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
                text: i18n.getKey('查看物料结构图'),
                iconCls: 'icon_check',
                handler: function (btn) {
                    btn.up('viewport').el.mask('加载中...');
                    setTimeout(function () {
                        var win = Ext.create('CGP.common.commoncomp.CheckMaterialBomPictureWindow', {
                            materialId: materialId,
                            imgSeverUrl: adminPath + 'api/material/graphviz/' + materialId,
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
                text: i18n.getKey('name'),
                width: 350,
                dataIndex: 'name',
                //locked: true,
                renderer: function (value, metadata, record) {
                    var id = record.get('_id').split('-').pop();
                    if (Ext.isEmpty(record.get('type')) && !record.isRoot()) {
                        if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem') {
                            return record.get("name") + '(' + i18n.getKey('FixedBOMItem') + ')' + '<' + id + '>';
                        } else if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') {
                            return record.get("name") + '(' + i18n.getKey('OptionalBomItem') + ')' + '<' + id + '>';
                        } else if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                            return record.get("name") + '(' + i18n.getKey('UnassignBOMItem') + ')' + '<' + id + '>';
                        }
                    } else if (!Ext.isEmpty(record.get('type')) || record.isRoot()) {
                        return record.get("name") + '<' + id + '>';
                    }
                }
            },
            {
                text: i18n.getKey('type'),
                flex: 1,
                dataIndex: 'type',
                renderer: function (value) {
                    var type;
                    if (value == 'MaterialSpu') {
                        type = '<div style="color: green">' + i18n.getKey('SMU') + '</div>'
                    } else if (value == 'MaterialType') {
                        type = '<div style="color: blue">' + i18n.getKey('SMT') + '</div>'
                    }
                    return type;
                }

            }
        ];
        me.listeners = {
            select: function (rowModel, record) {
                var materialId = record.get('_id');
                var isLeaf = record.get('isLeaf');
                var parentId = record.get('parentId');
                var infoTab = rowModel.view.ownerCt.ownerCt.getComponent('infoTab');
                var treeStore = me.getStore();
                var clazz = record.get('clazz');
                var type = record.get('type');
                if (type == 'MaterialSpu' || type == 'MaterialType' || record.isRoot()) {
                    infoTab.getDockedItems('toolbar[dock="top"]')[0].show();
                    controller.refreshData(record, infoTab, isLeaf, parentId);
                } else {
                    infoTab.removeAll();
                    infoTab.getDockedItems('toolbar[dock="top"]')[0].hide();
                    infoTab.componentInit = false;
                }
            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                var centerPanel = view.ownerCt.ownerCt.getComponent('centerPanel');
                var parentId = record.get('parentId');
                var isLeaf = record.get('isLeaf');
                //controller.itemEventMenu(view, record, e, parentId, isLeaf);
            },
            itemexpand: function (node) {
                if (node.childNodes.length > 0) {//展开节点时，更改父节点图标样式
                    //node.getUI().getIconEl().src="../themes/images/default/editor/edit-word-text.png";
                }
                //更改当前节点下的所有子节点的图标
                for (var i = 0, len = node.childNodes.length; i < len; i++) {
                    var curChild = node.childNodes[i];
                    var type = curChild.get('type');
                    var isLeaf = curChild.get('isLeaf');
                    if (type == 'MaterialType') {
                        curChild.set('icon', '../material/T.png');
                    } else if (type == 'MaterialSpu') {
                        curChild.set('icon', '../material/S.png');
                    } else {
                        curChild.set('icon', '../material/B.png');
                    }
                }
            },
            beforeload: function (sto, operation, e) {
                var type = operation.node ? operation.node.get('type') : null;
                var clazz;
                if (operation.node.raw) {
                    clazz = operation.node.raw.clazz;
                }
                var parentNode = operation.node.parentNode;
                if (Ext.isEmpty(type) && !operation.node.isRoot()) {
                    var idRealArray = parentNode.get('_id').split('-');
                    var realId = idRealArray[idRealArray.length - 1];
                    sto.proxy.url = adminPath + 'api/materials/bomTree/{id}/children?type=bomitem&materialId=' + realId;
                    delete sto.proxy.extraParams;
                } else {
                    /*sto.proxy.extraParams = {
                     type: 'material'
                     };*/
                    sto.proxy.url = adminPath + 'api/materials/bomTree/{id}/children?type=material';
                }
            },
            afterrender: function () {
                /*
                 me.expandAll();
                 */
            }
        };
        me.callParent(arguments);

    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }
});
