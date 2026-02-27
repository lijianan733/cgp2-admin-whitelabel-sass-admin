/**
 * @author xiu
 * @date 2023/10/16
 */
Ext.define('CGP.tools.createPathFile.controller.Controller', {
    //修改
    editQuery: function (url, jsonData, isEdit) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, true, jsonData, successMsg, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
                }
            }
        }, true);
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn) {
        var method = isEdit ? 'PUT' : 'POST';

        JSAjaxRequest(url, method, true, jsonData, false, callFn, true);
    },

    //查询
    getQuery: function (url) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
                }
            }
        })
        return data;
    },

    //删除
    deleteQuery: function (url) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    console.log(responseText.data.content || responseText.data);
                }
            }
        }, true)
    },

    //获取url
    getUrl: function (author, params) {
        const urlGather = {
                templateUrl: function () {
                    return 'api/templates?page=1&start=0&limit=25&filter=[{"name":"type","value":"CONFIGURATION","type":"string"}]'
                },
                templateInfoUrl: function () {
                    const {templateName} = params;
                    return 'api/templates/' + templateName + '/config/info'
                },
                createPathUrl: function () {
                    const {layer, dpi, templateName} = params;
                    return 'api/templates/' + templateName + '/path?layer=' + layer + '&dpi=' + dpi
                },
                createFileUrl: function () {
                    const {templateName} = params;
                    return 'api/templates/' + templateName + '/instance'
                }
            }
        return DSServerPath + urlGather[author]();
    },
})