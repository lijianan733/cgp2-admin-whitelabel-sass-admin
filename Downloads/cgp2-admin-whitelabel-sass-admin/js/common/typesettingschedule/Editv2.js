Ext.syncRequire([
    'CGP.common.typesettingschedule.controller.Controller',
    'CGP.common.typesettingschedule.view.OptionalConfigContainer',
    'CGP.common.typesettingschedule.view.ImpressionFieldSet',
    'CGP.common.typesettingschedule.view.FileColumn',
    'CGP.common.typesettingschedule.view.TopStepBar',
    'CGP.common.typesettingschedule.view.DataContainer',
    'CGP.common.typesettingschedule.view.TypeSettingContainer',
    'CGP.common.typesettingschedule.view.StepItemsBtn',
    'CGP.common.typesettingschedule.view.EditPanel'
])
Ext.onReady(function () {
    var data = [],
        takeTime = null,
        orderItemId = null,
        id = JSGetQueryString('id'),
        url = composingPath + 'api/composing/progresses/' + id;

    JSSetLoading(true);
    JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
        JSSetLoading(false);
        if (success) {
            var responseText = Ext.JSON.decode(response.responseText);
            if (responseText.success) {
                orderItemId = responseText.data['datas']['orderItemId'];
                data = responseText.data['stages'];
            }
        }
    })
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'edit_panel',
                layout: 'hbox',
                data: data,
                orderId: id,
                orderItemId: orderItemId,
            }
        ]
    })
})