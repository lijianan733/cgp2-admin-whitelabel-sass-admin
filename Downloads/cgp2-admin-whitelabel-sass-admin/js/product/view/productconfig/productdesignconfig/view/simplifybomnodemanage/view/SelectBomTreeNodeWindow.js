Ext.define("CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.view.SelectBomTreeNodeWindow", {
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    createOrEdit: null,
    simplifyNodesMaterial: null,//已经添加的物料数组，在新建节点时,过滤已经添加的节点
    initComponent: function () {
        var me = this;
        me.nodeType = {
            'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem': 'bomItem',
            'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem': 'bomItem',
            'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem': 'bomitem'

        }
        me.simplifyNodesMaterial = me.simplifyNodesMaterial || [];
        me.title = (me.createOrEdit == 'edit' ? i18n.getKey('check') : i18n.getKey('choice')) + i18n.getKey('material');
        var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.store.BomTree', {
            root: me.root
        });
        store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                var type = item.get('type');
                if (type == 'MaterialType') {
                    item.set('icon', '../simplifybomnodemanage/T.png');
                } else if (type == 'MaterialSpu') {
                    item.set('icon', '../simplifybomnodemanage/S.png');
                } else {
                    item.set('icon', '../simplifybomnodemanage/B.png');
                }
            });
            Ext.each(records, function (item) {
                if ('root' != item.data._id) {
                    item.setId(item.data.parentId + '-' + item.data._id);
                    item.commit();
                }
            });
        });
        var bomTree = Ext.create('Ext.tree.Panel', {
            width: 450,
            height: 400,
            store: store,
            collapsible: true,
            header: false,
            useArrows: true,
            rootVisible: me.createOrEdit == 'edit' ? true : false,
            config: {
                viewConfig: {
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
            tbar: [
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
                }
            ],
            listeners: {
                beforeselect: function (selectModel, record, index) {
                    var window = selectModel.view.ownerCt.ownerCt;
                    var currentPathArr = record.get('_id').split('-');
                    currentPathArr.splice(0,1);
                    var currentPath = currentPathArr.join(',');
                    var nodeType = me.nodeType[record.get('clazz')];
                    if (Ext.Array.contains(window.simplifyNodesMaterial, currentPath) && nodeType != 'bomItem') {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('该节点已添加'));
                        return false;
                    } else {
                        return true;
                    }
                },
                beforeload: function (sto, operation, e) {
                    var type = operation.node.get('type');
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
                },
                afterrender: function (comp) {
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
            columns: [
                {
                    xtype: 'treecolumn',
                    text: i18n.getKey('name'),
                    flex: 1,
                    dataIndex: 'name',
                    renderer: function (value, metadata, record) {
                        var currentPathArr = record.get('_id').split('-');
                        currentPathArr.splice(0,1);
                        var currentPath = currentPathArr.join(',');
                        var nodeType = me.nodeType[record.get('clazz')];
                        if (Ext.Array.contains(me.simplifyNodesMaterial, currentPath) && nodeType != 'bomItem') {
                            metadata.tdCls = 'tdCls'
                        }
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
                }
            ]
        });
        me.items = [bomTree];
        me.callParent(arguments);
    }
});
