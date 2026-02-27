Ext.define('CGP.pcoperatormanage.controller.Controller',{
    editOperator: function (createOrEdit, record) {
        if (createOrEdit == 'edit') {
            var operatorId = record.getId();
            JSOpen({
                id: 'operator' + '_edit',
                url: path + "partials/pcoperatormanage/bpmn.html?clazzId=" + operatorId + '&createOrEdit=edit',
                title: i18n.getKey('operatorConfig') + i18n.getKey('edit') + '(' + operatorId + ')',
                refresh: true
            });
        } else {
            Ext.Ajax.request({
                url: adminPath + 'api/operatorcontroller',
                method: 'POST',
                jsonData: {
                    "clazz": "com.qpp.cgp.domain.preprocess.operator.SourceOperatorConfig",
                    "sourceType": "target"
                },
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        var operatorId = responseMessage.data._id;
                        JSOpen({
                            id: 'operator' + '_edit',
                            url: path + "partials/pcoperatormanage/bpmn.html?clazzId=" + operatorId + '&createOrEdit=create',
                            title: i18n.getKey('operatorConfig') + i18n.getKey('create') + '(' + operatorId + ')',
                            refresh: true
                        });
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
    }
})
