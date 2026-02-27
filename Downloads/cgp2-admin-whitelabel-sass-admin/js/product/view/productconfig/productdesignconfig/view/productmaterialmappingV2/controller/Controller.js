Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV2.controller.Controller', {
    editMaterialMapping: function (data, store, editOrNew, productConfigDesignId, productBomConfigId) {
        var me = this;
        Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV2.edit', {
            store: store,
            data: data,
            productBomConfigId: productBomConfigId,
            controller: me,
            productConfigDesignId: productConfigDesignId,
            editOrNew: editOrNew
        }).show();
    },
    deleteMaterialMapping: function (materialMappingId, store) {
        Ext.Msg.confirm('提示', '是否删除？', callback);
        function callback(id) {
            if (id === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/materialMappingConfigs/' + materialMappingId,
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var success = response.success;
                        if (success) {
                            store.load();
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
    updataMaterialMapping: function (data, store, win) {
        Ext.Ajax.request({
            url: adminPath + 'api/materialMappingConfigs/' + data._id,
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    store.load();
                    win.close();
                    Ext.Msg.alert('提示', '修改成功！');
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
    newMaterialMapping: function (data, store, win) {
        Ext.Ajax.request({
            url: adminPath + 'api/materialMappingConfigs',
            method: 'POST',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    store.load();
                    win.close();
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
    }
});