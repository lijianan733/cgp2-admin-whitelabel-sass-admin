/**
 * Created by nan on 2020/3/9.
 */
Ext.define('CGP.product.view.mappinglink.controller.Controller', {
    /**
     * 检查链的合法性
     */
    checkUpMappingLink: function (mappingLinkId, grid) {
        grid.getView().loadMask.show();
        Ext.Ajax.request({
            url: adminPath + 'api/mappingLink/check/' + mappingLinkId,
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    grid.getView().loadMask.hide();
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('该mappingLink符合要求。'));

                } else {
                    grid.getView().loadMask.hide();
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                grid.getView().loadMask.hide();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    }
})
