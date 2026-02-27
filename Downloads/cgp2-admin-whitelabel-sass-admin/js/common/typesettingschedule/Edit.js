/**
 * @author xiu
 * @date 2022/10/25
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.controller.Controller',
    'CGP.common.typesettingschedule.view.OptionalConfigContainer',
    'CGP.common.typesettingschedule.view.ImpressionFieldSet',
    'CGP.common.typesettingschedule.view.FileColumn',
    'CGP.common.typesettingschedule.view.TopStepBar',
    'CGP.common.typesettingschedule.view.DataContainer',
    'CGP.common.typesettingschedule.view.TypeSettingContainer',
])
Ext.onReady(function () {
    var data = [], orderItemId,
        id = JSGetQueryString('id'),
        url = composingPath + 'api/composing/progresses/' + id,
        controller = Ext.create('CGP.common.typesettingschedule.controller.Controller');

    JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
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
                xtype: 'panel',
                itemId: 'typesettingSchedule',
                layout: 'vbox',
                autoScroll: true,
                defaults: {
                    margin: '10 50 0 50'
                },
                items: [
                    {
                        xtype: 'uxfieldcontainer',
                        width: '100%',
                        itemId: 'uxfieldcontainer',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'top_stepbar',
                                width: 700,
                                isOn: true,
                                queryData: data,
                                stepItemDefault: {
                                    clickColor: '#409eff' //'#3DD073'
                                },
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('刷新页面'),
                                iconCls: 'icon_reset',
                                ui: 'default-toolbar-small',
                                bodyStyle: {
                                    'transform': 'translationX(900px)'
                                },
                                handler: function () {
                                    location.reload()
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'data_container',
                        width: '100%',
                        initData: data[0],
                        title: i18n.getKey('init') + '(' + i18n.getKey(controller.getDataStatus(data[0])) + ')',
                    },
                    {
                        xtype: 'type_setting',
                        width: '100%',
                        orderId: id,
                        typeSettingData: data[1],
                        orderItemId: orderItemId,
                        title: i18n.getKey('typesetting') + '(' + i18n.getKey(controller.getDataStatus(data[1])) + ')',
                    },
                    {
                        xtype: 'data_container',
                        width: '100%',
                        initData: data[2],
                        title: i18n.getKey('createContent') + '(' + i18n.getKey(controller.getDataStatus(data[2])) + ')',
                    },
                ]
            }
        ]
    });

})