/**
 * Created by nan on 2020/5/21.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.SMUBomTree', {
    extend: "Ext.tree.Panel",
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
    isReadOnly: false,
    currentDepth: 0,//记录当前树的深度
    MMTDetail: null,
    recordId: null,
    initComponent: function () {
        var me = this;
        var name = me.MMTDetail.name;
        var recordId = me.recordId;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.controller.Controller');
        var materialId = me.MMTDetail._id;
        var type = me.MMTDetail.clazz == 'com.qpp.cgp.domain.bom.MaterialType' ? 'MaterialType' : 'MaterialSpu';
        var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.store.BomTree', {
            autoSync: false,
            root: {
                _id: materialId,
                name: name,
                type: type,
                isValid: false,
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
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                style: 'background-color:white;',
                color: 'black',
                bodyStyle: 'border-color:white;',
                border: '0 0 0 0',
                items: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('expandAll'),
                        iconCls: 'icon_expandAll',
                        count: 0,
                        margin: '0 0 0 10',
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
                        margin: '0 0 0 12',
                        xtype: 'displayfield',
                        labelStyle: 'font-weight: bold',
                        labelWidth: 100,
                        labelAlign: 'right',
                        width: 180,
                        itemId: 'executeExpect',
                        fieldLabel: '期望状态',
                        value: '<font color="red">' + i18n.getKey('待确认') + '</font>',
                    },
                    {
                        xtype: 'button',
                        margin: '0 0 0 10',
                        itemId: 'button',
                        hidden: me.isReadOnly,
                        iconCls: 'icon_edit',
                        text: i18n.getKey('校验期望'),
                        handler: function (btn) {
                            //校验是否所有的SMU都设置了状态
                            var toolbar = btn.ownerCt;
                            var executeExpect = toolbar.getComponent('executeExpect');
                            var bomTree = toolbar.ownerCt;
                            var rootNode = bomTree.getRootNode();
                            var uncertainStatus = 0;
                            var conformityStatus = 0;
                            var inconformityStatus = 0;
                            rootNode.cascadeBy(function (node) {
                                //是否所有的SMU都选定了期望
                                if (node.get('clazz') == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                                    if (node.get('status') == 'Uncertain') {
                                        uncertainStatus++;
                                    } else if (node.get('status') == 'Conformity') {
                                        conformityStatus++
                                    } else {
                                        inconformityStatus++;
                                    }
                                }
                            })
                            if (uncertainStatus > 0) {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请为所有的SMU选定是否符合期望'))
                            } else if (inconformityStatus > 0) {
                                //不符合期望
                                bomTree.el.mask();
                                setTimeout(function () {
                                    var result = controller.updateExecuteExpert('Inconformity', recordId);
                                    if (result == true) {
                                        executeExpect.setValue('<font color="red">' + i18n.getKey('不符合期望') + '</font>');
                                    }
                                    bomTree.el.unmask();
                                })
                            } else {
                                bomTree.el.mask();
                                setTimeout(function () {
                                    var result = controller.updateExecuteExpert('Conformity', recordId);
                                    executeExpect.setValue('<font color="green">' + i18n.getKey('符合期望') + '</font>');
                                    bomTree.el.unmask();
                                })
                            }
                        }
                    },
                ]

            }
        ];
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                dataIndex: 'name',
                flex: 1,
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                    var id = record.get('_id').split('-').pop();
                    var type;
                    if (record.get('type') == 'MaterialSpu') {
                        type = '<font color="green">(' + i18n.getKey('SMU') + ')</font>';
                    } else if (record.get('type') == 'MaterialType') {
                        type = '<font color="#a9a9a9">(' + i18n.getKey('SMT') + ')</font>';
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
                text: i18n.getKey('是否符合期望'),
                width: 100,
                hidden: me.isReadOnly,
                xtype: 'componentcolumn',
                dataIndex: 'status',
                renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                    console.log(record.getData());
                    if (record.get('type') == 'MaterialSpu') {
                        var id = JSGetUUID();
                        return {
                            xtype: 'radiogroup',
                            columns: 2,
                            vertical: true,
                            defaults: {
                                removeCls: function (cls) {
                                    var me = this,
                                        el = me.rendered ? me.el : me.protoEl;
                                    if (el && el.removeCls) {
                                        el.removeCls.apply(el, arguments);
                                    }
                                    return me;
                                },
                                addCls: function (cls) {
                                    var me = this,
                                        el = me.rendered ? me.el : me.protoEl;
                                    if (el && el.addCls) {
                                        el.addCls.apply(el, arguments);
                                    }
                                    return me;
                                },
                            },
                            items: [
                                {boxLabel: '是', name: id, inputValue: 'Conformity', checked: value == 'Conformity'},
                                {boxLabel: '否', name: id, inputValue: 'Inconformity', checked: value == 'Inconformity'},
                            ],
                            listeners: {
                                change: function (checkbox, newValue, oldValue) {
                                    record.set('status', Object.values(newValue)[0]);
                                    //校验是否所有的SMU都设置了状态
                                    var bomTree = gridView.ownerCt;
                                    var toolbar = bomTree.getDockedItems('toolbar[dock="top"]')[0];
                                    var executeExpect = toolbar.getComponent('executeExpect');
                                    var rootNode = bomTree.getRootNode();
                                    var uncertainStatus = 0;
                                    var conformityStatus = 0;
                                    var inconformityStatus = 0;
                                    if (rootNode.get('status') == 'Uncertain') {
                                        uncertainStatus++;
                                    } else if (rootNode.get('status') == 'Conformity') {
                                        conformityStatus++
                                    } else {
                                        inconformityStatus++;
                                    }
                                    rootNode.cascadeBy(function (node) {
                                        //是否所有的SMU都选定了期望
                                        if (node.get('clazz') == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                                            if (node.get('status') == 'Uncertain') {
                                                uncertainStatus++;
                                            } else if (node.get('status') == 'Conformity') {
                                                conformityStatus++
                                            } else {
                                                inconformityStatus++;
                                            }
                                        }
                                    })
                                    if (inconformityStatus > 0 && uncertainStatus == 0) {
                                        //不符合期望
                                        executeExpect.setValue('<font color="red">' + i18n.getKey('不符合期望') + '</font>');
                                    } else if (uncertainStatus == 0 && inconformityStatus == 0) {
                                        executeExpect.setValue('<font color="green">' + i18n.getKey('符合期望') + '</font>');
                                    }

                                },
                                afterrender: function () {
                                    //阻止事件传递到父组件上，使之不会触发gridPanel的itemSelect事件
                                    var father = this.ownerCt;
                                    this.el.on("mousedown", function (event, targetEl) {
                                        console.log("阻止冒泡");
                                        event.stopPropagation();
                                    });
                                }
                            }
                        }
                    } else {
                        return null;
                    }
                }
            }
        ];
        me.listeners = {
            beforeselect: function () {
               
            },
            select: function (rowModel, record) {
                var materialId = record.get('id');
                var parentId = record.get('parentId');
                var bomTree = rowModel.view.ownerCt;
                var infoTab = bomTree.ownerCt.getComponent('SMUInfoTab');
                var type = record.get('type');
                if (type == 'MaterialSpu' || type == 'MaterialType' || record.isRoot()) {
                    var MMDetail = controller.getMMDetail(materialId);
                    var isLeaf = MMDetail.leaf;
                    infoTab.bomTreeRecord = record;
                    infoTab.el.mask('加载中');
                    setTimeout(
                        function () {
                            infoTab.refreshData(MMDetail, isLeaf, parentId);
                            infoTab.el.unmask();
                        }, 100
                    )


                } else {
                    infoTab.removeAll();
                    infoTab.componentInit = false;
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
            },
            afterrender: function (bomTree) {
                bomTree.expandAll();
            }
        };
        me.callParent(arguments);

    }
})
