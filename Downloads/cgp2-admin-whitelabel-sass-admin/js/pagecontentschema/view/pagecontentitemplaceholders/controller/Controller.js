/**
 * Created by nan on 2020/9/1.
 */
Ext.define('CGP.pagecontentschema.view.pagecontentitemplaceholders.controller.Controller', {
    savePageContentItemPlaceholder: function (data, pageContentSchemaId, store, tipInfo, form) {
        Ext.Ajax.request({
            url: adminPath + 'api/pageContentSchemas/' + pageContentSchemaId + '/pageContentItemPlaceholders',
            method: 'PUT',
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey(tipInfo));
                    store.load();
                    if (form) {
                        var copyBtn = form.getDockedItems('toolbar[dock="top"]')[0].getComponent('copyBtn');
                        copyBtn.setDisabled(false);
                        var pageContentSchemaEdit = top.Ext.getCmp('tabs').getComponent('pagecontentitemplaceholders_edit');
                        pageContentSchemaEdit.setTitle(i18n.getKey('edit') + '_' + i18n.getKey('pagecontentitemplaceholders'));
                        form.createOrEdit = 'edit';
                    }
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    }
})
