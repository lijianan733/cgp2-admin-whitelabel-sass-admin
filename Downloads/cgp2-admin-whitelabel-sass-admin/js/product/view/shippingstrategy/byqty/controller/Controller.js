Ext.define('CGP.product.view.shippingstrategy.byqty.controller.Controller', {
    /**
     *savePageContentSchemaGroup
     * @param {Object} data 新增或修改的数据
     * @param {Ext.data.Store} store store
     * @param {Ext.window.Window} win 编辑窗口
     * @param {String} editOrNew
     */
    savePageContentSchemaGroup: function (data, store, win, editOrNew) {
        var url = adminPath + 'api/productAreaShippingConfigs';
        var method = 'POST';
        if (editOrNew == 'edit') {
            url = url + '/' + data._id;
            method = 'PUT';
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var success = response.success;
                if (success) {
                    store.load();
                    win.close();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    /**
     *修改pageCintentSchemaGroup
     * @param {Object} data 新增或修改的数据
     * @param {Ext.data.Store} store 产品物料pageContentSchemaGroup store
     * @param {Ext.window.Window} win 编辑窗口
     */
    updatePageContentSchemaGroup: function (data, store, win) {
        Ext.Ajax.request({
            url: adminPath + 'api/pageContentSchemaGroups/' + data['_id'],
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var success = response.success;
                if (success) {
                    store.load();
                    win.close();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    /**
     * 创建条件本地上下文模板数据
     */
    buildContentData: function (productId) {
        var contentData = [];
        var url = adminPath + 'api/products/configurable/' + productId + '/skuAttributes';
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            var attributes = responseText.data;
            for (var i = 0; i < attributes.length; i++) {
                var item = attributes[i];
                var attribute = item.attribute;
                contentData.push({
                    key: attribute.id,
                    type: 'skuAttribute',
                    valueType: attribute.valueType,
                    selectType: attribute.selectType,
                    attrOptions: attribute.options,
                    required: item.required,
                    displayName: item.displayName + '(' + item.id + ')',//sku属性
                    path: 'args.context',//该属性在上下文中的路径
                    attributeInfo: item
                })
            }
        })
        return contentData;
    }

});
