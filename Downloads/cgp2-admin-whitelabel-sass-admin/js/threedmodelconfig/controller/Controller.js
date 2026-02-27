Ext.define('CGP.threedmodelconfig.controller.Controller', {

    copyModelConfig: function (page, modelId) {
        var grid = page.grid;
        var store = grid.store;
        var button = Ext.widget({
            xtype: 'button',
            text: i18n.getKey('copy') + i18n.getKey('config'),
            iconCls: 'icon_copy',
            handler: function () {
                var selectItems = grid.getSelectionModel().getSelection();
                if (selectItems.length == 0) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '请选中需要复制的配置')
                    return;
                }
                Ext.Msg.confirm(i18n.getKey('prompt'), '是否复制选中的配置', function (id) {
                    if (id == 'yes') {
                        var win = Ext.create('Ext.window.Window', {
                            autoShow: true,
                            bodyStyle: 'padding:10px',
                            modal: true,
                            title: '输入新3d模型名称',
                            bbar: ['->', {
                                xtype: 'button',
                                text: i18n.getKey('confirm'),
                                itemId: 'confirm',
                                iconCls: 'icon_agree',
                                handler: function () {
                                    var form = win.down('form');
                                    var builderName = form.getComponent('builderName').getValue();
                                    if (form.isValid()) {
                                        var modelId = selectItems[0].get('_id');
                                        var requestUrl = adminPath + 'api/threedmodelconfigs/' + modelId + '/' + builderName + '/copy';
                                        Ext.Ajax.request({
                                            url: requestUrl,
                                            method: 'POST',
                                            headers: {
                                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                            },
                                            success: function (response) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                if (responseMessage.success) {
                                                    win.close();
                                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('copy') + i18n.getKey('success'), function () {
                                                        store.load();
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
                                }
                            }],
                            items: [{
                                xtype: 'form',
                                border: false,
                                items: [{
                                    xtype: 'textfield',
                                    itemId: 'builderName',
                                    name: 'builderName',
                                    fieldLabel: i18n.getKey('builderName'),
                                    allowBlank: false
                                }]
                            }]
                        });

                    }
                })
            },
            width: 90
        })
        page.toolbar.insert(button);
    },
    /**
     */
    editTreeDConfig: function (ticketId, subject, content) {

        Ext.Ajax.request({
            url: adminPath + 'api/admin/tickets/' + ticketId + '/reply',
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: {
                subject: subject,
                content: content
            },
            callback: function () {
                window.location.reload();
            }
        });

    },
    /**
     *
     * @param data threed model数据
     * @param versionConfigs 所有版本数据
     * @param configModelId modelId
     * @param editOrNew 当前编辑模式
     * @param panel 编辑主页
     */
    saveTreeDConfig: function (data, versionConfigs, configModelId, editOrNew, panel) {
        var me = this;
        var mask = panel.ownerCt.setLoading();
        data.clazz = 'com.qpp.cgp.domain.product.config.model.ThreeDModelConfig';
        var httpMethod = 'POST';
        var url = adminPath + 'api/threedmodelconfigs'
        if (editOrNew == 'edit') {
            httpMethod = 'PUT';
            url += '/' + configModelId;
        }
        Ext.Ajax.request({
            url: url,
            method: httpMethod,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            jsonData: data,
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                var configModelId = responseMessage.data._id;
                if (responseMessage.success) {
                    if (editOrNew == 'new') {
                        if (!Ext.isEmpty(versionConfigs)) {
                            me.batchAddTreeDConfigVersion(versionConfigs, data, mask, configModelId);
                        } else {
                            mask.hide();
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                        }
                    } else {
                        mask.hide();
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                    }
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                mask.hide();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    copyThreeDConfigVersion: function (grid){
        var store = grid.store;
        var selectItems = grid.getSelectionModel().getSelection();
        if (selectItems.length == 0) {
            Ext.Msg.alert(i18n.getKey('prompt'), '请选中需要复制的配置')
            return;
        }
        Ext.Msg.confirm(i18n.getKey('prompt'), '是否复制选中的配置', function (id) {
            if (id == 'yes') {
                var modelId = selectItems[0].get('_id');
                var requestUrl = adminPath + 'api/threedmodelvariableconfigs/' + modelId + '/copy';
                Ext.Ajax.request({
                    url: requestUrl,
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (response) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        if (responseMessage.success) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('copy') + i18n.getKey('success'), function () {
                                store.load();
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
    editTreeDConfigVersion: function (data, editOrNew, store, win, record, globalStatus) {
        var me = this;
        data.clazz = 'com.qpp.cgp.domain.product.config.model.ThreeJSVariableConfig';
        if (globalStatus == 'new') {
            if (editOrNew == 'new') {
                store.add(data);
            } else {
                Ext.Object.each(data, function (key) {
                    record.set(key, data[key])
                })
            }
        } else {
            me.saveTreeDConfigVersion(data, editOrNew, store, win, record);
        }
        win.close();
    },
    saveTreeDConfigVersion: function (data, editOrNew, store, win, record, globalStatus) {
        var url = adminPath + 'api/threedmodelvariableconfigs'
        var httpMethod = 'POST';
        if (editOrNew == 'edit') {
            httpMethod = 'PUT';
            url += '/' + record.getId();
        }
        Ext.Ajax.request({
            url: url,
            method: httpMethod,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            jsonData: data,
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    store.load();
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    openConfigVersionWin: function (record, editOrNew, globalStatus, store, configModelId, lastVersionId) {
        Ext.create('CGP.threedmodelconfig.view.EditConfigVersion', {
            editOrNew: editOrNew,
            lastVersionId: lastVersionId,
            record: record,
            globalStatus: globalStatus,
            store: store,
            configModelId: configModelId
        }).show();
    },
    addTreeDConfigVersion: function () {

    },
    /**
     *
     * @param versionConfigs 批量新建的versionConfig
     * @param data 3d
     * @param mask
     */
    batchAddTreeDConfigVersion: function (versionConfigs, data, mask, configModelId) {
        Ext.Ajax.request({
            url: adminPath + 'api/threedmodelvariableconfigs/' + data.modelName + '/batch',
            method: 'POST',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            jsonData: versionConfigs,
            success: function (response) {
                mask.hide();
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                    JSOpen({
                        id: '3dmodelConfig',
                        url: path + 'partials/threedmodelconfig/edit.html?recordId=' + configModelId + '&editOrNew=edit',
                        title: i18n.getKey('edit') + i18n.getKey('3dmodel'),
                        refresh: true
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                mask.hide();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    saveRuntimeConfig: function (data,win){
        var mask = win.setLoading();
        Ext.Ajax.request({
            url: adminPath + 'api/threeDModelRuntimeConfigs/'+data._id,
            method: 'PUT',
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('prompt'), '保存成功！');

                } else {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                mask.hide();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    transformtextureData: function (modelData) {
        var me = this;
        var result;
        if (Ext.isEmpty(modelData.object)) {
            result = me.dealSingleModelTexture(modelData);
        } else {
            result = me.dealMultiModelTexture(modelData);
        }
        return result;
    },
    dealSingleModelTexture: function (modelData) {
        var modelTextures = [];
        if (!Ext.isEmpty(modelData.materials)) {
            Ext.Array.each(modelData.materials, function (material) {
                var modelTexture = {name: '', location: '', type: '', useTransparentMaterial: false};
                modelTexture.name = material.DbgName;
                modelTexture.useTransparentMaterial = material.transparent;
                modelTexture.type = material.type;
                modelTextures.push(modelTexture);
            })
        }
        return modelTextures;
    },
    dealMultiModelTexture: function (modelData) {
        var modelTextures = [];
        var modelMaterials = [];
        Ext.Array.each(modelData.object.children, function (material) {
            if (!Ext.isEmpty(material.material)) {
                modelMaterials.push(material);
            }
        });
        Ext.Array.each(modelMaterials, function (modelMaterial) {
            var modelTexture = {name: '', location: '', type: '', useTransparentMaterial: false};
            modelTexture.name = modelMaterial.name;
            modelTexture.useTransparentMaterial = modelMaterial.transparent;
            modelTexture.type = modelMaterial.type;
            modelTextures.push(modelTexture);
        });
        return modelTextures;
    }

});
