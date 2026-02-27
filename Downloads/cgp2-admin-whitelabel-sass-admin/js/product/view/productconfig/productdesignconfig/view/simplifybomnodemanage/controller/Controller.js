/**
 * Created by nan on 2019/7/10.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.controller.Controller', {
    /**
     * 获取关联物料的materialPath
     * @param {Number} productBomConfigId productDesignConfig兼容的最新productBomConfig版本的ID
     * @param {String} materialPath
     */
    getMaterialPath: function (materialId, materialPath, component, createOrEdit, simplifyNodesMaterial, sbomNode) {
        var materialId = materialId;
        Ext.Ajax.request({
            url: adminPath + 'api/materials/' + materialId,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var success = response.success;
                if (success) {
                    var data = response.data;
                    var materialName = data.name;
                    var materialId = data._id;
                    var type;
                    if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialType') {
                        type = 'MaterialType'
                    } else if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                        type = 'MaterialSpu'
                    }
                    Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.view.SelectBomTreeNodeWindow', {
                        createOrEdit: createOrEdit,
                        materialPath: materialPath,
                        simplifyNodesMaterial: simplifyNodesMaterial,
                        root: {
                            _id: materialId,
                            clazz: data.clazz,
                            name: materialName,
                            type: type,
                            icon: type == 'MaterialSpu' ? '../simplifybomnodemanage/S.png' : '../simplifybomnodemanage/T.png'
                        },
                        bbar: {
                            items: ['->', {
                                xtype: 'button',
                                text: i18n.getKey('confirm'),
                                handler: function () {
                                    var win = this.ownerCt.ownerCt;
                                    var selectNode = win.getComponent('bomTree').getSelectionModel().getSelection()[0];
                                    if (!Ext.isEmpty(selectNode)) {
                                        if (selectNode.get('type') == 'MaterialType' || selectNode.get('type') == 'MaterialSpu') {
                                            var valueArr = selectNode.getPath('pathID').split("/");
                                            //valueArr.splice(0, 1);
                                            var value = '';
                                            if (component.getName() == 'materialId') {
                                                value = valueArr[valueArr.length - 1];
                                            } else {
                                                value = valueArr.join(',');
                                                value = value.split(',').slice(1).toString();
                                                /*value =  materialId + ',' + value;
                                                if (!Ext.isEmpty(sbomNode)) {
                                                    value = sbomNode.parentNode.get('materialPath') + ',' + value;
                                                }*/
                                            }
                                            component.materialName = selectNode.get('name')
                                            component.setValue(value);
                                            win.close();
                                        } else {
                                            Ext.Msg.alert('提示', '请选择一个物料');
                                        }
                                    } else {
                                        Ext.Msg.alert('提示', '请选择一个物料');
                                    }
                                }
                            }, {
                                xtype: 'button',
                                text: i18n.getKey('cancel'),
                                handler: function () {
                                    var win = this.ownerCt.ownerCt;
                                    win.close();
                                }
                            }]

                        }

                    }).show();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    saveFormValue: function (form) {
        var jsonData = null;
        jsonData = form.record.raw;
        jsonData = Ext.Object.merge(jsonData, form.getValues());
        jsonData.clazz = 'com.qpp.cgp.domain.simplifyBom.SBNode';
        if (jsonData.rtType) {
            jsonData.rtType = {
                clazz: 'com.qpp.cgp.domain.bom.attribute.RtType',
                _id: jsonData.rtType
            }
        }
        if (jsonData.rtObject) {
            jsonData.rtObject = form.getComponent('rtObject').getValue();
        }
        if (form.record.parentNode.isRoot()) {
        } else {
            var parentNode = form.record.parentNode;
            var parentNodeSbomPath = parentNode.get('sbomPath');
            var pathArray = jsonData.sbomPath.split(parentNodeSbomPath + ',');
            pathArray = pathArray.slice(1);//截取第二个到最后的数据
            jsonData.sbomPath = pathArray.toString();

        }
        Ext.Ajax.request({
            url: adminPath + 'api/SBNodeController/' + form.record.getId(),
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: jsonData,
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                        form.record.set('description', responseMessage.data.description);
                        var parentNode = form.record.parentNode;
                        var treeStore = form.record.store;
                        var treePanel = treeStore.ownerTree;
                        treeStore.load({
                            node: parentNode,
                            callback: function (records) {
                                parentNode.expand();
                                var newNode = treeStore.getNodeById(responseMessage.data['_id']);
                                treePanel.getSelectionModel().select(newNode);
                            }
                        });
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    addNewSimplifyBomNode: function (treePanel, record) {
        console.log(treePanel.simplifyNodesMaterial);
        var materialId = record.raw.sbomPath.split(',').pop();
        var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.view.CreateSimplifyBomTreeNodeWindow', {
            materialId: materialId,
            record: record,
            simplifyNodesMaterial: treePanel.simplifyNodesMaterial,
            productConfigDesignId: treePanel.productConfigDesignId
        })
        win.show();

    },
    deleteSimplifyBomNode: function (tree, record) {
        var parentNode = record.parentNode;
        var infoPanel = tree.ownerCt.getComponent('infoPanel');
        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
            if (selector == 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/SBNodeController/' + record.getId(),
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        if (responseMessage.success) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'), function () {
                                parentNode.removeChild(record);
                                var treeStore = parentNode.store;
                                treeStore.load({
                                    node: parentNode,
                                    callback: function (records) {
                                        parentNode.set('isLeaf', false);
                                        parentNode.set('leaf', false);
                                        parentNode.expand();
                                        var toolbar = infoPanel.getDockedItems('toolbar[dock="top"]')[0];
                                        if (infoPanel) {
                                            for (var i = 0; i < toolbar.items.items.length; i++) {
                                                toolbar.items.items[i].setDisabled(true);
                                            }
                                            for (var i = 0; i < infoPanel.items.items.length; i++) {
                                                infoPanel.items.items[i].hide();
                                            }
                                        }
                                    }
                                });
                            });
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                        }
                    },
                    failure: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                });
            }
        })

    },
    addSMVT: function (data, store, sbomNode, simplifyBomConfigId, editTab) {
        var me = this;
        Ext.Ajax.request({
            url: adminPath + 'api/simplifyMaterialViewType/simplifyBomConfig/' + simplifyBomConfigId,
            method: 'POST',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    editTab.setValue(response.data);
                    editTab.setTitle(i18n.getKey('edit') + i18n.getKey('smvt'));
                    store.load();
                    Ext.Msg.alert('提示', '添加成功！');
                } else {
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    deleteSMVT: function (recordId, store, sbomNode) {
        var me = this;
        Ext.Msg.confirm('提示', '是否删除？', callback);

        function callback(id) {
            if (id === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/simplifyMaterialViewType/' + recordId + '/SimplifyBomConfig',
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var success = response.success;
                        if (success) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('delete') + i18n.getKey('success') + '!');
                            store.load()

                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                })
            }
        }
    },
    updataSMVT: function (data, store) {
        Ext.Ajax.request({
            url: adminPath + 'api/simplifyMaterialViewType/' + data._id,
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    Ext.Msg.alert('提示', '保存成功！');
                } else {
                    Ext.Msg.alert('提示', '保存失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    saveSimplifyBomConfig: function (editOrNew, data) {
        Ext.Ajax.request({
            url: adminPath + 'api/simplifyBomController',
            method: 'POST',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                } else {
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    editSmvt: function (topTab, editOrNew, recordId, productBomConfigId, productConfigDesignId, sbomNodeId, sbomNode, simplifyBomConfigId, store) {
        var me = this;
        var tab = topTab.getComponent('editSmvt');
        if (tab != null) {
            topTab.remove(tab);
        }
        tab = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.view.EditSmvt', {
            recordId: recordId,
            editOrNew: editOrNew,
            itemId: 'editSmvt',
            topTab: topTab,
            productBomConfigId: productBomConfigId,
            productConfigDesignId: productConfigDesignId,
            sbomNodeId: sbomNodeId,
            store: store,
            sbomNode: sbomNode,
            simplifyBomConfigId: simplifyBomConfigId,
            closable: true
        });
        topTab.add(tab);
        if (recordId) {
            CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.model.SimplifySBOMMaterialViewType.load(recordId, {
                scope: this,
                failure: function (record, operation) {
                    //do something if the load failed
                },
                success: function (record, operation) {
                    console.log(record.getData());
                    tab.setValue(record.getData());
                    //do something if the load succeeded
                },
                callback: function (record, operation) {
                    //do something whether the load succeeded or failed
                }
            })
        }
        topTab.setActiveTab(tab);
    },
    /**
     * 保存改简易bom配置中该节点用到的pmvt数据
     * @param bomConfigId
     * @param nodeId
     * @param PMVTArr
     * @param PMVTGrid
     */
    savePMVT: function (bomConfigId, nodeId, PMVTArr, PMVTGrid, message) {
        var url = adminPath + 'api/simplifyBomConfigs/' + bomConfigId + '/viewDisplayConfig';
        var jsonData = {
            nodeId: nodeId,
            displayProductMaterialTypeIds: PMVTArr
        };
        JSAjaxRequest(url, 'PUT', false, jsonData, message, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    PMVTGrid.store.load();
                }
            }
        })
    }
})
