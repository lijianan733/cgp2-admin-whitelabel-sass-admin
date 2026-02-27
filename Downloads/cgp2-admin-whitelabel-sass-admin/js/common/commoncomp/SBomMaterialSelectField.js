/**
 * @Description:销售物料的路径选择器
 * @author nan
 * @date 2024/3/8
 */

Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.store.BomTree'
])
Ext.define('CGP.common.commoncomp.SBomMaterialSelectField', {
    extend: 'Ext.ux.TreeCombo',
    alias: 'widget.sbom_material_selectfield',
    displayField: '_id',
    valueField: '_id',
    haveReset: true,
    editable: false,
    multiselect: false,
    fieldLabel: '物料路径',
    root: null,
    rootMaterialId: null,
    setRootMaterialInfo: function (materialId) {
        var gridField = this;
        var tree = gridField.tree;
        var treeStore = tree.store;
        var url = adminPath + 'api/materials/' + materialId;
        JSAjaxRequest(url, 'GET', true, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var materialInfo = responseText.data;
                    var root = {
                        "_id": materialInfo._id,
                        "clazz": materialInfo.clazz,
                        "name": materialInfo.name,
                        materialInfo: materialInfo
                    };
                    treeStore.setRootNode(root);
                }
            }
        });
    },
    initComponent: function () {
        var me = this;
        me.root = me.root || {
            "_id": "xxxxxx",
            "clazz": "com.qpp.cgp.domain.bom.MaterialType",
            "name": "xxxxxxxxx",
        };
        //物料bom结构树
        me.store = Ext.create('CGP.product.view.productconfig.productdesignconfig.store.BomTree', {
            root: me.root,
            listeners: {
                load: function (store, node, records) {
                    Ext.each(records, function (item) {
                        if ('root' != item.data._id) {
                            item.set('_id', item.data.parentId + '-' + item.data._id);
                            item.commit();
                        }
                    });
                }
            }
        });
        me.treePanelConfig = {
            selType: 'rowmodel',
            width: 450,
            rootVisible: true,
            collapsible: true,
            header: false,
            autoScroll: true,
            children: null,
            itemId: 'bomTree',
            selModel: {
                selType: 'rowmodel'
            },
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('expandAll'),
                    iconCls: 'icon_expandAll',
                    width: 100,
                    count: 1,//更据treePanel的初始状态，设置为0，或1
                    handler: function (btn) {
                        var treepanel = btn.ownerCt.ownerCt;
                        JSSetLoading(true);
                        console.time('x');
                        Ext.suspendLayouts();//挂起布局
                        if (btn.count % 2 == 0) {
                            treepanel.collapseAll(true);
                            Ext.resumeLayouts(true);
                            btn.setText(i18n.getKey('expandAll'));
                            btn.setIconCls('icon_expandAll');
                        } else {
                            treepanel.expandAll();
                            Ext.resumeLayouts(true);
                            btn.setText(i18n.getKey('collapseAll'));
                            btn.setIconCls('icon_collapseAll');
                        }
                        btn.count++;
                        JSSetLoading(false);
                        console.timeEnd('x');
                    }
                }
            ],
            columns: [
                {
                    xtype: 'treecolumn',
                    text: i18n.getKey('name'),
                    flex: 1,
                    dataIndex: 'name',
                    renderer: function (value, metadata, record) {
                        var id = record.get('_id').split('-').pop();
                        if (Ext.isEmpty(record.get('type')) && !record.isRoot()) {
                            if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem') {
                                return record.get("name") + '<' + id + '>' + i18n.getKey('FixedBOMItem');
                            } else if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') {
                                return record.get("name") + '<' + id + '>' + i18n.getKey('OptionalBomItem');
                            } else if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                                return record.get("name") + '<' + id + '>' + i18n.getKey('UnassignBOMItem');
                            }
                        } else if (!Ext.isEmpty(record.get('type')) || record.isRoot()) {
                            return record.get("name") + '<' + id + '>';
                        }
                    }
                },
                {
                    text: i18n.getKey('name'),
                    width: 60,
                    dataIndex: 'name',
                    renderer: function (value, metadata, record) {
                        if (Ext.isEmpty(record.get('type')) && !record.isRoot()) {
                        } else if (!Ext.isEmpty(record.get('type')) || record.isRoot()) {
                            return (record.get('type') == 'MaterialType' ? '<font color="green">SMT</font>' : '<font color="red">SMU</font>');
                        }
                    }
                }
            ],
            listeners: {
                beforeload: function (sto, operation, e) {
                    var type = operation.node.get('type');
                    var parentNode = operation.node.parentNode;
                    if (Ext.isEmpty(type) && !operation.node.isRoot()) {
                        var idRealArray = parentNode.get('_id').split('-');
                        var realId = idRealArray.pop();//取最后一个
                        sto.proxy.url = adminPath + 'api/materials/bomTree/{id}/children' +
                            '?type=bomitem' +
                            '&materialId=' + realId;
                        delete sto.proxy.extraParams;
                    } else {
                        sto.proxy.url = adminPath + 'api/materials/bomTree/{id}/children?type=material';
                    }
                },
                afterrender: function (comp) {
                    var me = this;
                    if (!Ext.isEmpty(me.materialPath)) {
                        var pathArr = me.materialPath.split(',');
                        var path = '';
                        Ext.Array.each(pathArr, function (item) {
                            path += '/' + item;
                        });
                        comp.expandPath(path, 'pathID', '/', function callback() {
                            comp.selectPath(path, 'pathID');
                        });
                    }
                }
            },
        };
        me.callParent(arguments);
        if (me.rootMaterialId) {
            me.on('afterrender', function (item) {
                me.setRootMaterialInfo(me.rootMaterialId);
            });
        }
    }
})