Ext.Loader.syncRequire(['CGP.material.override.NodeInterface', 'CGP.material.override.Model', 'CGP.material.override.TreeStore']);
//令人迷惑的代码，这里重选的物料居然是继承下来的bomItem关联物料的子物料，但是固定件不是不能选SMT
Ext.define('CGP.material.view.information.views.anewRelatedMaterial', {
    extend: 'Ext.window.Window',
    modal: true,
    width: 550,
    height: 150,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.material.controller.Controller');
        me.title = i18n.getKey('deployFixed');
        var rootNode = {};
        var store;
        var materialId = me.record.get('itemMaterial')._id;//关联物料id
        me.newId = JSGetCommonKey();
        Ext.Array.each(me.parentData.childItems, function (item) {
            if (item.name == me.record.get('name').split('_')[0]) {//这个是找出之前可选件关联的物料
                rootNode = item.itemMaterial;
                store = Ext.create('Ext.ux.data.store.UxTreeStore', {
                    model: 'CGP.material.model.Material',
                    nodeParam: '_id',
                    pageSize: 25,
                    root: rootNode,
                    autoLoad: true,
                    proxy: {
                        type: 'treerest',
                        url: adminPath + 'api/materials/{_id}/childNodes',
                        headers: {
                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                        },
                        reader: {
                            type: 'json',
                            root: 'data'
                        },
                        extraParams: {
                            filter: '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                        }
                    }
                });
            }
        });
        me.items = [
            {
                xtype: 'form',
                border: false,
                padding: '10 10 0 10',
                items: [
                    {
                        name: 'displayMaterial',
                        xtype: 'uxtreecombohaspaging',
                        fieldLabel: i18n.getKey('itemMaterial'),
                        itemId: 'displayMaterial',
                        store: store,
                        displayField: 'name',
                        valueField: '_id',
                        width: 450,
                        allowBlank: false,
                        treeWidth: 450,
                        selType: 'rowmodel',
                        editable: false,
                        haveReset: true,
                        infoUrl: adminPath + 'api/materials/{id}',
                        defaultColumnConfig: {
                            afterrender: function (treePanel) {
                                me.tbar = treePanel.getDockedItems('toolbar[dock="top"]')[0];
                                for (var i = 0; i < me.tbar.items.items.length; i++) {
                                    me.tbar.items.items[i].hide();
                                }
                                me.tbar.add({
                                    xtype: 'button',
                                    text: i18n.getKey('expandAll'),
                                    iconCls: 'icon_expandAll',
                                    width: 100,
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
                                })
                            },
                            renderer: function (value, metadata, record) {
                                return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                            }
                        },
                        showSelectColumns: [
                            {
                                dataIndex: '_id',
                                flex: 1,
                                text: i18n.getKey('id')
                            },
                            {
                                dataIndex: 'name',
                                text: i18n.getKey('name'),
                                flex: 2
                            }
                        ],
                        reset: function () {
                            this.value = undefined;
                            this.setRawValue('');
                            this.ids = [];
                            this.selectedRecords = [];
                            this.recordPath = {};
                            this.displayStr = [];
                            var picker = this.picker;
                            if (picker) {
                                var checkArr = picker.getChecked();
                                Ext.Array.each(checkArr, function (item) {
                                    if (me.multiselect) {
                                        item.set('checked', false);
                                    }
                                });
                                var selectionModel = picker.getSelectionModel();
                                if (selectionModel) {
                                    selectionModel.deselectAll();
                                }
                                if (picker.rendered == false) {
                                    //未进行渲染
                                } else {
                                    //已经渲染完成
                                    picker.toFront();
                                }
                            }
                            var treeStore = this.getStore();
                            treeStore.clearFilter();
                            treeStore.root = {
                                _id: me.rootNode,
                                name: ''
                            };
                            treeStore.proxy.url = adminPath + 'api/materials/' + me.record.get('itemMaterial')._id + '/childNodes';
                            var node = new (treeStore.model)({'_id': me.record.get('itemMaterial')._id});
                            node.store = treeStore;
                            treeStore.proxy.extraParams = {
                                'filter': '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                            };
                            treeStore.setRootNode(node);
                            treeStore.load({
                                start: 0,
                                page: 1,
                                limit: 1000,
                                node: node
                            });
                            this.fireEvent('change', this, this.getValue());
                        },
                        extraColumn: [
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
                        ],
                        rootVisible: true,
                        //selectChildren: false,
                        canSelectFolders: true,
                        // value: me.record.get('itemMaterial').type == 'MaterialType' ? '' : me.record.get('itemMaterial').id,
                        multiselect: false,
                        extraListeners: {
                            beforeselect: function (view, record) {
                                if (record.get('type') == 'MaterialType') {
                                    Ext.Msg.alert('提示', '请选择类型为SMU的物料!');
                                    return false;
                                }
                            }/*,
                             expand: function(){
                             store.clearFilter();
                             store.filter('type', 'MaterialSpu', true, false, true);
                             }*/
                        },
                        listeners: {
                            /* //展开时显示选中状态
                             expand: function (field) {
                             var recursiveRecords = [];

                             function recursivePush(node, setIds) {
                             addRecRecord(node);
                             node.eachChild(function (nodesingle) {
                             if (nodesingle.hasChildNodes() == true) {
                             recursivePush(nodesingle, setIds);
                             } else {
                             addRecRecord(nodesingle);
                             }
                             });
                             };
                             function addRecRecord(record) {
                             for (var i = 0, j = recursiveRecords.length; i < j; i++) {
                             var item = recursiveRecords[i];
                             if (item) {
                             if (item.getId() == record.getId()) return;
                             }
                             }
                             if (record.getId() <= 0) return;
                             recursiveRecords.push(record);
                             };
                             var node = field.tree.getRootNode();
                             recursivePush(node, false);
                             Ext.each(recursiveRecords, function (record) {
                             var id = record.get(field.valueField);
                             if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
                             field.tree.getSelectionModel().select(record);
                             }
                             });
                             },*/
                            afterrender: function (comp) {
                                if (me.record.get('itemMaterial').type == 'MaterialType') {

                                } else {
                                    comp.setInitialValue([me.record.get('itemMaterial')._id]);
                                }
                            }
                        }
                    }
                ]
            }
        ];
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('confirm'),
            handler: function (comp) {
                var form = me.down('form');
                if (form.isValid()) {
                    var newRecord = me.record.data;
                    var sourceBomItemId = me.record.get('_id');
                    var itemMaterial = {};
                    var id = form.getComponent('displayMaterial').getValue();
                    var name = form.getComponent('displayMaterial').getRawValue();
                    newRecord.itemMaterial = itemMaterial;
                    Ext.Object.each(me.record.data, function (key, value) {
                        if (key == 'itemMaterial') {
                            me.record.set(key, {name: name, _id: id, idReference: "Material", clazz: 'com.qpp.cgp.domain.bom.MaterialSpu'})
                        } else if(key == '_id'){
                            me.record.set('_id',me.newId);
                        }else if(key == 'sourceBomItemId'){
                            me.record.set('sourceBomItemId',sourceBomItemId);
                        }
                        else {
                            me.record.set(key, value)
                        }
                    });
                    me.close();
                }
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function (comp) {
                comp.ownerCt.ownerCt.close();
            }
        }];
        me.callParent(arguments);
    }

});
