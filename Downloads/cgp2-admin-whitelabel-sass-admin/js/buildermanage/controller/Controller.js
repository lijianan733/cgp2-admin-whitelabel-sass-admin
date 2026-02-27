Ext.define('CGP.buildermanage.controller.Controller', {
    /**
     *
     * @param data threed model数据
     * @param versionConfigs 所有版本数据
     * @param configModelId modelId
     * @param editOrNew 当前编辑模式
     * @param panel 编辑主页
     */
    saveConfig: function (data, versionConfigs, configModelId, editOrNew, panel) {
        var me = this;
        var mask = panel.ownerCt.setLoading();
        data.clazz = 'com.qpp.cgp.domain.product.config.v2.builder.SystemBuilderConfigV2';
        var httpMethod = 'POST';
        var url = adminPath + 'api/systemBuilderConfigsV2'
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
                        if(!Ext.isEmpty(versionConfigs)){
                            me.batchAddConfigVersion(versionConfigs, responseMessage.data,mask,configModelId);
                        }else{
                            mask.hide();
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                        }
                    }else{
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
    /**
     *
     * @param data
     * @param editOrNew
     * @param store
     * @param win
     * @param record
     * @param globalStatus
     */
    editConfigVersion: function (data, editOrNew, store, win, record, globalStatus) {
        var me = this;
        data.clazz = 'com.qpp.cgp.domain.product.config.v2.builder.SystemBuilderPublishVersion';
        if(globalStatus == 'new'){
            if(editOrNew == 'new'){
                store.add(data);
            }else{
                Ext.Object.each(data,function (key){
                    record.set(key,data[key])
                })
            }
        }else{
            me.saveConfigVersion(data,editOrNew,store,win,record);
        }
        win.close();
    },
    /**
     *
     * @param data
     * @param editOrNew
     * @param store
     * @param win
     * @param record
     * @param globalStatus
     */
    saveConfigVersion: function (data, editOrNew, store, win, record, globalStatus) {
        var url = adminPath + 'api/systemBuilderPublishVersions'
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
    openConfigVersionWin: function (record,editOrNew,globalStatus,store,configModelId,lastVersionId) {
        Ext.create('CGP.buildermanage.view.EditConfigVersion',{
            editOrNew: editOrNew,
            lastVersionId: lastVersionId,
            record: record,
            globalStatus: globalStatus,
            store: store,
            configModelId: configModelId
        }).show();
    },
    /**
     *
     * @param versionConfigs 批量新建的versionConfig
     * @param data 3d
     * @param mask
     */
    batchAddConfigVersion: function (versionConfigs, data, mask, configModelId) {
        Ext.Ajax.request({
            url: adminPath + 'api/systemBuilderConfigsV2/' + data._id + '/systemPublishVersionsBatch',
            method: 'POST',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            jsonData: versionConfigs,
            success: function (response) {
                mask.hide();
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                    JSOpen({
                        id: 'buildermanage',
                        url: path + 'partials/buildermanage/edit.html?recordId=' + configModelId+'&editOrNew=edit',
                        title: i18n.getKey('edit')+i18n.getKey('builder'),
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
    }

});