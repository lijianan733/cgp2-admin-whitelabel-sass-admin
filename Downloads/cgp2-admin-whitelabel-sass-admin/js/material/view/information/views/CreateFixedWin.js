Ext.define('CGP.material.view.information.views.CreateFixedWin', {
    extend: 'Ext.window.Window',
    modal: true,
    width: 550,
    //height: 150,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.material.controller.Controller');
        me.title = i18n.getKey('deployFixed');
        var materialArray = me.record.get('optionalMaterials') ? me.record.get('optionalMaterials') : [];
        materialArray.push(me.record.get('itemMaterial'));
        var materialArrayId = [];
        for (var i = 0; i < materialArray.length; i++) {
            materialArrayId.push(materialArray[i]._id);
        }
        var store = Ext.create('Ext.ux.data.store.UxTreeStore', {
            root: 'root',
            model: 'CGP.material.model.Material',
            nodeParam: '_id',
            proxy: {
                type: 'uxmixtreerest',
                url: adminPath + "api/materials/treeNodes",
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                reader: {
                    type: 'json',
                    root: 'data'
                },
                anotherUrl: adminPath + 'api/materials/{id}/childNodes',
                extraParams: {
                    filter: Ext.JSON.encode([
                        {
                            name: 'includeIds',
                            type: 'string',
                            value: materialArrayId
                        }
                    ])
                },
                anotherFilter: {
                    filter: Ext.JSON.encode([
                        {
                            name: 'clazz',
                            type: 'string',
                            value: 'com.qpp.cgp.domain.bom.MaterialSpu'
                        }
                    ])
                }
            }
        });
        var materialCombo = {
            xtype: 'materialselectfield',
            fieldLabel: i18n.getKey('itemMaterial'),
            name: 'displayMaterial',
            itemId: 'displayMaterial',
            store: store,
            vtype: 'onlySMU',
            isHiddenRequestParamName: true,
            allowBlank: false,
            margin: '10 25 5 25',
            extraListeners: {
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
            },
            rootVisible: false,
            listeners: {
                //展开时显示选中状态
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
                },
                afterrender: function (comp) {
                    //comp.tree.expandAll();
                }
            }
        };
        me.items = [
            {
                xtype: 'form',
                border: false,
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'
                },
                listeners: {
                    beforerender: function (form) {
                        for (var i = 0; i < me.fixedCount; i++) {
                            var materialTreeCombo = new Object(materialCombo);
                            materialTreeCombo.itemId = 'itemMaterial' + (i + 1);
                            materialTreeCombo.name = 'itemMaterial' + (i + 1);
                            materialTreeCombo.fieldLabel = i18n.getKey('itemMaterial') + ' ' + (i + 1);
                            form.add(materialTreeCombo);
                        }
                    }
                },
                items: []
            }
        ];
        me.listeners = {
            close: function () {
                me.numberWin.close();
            }
        };
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('lastStep'),
            handler: function (comp) {
                me.destroy();
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('confirm'),
            handler: function (comp) {
                var form = me.down('form');
                if (form.isValid()) {
                    me.store.remove(me.record);
                    var newRecord = new Object(me.record.data);
                    newRecord.sourceBomItemId = me.record.getId();
                    var name = me.record.data.name;
                    var gridStore;
                    delete newRecord.optionalMaterials;
                    delete newRecord.min;
                    delete newRecord.max;
                    delete newRecord.range;
                    newRecord.clazz = 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem';
                    var FixedBOMItemGridStore = Ext.data.StoreManager.getByKey('FixedBOMItemGridStore');
                    if (Ext.isEmpty(FixedBOMItemGridStore)) {
                        gridStore = me.store;
                    } else {
                        gridStore = FixedBOMItemGridStore;
                    }
                    if (me.fixedCount == 0) {
                        me.close();
                        return;
                    }
                    for (var i = 0; i < me.fixedCount; i++) {
                        (function (j) {
                            /*newRecord.name = name+'_'+(j+1);
                             newRecord.clazz = 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem';
                             var compon = form.getComponent('itemMaterial'+(j+1));*/
                            var mask = me.setLoading('正在生成固定件，请等待！');
                            Ext.Ajax.request({
                                url: adminPath + 'common/key',
                                method: 'GET',
                                async: false,
                                success: function (res) {
                                    var responseMessage = Ext.JSON.decode(res.responseText);
                                    if (!responseMessage.success) {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                        return;
                                    }
                                    var bomItemId = responseMessage.data;
                                    var bomItemIdStr = bomItemId.toString();
                                    newRecord.name = name + '_' + (j + 1);
                                    newRecord.clazz = 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem';
                                    var compon = form.getComponent('itemMaterial' + (j + 1));
                                    newRecord.itemMaterial = {
                                        _id: compon.getValue(),
                                        clazz: domainObj.MaterialSpu,
                                        idReference: 'Material'
                                    };
                                    newRecord._id = bomItemIdStr;
                                    gridStore.add(newRecord);
                                    if (j == me.fixedCount - 1) {
                                        mask.hide();
                                        me.close();
                                    }
                                },
                                failure: function (resp) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            });
                        })(i);
                    }
                    //me.close();
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
