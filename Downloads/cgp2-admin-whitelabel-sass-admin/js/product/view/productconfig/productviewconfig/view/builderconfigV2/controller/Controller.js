/**
 * Created by nan on 2020/11/5
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.controller.Controller', {
    saveBuilderConfigV2: function (data, tab, successMsg) {
        var result = null;
        var url = adminPath + 'api/builderconfigs/v2';
        var method = 'POST';
        if (tab.builderConfigData && tab.builderConfigData._id) {
            url = url + '/' + data._id;
            method = 'PUT';
        }
        var jsonData = data;
        tab.el.mask('加载中..');
        tab.updateLayout();
        var result = JSAjaxRequest(url, method, false, jsonData, successMsg, function (require, success, response) {
            var responseMessage = Ext.JSON.decode(response.responseText);
            tab.builderConfigData = responseMessage.data;
            tab.el.unmask();
        });
        return result;
    },
})