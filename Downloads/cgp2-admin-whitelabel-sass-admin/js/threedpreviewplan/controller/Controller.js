Ext.define('CGP.threedpreviewplan.controller.Controller', {
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
    },
    saveTestPlan:function (editOrNew,data,editPanel,recordId){
        var me = this;
        var url = 'api/threedmodeltestplans';
        var requireMethod = 'POST';
        var mask = editPanel.setLoading();
        if(editOrNew == 'edit'){
            url = url+'/' + recordId;
            requireMethod = 'PUT';
        }
        Ext.Ajax.request({
            url: adminPath + url,
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
                    editPanel.editOrNew = 'edit';
                    editPanel.configModelId = responseMessage.data._id;
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
    }
})
