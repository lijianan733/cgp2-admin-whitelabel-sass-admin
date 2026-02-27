/**
 * Created by nan on 2020/5/21.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.controller.Controller', {
    getMMDetail: function (mmtId) {
        var result = null;
        Ext.Ajax.request({
            url: adminPath + 'api/materials/' + mmtId,
            method: 'GET',
            async: false,//同步请求
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    result = responseMessage.data;
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
        return result;
    },
    /**
     * 更新指定记录的期望
     * @param executeExpert
     * @param recordId
     */
    updateExecuteExpert: function (executeExpert, recordId) {
        var result = null;
        Ext.Ajax.request({
            url: adminPath + 'api/materialMappingTestRecords/' + recordId + '/executeExpert/' + executeExpert,
            method: 'PUT',
            async: false,//同步请求
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('modifySuccess'));
                    result = true;
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
        return result;
    },
    /**
     *
     * @param testData
     */
    retryTestMapping: function (testData, productDesignId, store, configType) {
        var jsonData = {
            "productAttributes": [testData],
            "productConfigDesignId": productDesignId
        };
        if (configType == 'mappingConfig') {
            jsonData.productConfigMappingId = productDesignId;
            delete jsonData.productConfigDesignId;
        }
        var result = null;
        Ext.Ajax.request({
            url: adminPath + 'api/materialMappingTestRecords',
            method: 'POST',
            async: false,
            jsonData: jsonData,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    result = true;
                    Ext.Msg.alert(i18n.getKey('requestFailed'), '重测成功', function () {
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
        })
        return result;

    },
    /**
     * 解析propertyModelId生成对应的测试数据
     */
    builderTestData: function (propertyModelId) {
        var url = adminPath + 'api/attributeProperty/' + propertyModelId;
        var result = {};
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                result = responseText.data
            }
        });
        var attributes = [];
        result.profileModels.forEach(function (profile) {
            profile.attributeList.forEach(function (attribute) {
                attributes.push(attribute);
            })
        })
        console.log(attributes);
        var resultMap = {};
        attributes.forEach(function (attribute) {
            var value = attribute.value;
            if (Ext.isEmpty(attribute.value)) {
                value = null;
            }
            if (attribute.selectType == 'SINGLE') {
                resultMap[attribute.attributeId] = value ? value.toString() : null;
            } else if (attribute.selectType == 'MULTI') {
                resultMap[attribute.attributeId] = value;
            } else if (attribute.selectType == 'NON') {
                resultMap[attribute.attributeId] = value ? value.toString() : null;
            }
        })
        return resultMap;
    }
})
