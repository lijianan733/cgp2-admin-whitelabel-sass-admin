Ext.define("CGP.monthimagegroup.controller.Controller", {
    /**
     * 保存配置
     */
    saveConfig: function (data, form) {
        form.el.mask('加载中...');
        var url = adminPath + 'api/monthimagegroups';
        var method = 'POST';
        if (!Ext.isEmpty(data._id)) {
             url = adminPath + 'api/monthimagegroups/'+data._id;
             method = 'PUT';
        }
        var successMsg = i18n.getKey('保存成功');
        JSAjaxRequest(url, method, false, data, successMsg, function (require, success, response) {
            form.el.unmask();

        })

    }
});