/**
 * Created by nan on 2020/3/26.
 */
Ext.syncRequire(['CGP.material.model.Material', 'CGP.material.override.Filter', 'CGP.product.edit.model.Attribute']);
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.LeftBomTree", {
    extend: "Ext.tree.Panel",
    mixins: {
        Filter: 'CGP.material.override.Filter'
    },
    width: 410,
    autoScroll: true,
    collapsible: true,
    region: 'west',
    header: false,
    split: true,
    config: {
        rootVisible: true,
        useArrows: true,
        viewConfig: {
            loadMask: true,
            markDirty: false,
            stripeRows: true,
            forceFit: true, // 注意不要用autoFill:true,那样设置的话当GridPanel的大小变化（比如你resize了它）时不会自动调整column的宽度
            scrollOffset: 0 //不加这个的话，会在grid的最右边有个空白，留作滚动条的位置
        }
    },
    children: null,
    itemId: 'bomTree',
    id: 'leftBomTree',
    selModel: {
        selType: 'rowmodel'
    },
    currentDepth: 0,//记录当前树的深度
    MMTDetail: null,
    selectedMappingId: null,//记录选择了UBI下物理选了哪个mapping
    attributePath: null,//指定显示该配置的属性映射配置中的哪个记录
    productConfigDesignId: null,
    initComponent: function () {
        var me = this;
        var name = me.MMTDetail.name;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller');
        var materialId = me.MMTDetail._id;
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var isLock = builderConfigTab.isLock;
        var type = me.MMTDetail.clazz == 'com.qpp.cgp.domain.bom.MaterialType' ? 'MaterialType' : 'MaterialSpu';
        var store = Ext.create('CGP.material.store.BomTree', {
            root: {
                _id: materialId,
                name: name,
                type: type,
                icon: type == 'MaterialSpu' ? path + 'partials/material/S.png' : path + 'partials/material/T.png'
            }
        });
        me.store = store;
        store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                var type = item.get('type');
                if (type == 'MaterialType') {
                    item.set('icon', path + 'partials/material/T.png');
                } else if (type == 'MaterialSpu') {
                    item.set('icon', path + 'partials/material/S.png');
                } else {
                    item.set('icon', path + 'partials/material/B.png');
                }
            });
            Ext.each(records, function (item) {
                if ('root' != item.data._id) {
                    item.setId(item.data.parentId + '-' + item.data._id);
                    item.commit();
                }
            });
        });
        me.tbar = {
            defaults: {
                width: 80
            },
            items: [
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
                /*  {
                      xtype: 'button',
                      text: i18n.getKey('展开') + i18n.getKey('指定节点'),
                      handler: function (btn) {
                          var treepanel = btn.ownerCt.ownerCt;
                          var selectNode = treepanel.getSelectionModel().getSelection()[0];
                          if (selectNode) {
                              Ext.suspendLayouts();
                              selectNode.expand(true);
                              Ext.resumeLayouts(true);

                          }
                      }
                  },
                  {
                      xtype: 'button',
                      text: i18n.getKey('收起') + i18n.getKey('指定节点'),
                      handler: function (btn) {
                          var treepanel = btn.ownerCt.ownerCt;
                          var selectNode = treepanel.getSelectionModel().getSelection()[0];
                          if (selectNode) {
                              Ext.suspendLayouts();
                              selectNode.collapse(true);
                              Ext.resumeLayouts(true);
                          }
                      }
                  }*/
                {
                    xtype: 'button',
                    text: i18n.getKey('展开') + i18n.getKey('下一层'),
                    handler: function (btn) {
                        var treepanel = btn.ownerCt.ownerCt;
                        var rootNode = treepanel.getRootNode();
                        var nodes = [];
                        rootNode.cascadeBy(function (node) {//遍历节点
                            if (node.isRoot() == true) {
                                if (node.isExpanded() == false && node.isLeaf() == false) {//未张开的根
                                    nodes.push(node);
                                }
                            } else {
                                if (node.isExpanded() == false && node.isLeaf() == false && node.parentNode.isExpanded() == true) {//未张开的节点
                                    nodes.push(node);
                                }
                            }

                        });
                        nodes.forEach(function (node) {
                            node.expand()
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('收起') + i18n.getKey('一层'),
                    handler: function (btn) {
                        var treePanel = btn.ownerCt.ownerCt;
                        var rootNode = treePanel.getRootNode();
                        var maxDepth = 0;
                        rootNode.cascadeBy(function (node) {
                            if (node.isRoot() == true) {

                            } else {
                                if (node.parentNode.isExpanded() == true && node.getDepth() > maxDepth) {
                                    maxDepth = node.getDepth();
                                }
                            }

                        })
                        rootNode.cascadeBy(function (node) {
                            if ((node.isExpanded() == true && node.isLeaf() == false) && node.getDepth() == (maxDepth - 1)) {
                                node.collapse();
                            }
                        })
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('test'),
                    menu: {
                        items: [
                            {
                                text: i18n.getKey('create') + i18n.getKey('test'),
                                disabled: isLock,
                                handler: function (btn) {
                                    var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.CreateMappingTestDataWindow', {
                                        productConfigDesignId: me.productConfigDesignId,
                                        configType: me.configType
                                    });
                                    win.show();
                                }
                            }, {
                                text: i18n.getKey('check') + i18n.getKey('test') + i18n.getKey('history'),
                                handler: function (btn) {
                                    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                                    var productId = JSGetQueryString('productId');
                                    var productConfigDesignId = JSGetQueryString('productConfigDesignId');
                                    var MMTId = JSGetQueryString('MMTId');
                                    builderConfigTab.managerMaterialMappingConfigV3TestHistory(productConfigDesignId, productId, MMTId, [], me.configType);
                                }
                            }]
                    }

                }
            ]
        };
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                dataIndex: 'name',
                flex: 1,
                //locked: true,
                renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                    var id = record.get('_id').split('-').pop();
                    var productConfigDesignId = gridView.ownerCt.productConfigDesignId;
                    var type;
                    if (record.get('type') == 'MaterialSpu') {
                        type = '<font color="#a9a9a9">(' + i18n.getKey('SMU') + ')</font>';
                    } else if (record.get('type') == 'MaterialType') {
                        type = '<font color="green">(' + i18n.getKey('SMT') + ')</font>';
                    }
                    if (Ext.isEmpty(record.get('type')) && !record.isRoot()) {
                        type = '';
                        if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem') {
                            return record.get("name") + '<' + id + '>' + '<font color="#a9a9a9">(' + i18n.getKey('FixedBOMItem') + ')</font>' + type;
                        } else if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') {
                            return record.get("name") + '<' + id + '>' + '<font color="#a9a9a9">(' + i18n.getKey('OptionalBomItem') + ')</font>' + type;
                        } else if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                            return record.get("name") + '<' + id + '>' + '<font color="#a9a9a9">(' + i18n.getKey('UnassignBOMItem') + ')</font>' + type;
                        }
                    } else if (!Ext.isEmpty(record.get('type')) || record.isRoot()) {
                        return record.get("name") + '<' + id + '>' + type;
                    }
                }
            },
            {
                text: i18n.getKey('状态'),
                width: 100,
                renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                    var type = '';
                    var productConfigDesignId = gridView.ownerCt.productConfigDesignId;
                    if (record.get('type') == 'MaterialType') {
                        var materialPath = record.get('_id').replace(/-/g, ',');
                        var result = controller.getMaterialMappingDTOConfig(materialPath, productConfigDesignId, false, me.configType);
                        record.raw.bomItemMappingIds = [];
                        if (result.length > 0) {
                            for (var j = 0; j < result.length; j++) {
                                for (var i = 0; i < result[j].bomItemMappings.length; i++) {
                                    record.raw.bomItemMappingIds.push(result[0].bomItemMappings[i].sourceBOMItemId);
                                }
                            }
                            record.raw.state = 'configured';
                            type += ' <img  style="width: 16px;height: 16px;vertical-align: middle;" src=' + path + 'ClientLibs/extjs/resources/themes/images/shared/32_32/accept.png>';
                        } else {
                            type += ' <img  style="width: 16px;height: 16px;vertical-align: middle;" src=' + path + 'ClientLibs/extjs/resources/themes/images/shared/32_32/cog_add.png>';
                            record.raw.state = 'unConfigured';
                        }
                    }
                    if (Ext.isEmpty(record.get('type')) && !record.isRoot() && record.parentNode.get('type') == 'MaterialType') {//这是bomItem，且必须是smt物料下的
                        var bomItemMappingIds = record.parentNode.raw.bomItemMappingIds;
                        if (bomItemMappingIds && bomItemMappingIds.length > 0 && Ext.Array.contains(bomItemMappingIds, record.get('id'))) {
                            type += ' <img  style="width: 16px;height: 16px;vertical-align: middle;" src=' + path + 'ClientLibs/extjs/resources/themes/images/shared/32_32/accept.png>';
                            record.raw.state = 'configured';
                        } else {
                            type += ' <img  style="width: 16px;height: 16px;vertical-align: middle;" src=' + path + 'ClientLibs/extjs/resources/themes/images/shared/32_32/cog_add.png>';
                            record.raw.state = 'unConfigured';
                        }
                    }
                    return type;
                }
            }
        ];
        me.listeners = {
            beforeselect: function (rowModel, record) {
                var leftBomTree = rowModel.view.ownerCt;
                var outCenterPanel = leftBomTree.ownerCt.getComponent('outCenterPanel');
                var centerContainer = outCenterPanel.getComponent('centerContainer');
                if (centerContainer && centerContainer.isDirty == true) {
                    var saveBtn = centerContainer.getDockedItems('toolbar[dock="top"]')[0].getComponent('saveBtn');
                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否保存当前的修改?'), function (selector) {
                        if (selector == 'yes') {
                            saveBtn.handler(saveBtn);
                            rowModel.select(record);

                        } else {
                            centerContainer.isDirty = false;
                        }
                    })
                    return false;
                } else {
                    return true;
                }

            },
            select: function (rowModel, record) {
                var leftBomTree = rowModel.view.ownerCt;
                var outCenterPanel = leftBomTree.ownerCt.getComponent('outCenterPanel');
                var centerPanel = outCenterPanel.getComponent('centerContainer');
                var type = record.get('type');
                if (type == 'MaterialType') {
                    var MMTDetail = controller.getSMTDetail(record.get('id'));
                    var materialPath = record.get('_id').replace(/-/g, ',');
                    var isMultiMappings = false;
                    //待定件有多个映射规则
                    if (record.parentNode && record.parentNode.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                        isMultiMappings = true;
                    }
                    /*
                                        if (record.get('id') != centerPanel.materialId) {//当前详情就是该bomITem的所属物料
                    */
                    outCenterPanel.refreshData(materialPath, MMTDetail, isMultiMappings);
                    /* } else {
                         centerPanel.fireEvent('completeRefreshData', centerPanel);
                     }*/
                } else {
                    if ((record.raw.clazz == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem' ||
                        record.raw.clazz == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem' ||
                        record.raw.clazz == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') && record.parentNode.get('type') == 'MaterialType') {
                        var parentNode = record.parentNode;
                        if (record.raw.state == 'configured') {//已配置了
                            if (record.parentNode.get('id') == centerPanel.materialId) {//当前详情就是该bomITem的所属物料
                                var materialBomMapping = centerPanel.getComponent('materialBomMapping');
                                var MMTDetail = controller.getSMTDetail(parentNode.get('id'));
                                var materialPath = parentNode.get('_id').replace(/-/g, ',');
                                var bomItemConfigFieldset = materialBomMapping.getFieldSetByBomItemId(record.get('id'));
                                var manageMaterialMappingLeftGrid = outCenterPanel.getComponent('manageMaterialMappingLeftGrid')
                                if (bomItemConfigFieldset) {
                                    centerPanel.setActiveTab(materialBomMapping);
                                    bomItemConfigFieldset.expand();
                                } else {
                                    centerPanel.fireEvent('completeRefreshData', centerPanel);
                                }
                                if (manageMaterialMappingLeftGrid.hidden == false && leftBomTree.selectedMappingId) {
                                    manageMaterialMappingLeftGrid.refreshData(materialPath, MMTDetail);
                                }

                            } else {//当前详情非该bomItem的所属物料
                                var MMTDetail = controller.getSMTDetail(parentNode.get('id'));
                                var materialPath = parentNode.get('_id').replace(/-/g, ',');
                                var isMultiMappings = false;
                                if (parentNode.parentNode && parentNode.parentNode.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                                    isMultiMappings = true;
                                }
                                outCenterPanel.refreshData(materialPath, MMTDetail, isMultiMappings);
                            }
                        } else {
                            var MMTDetail = controller.getSMTDetail(parentNode.get('id'));
                            var materialPath = parentNode.get('_id').replace(/-/g, ',');
                            var materialBomMapping = centerPanel.getComponent('materialBomMapping');
                            var isMultiMappings = false;
                            if (parentNode.parentNode && parentNode.parentNode.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                                isMultiMappings = true;
                            }
                            outCenterPanel.refreshData(materialPath, MMTDetail, isMultiMappings);
                        }
                    } else {

                        outCenterPanel.refreshData();
                    }
                }
            },
            itemexpand: function (node) {
                //更改当前节点下的所有子节点的图标
                if (node.getDepth() > me.currentDepth) {
                    me.currentDepth = node.getDepth();
                }
                if (me.currentDepth >= 4) {
                    me.getView().getGridColumns()[0].setWidth(340 + me.currentDepth * 20);
                }
                for (var i = 0, len = node.childNodes.length; i < len; i++) {
                    var curChild = node.childNodes[i];
                    var type = curChild.get('type');
                    var isLeaf = curChild.get('isLeaf');
                    if (type == 'MaterialType') {
                        curChild.set('icon', path + 'partials/material/T.png');
                    } else if (type == 'MaterialSpu') {
                        curChild.set('icon', path + 'partials/material/S.png');
                    } else {
                        curChild.set('icon', path + 'partials/material/B.png');
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
                    sto.proxy.url = adminPath + 'api/materials/bomTree/{id}/children?type=material';
                }
            }
        };
        me.callParent(arguments);

    }
});
