/**
 * Created by nan on 2021/10/8
 */
Ext.define('CGP.virtualcontainertype.controller.Controller', {
    saveConfig: function (data, panel) {
        data._id = panel.recordId;
        var model = new CGP.virtualcontainertype.model.VirtualContainerTypeModel(data);
        model.save({
            callback: function (model, action, success) {
                if (success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey(action.action == 'create' ? 'addsuccessful' : 'modifySuccess'));
                    panel.recordId = model.getId();
                    var tabPanel = top.Ext.getCmp('tabs').getComponent('virtualcontainertype_edit');
                    tabPanel.setTitle(i18n.getKey('edit') + '_' + i18n.getKey('virtualContainerType') + '(' + panel.recordId + ')');
                }
               
            }
        })
    },
    /**
     * 组建符合条件组件的属性上下文
     * @param rtTypeId
     * @returns {[]}
     */
    buildContentData: function (rtTypeId) {
        var contentData = [];
        var url = adminPath + 'api/rtTypes/' + rtTypeId + '/rtAttributeDefs';
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            var attributes = responseText.data;
            for (var i = 0; i < attributes.length; i++) {
                var attribute = attributes[i];
                var attrOptions = [];
                for (var j = 0; j < attribute.options.length; j++) {
                    attrOptions.push({
                        name: attribute.options[j].name,
                        id: attribute.options[j].value,
                    })
                }
                contentData.push({
                    id: attribute.id,
                    key: attribute.name,
                    type: 'skuAttribute',
                    valueType: attribute.valueType,
                    selectType: attribute.selectType,
                    attrOptions: attrOptions,
                    required: attribute.required,
                    displayName: attribute.name,//sku属性
                    path: 'args.context',//该属性在上下文中的路径
                    attribute: attribute
                })
            }
        })
        return contentData;
    }

})