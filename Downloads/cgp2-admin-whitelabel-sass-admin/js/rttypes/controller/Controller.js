Ext.define('CGP.rttypes.controller.Controller', {


    addSubRtType: function (tree) {
        this.rtType(null, tree);
    },

    rtType: function (parentNode, tree) {


        var miwindow = Ext.MessageBox.prompt(i18n.getKey('newRtType'), i18n.getKey('enterRtTypeName'), function (even, value) {
            if (even == "ok") {
                //var rootID =  tree.getRootNode().data.id;
                var defaultModel = {
                    name: value,
                    tags: null,
                    leaf: true,
                    attributesToRtTypes: [],
                    parentId: (parentNode == null) ? null : parentNode.get("_id"),
                    clazz: "com.qpp.cgp.domain.bom.attribute.RtType"
                };
                Ext.Ajax.request({
                    url: adminPath + 'api/rtTypes',
                    method: 'POST',
                    jsonData: defaultModel,
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (res) {
                        var responseMessage = Ext.JSON.decode(res.responseText);
                        if (responseMessage.success == true) {
                            var data = responseMessage.data;
                            var treeStore = tree.getStore();
                            treeStore.load({
                                node: (parentNode == null) ? tree.getRootNode() : parentNode,
                                callback: function (records) {
                                    var parentN = (parentNode == null) ? tree.getRootNode() : parentNode;
                                    parentN.set('leaf', false);
                                    parentN.expand();

                                    var newNode = treeStore.getNodeById(data['_id']);
                                    tree.getSelectionModel().select(newNode);
                                }
                            });
                        } else {
                            Ext.Msg.alert("提示", "请求错误:" + responseMessage.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
            }
        });


    },
    modifyRtAttributeWin: function (record) {

        Ext.create('CGP.rttypes.view.information.attribute.EditRtAttr', {
            record: record
        }).show();

    },
    modifyRtTypeAttr: function (value, record, win) {
        Ext.Object.each(value, function (key, value) {
            record.set(key, value);
        });
        win.close();
    },
    //在RtType下新建RtType
    addRtType: function (tree) {
        //var tree = this.getTree();
        var targetNode = tree.getSelectionModel().getSelection()[0];
        targetNode.set('leaf', false);
        targetNode.set('expanded', true);
        this.rtType(targetNode, tree);
    },
    deleteRtType: function (tree) {
        var targetNode = tree.getSelectionModel().getSelection()[0];
        var parentNode = targetNode.parentNode;
        var targetNodeId = targetNode.get('_id');
        Ext.Msg.confirm('提示', '是否删除该RtType？', callback);

        function callback(id) {
            if (id === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/rtTypes/' + targetNodeId,
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (res) {
                        var responseMessage = Ext.JSON.decode(res.responseText);
                        if (responseMessage.success == true) {
                            var treeStore = tree.getStore();
                            treeStore.load({
                                node: parentNode,
                                callback: function (records) {
                                    if (Ext.isEmpty(records)) {
                                        parentNode.set('leaf', true)
                                    }
                                }
                            });
                            var infoTab = tree.ownerCt.getComponent('infoTab')
                            infoTab.removeAll();
                            var saveButton = infoTab.child("toolbar").getComponent("btnSave");
                            saveButton.setDisabled(true);
                            infoTab.componentInit = false;
                        } else {
                            Ext.Msg.alert("提示", "请求错误:" + responseMessage.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });

            }
        }

    },
    itemEventMenu: function (view, record, e) {
        var me = this;
        var infoTab = view.ownerCt.ownerCt.getComponent('infoTab');
        var tree = view.ownerCt;
        infoTab.refreshData(record);
        e.stopEvent();

        var menu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: i18n.getKey('add'),
                    itemId: 'add',
                    handler: function () {
                        me.addRtType(tree);
                    }
                },
                {
                    text: i18n.getKey('delete'),
                    itemId: 'delete',
                    hidden: !record.get('leaf'),
                    handler: function () {
                        me.deleteRtType(tree);
                    }
                }
            ]
        });

        menu.showAt(e.getXY());


    },
    /**
     *
     * @param data
     * @param tree
     */
    saveRtType: function (data, tree) {
        var result = null;
        var node = tree.getSelectionModel().getSelection()[0];
        Ext.Ajax.request({
            url: adminPath + 'api/rtTypes/' + data['_id'],
            method: 'PUT',
            jsonData: data,
            async: false,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                if (responseMessage.success == true) {
                    /*var treeStore = tree.getStore();
                     var parentNode = treeStore.getNodeById(data.parentId);
                     var node = treeStore.getNodeById(data.id);
                     treeStore.suspendAutoSync();
                     Ext.Object.each(data, function (k, v) {
                     node.set(k, v);
                     });
                     node.dirty = false;
                     node.commit();
                     treeStore.load({node: parentNode});
                     treeStore.resumeAutoSync();*/
                    result = true;
                    Ext.Msg.alert('提示', '保存成功！');
                } else {
                    Ext.Msg.alert("提示", "请求错误:" + responseMessage.data.message);
                }
                ;
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
        return result;
    },
    /**
     * 选择属性给RtType添加属性
     * @param store
     * @param record
     * @param editOrNew
     */
    selectAttribute: function (attributeDefId, filterData) {

        Ext.create('CGP.rttypes.view.information.attribute.SelectAttributeWin', {
            attributeDefId: attributeDefId,
            filterData: filterData
        }).show();
    },
    /**
     *
     * @param store
     * @param record
     * @param editOrNew
     */
    editAttribute: function (store, record, editOrNew, filterData, grid) {
        Ext.create('CGP.rttypes.view.information.attribute.SelectAttributeWin', {
            store: store,
            record: record,
            editOrNew: editOrNew,
            filterData: filterData,
            rtAttributeDefGrid: grid
        }).show();
    },
    /**
     * 显示RtType的层次和结构
     * @param rtypeId
     */
    showRtTypeHierarchy: function (rtTypeId) {
        var treePanel = Ext.create('CGP.materialviewtype.view.RtObjectTree', {
            header: false,
            hiddenValue: true,
            rtTypeId: rtTypeId,
            hasReset: false,
            readOnly: true

        });
        var win = Ext.create('Ext.window.Window', {
            constrain: true,
            modal: true,
            layout: 'fit',
            height: 450,
            title: i18n.getKey('check') + i18n.getKey('RtType') + '<' + rtTypeId + '>' + '的rtAttributeDef',
            items: [
                treePanel
            ]
        });
        win.show();
    }
});
