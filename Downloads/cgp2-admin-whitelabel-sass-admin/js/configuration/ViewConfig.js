/**
 * Created by nan on 2018/4/17.
 */
Ext.onReady(function () {
    var tbar = Ext.create('Ext.toolbar.Toolbar', {
        items: [
            {
                itemId: 'btnSave',
                text: i18n.getKey('Save'),
                disabled: true,
                iconCls: 'icon_save', handler: function (view) {
                view.setDisabled(true);
                var jsonData = textarea.getValue();
                if (!Ext.isEmpty(jsonData)) {
                    try {
                        jsonData = JSON.parse(jsonData);
                    } catch (e) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('illlegal json'));
                        view.setDisabled(false);
                        return;
                    }
                }
                jsonData.clazz = 'com.qpp.cgp.domain.product.config.view.ViewConfig';
                Ext.Ajax.request({
                    url: adminPath + 'api/websites/' + websiteId + '/viewConfig',
                    method: 'put',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    jsonData: jsonData,
                    success: function (response) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                            view.setDisabled(false);
                            textarea.setDisabled(false);
                            window.location.reload()//重新加载页面
                        });
                    }
                })
            }
            }
        ]
    });
    var btnSave = tbar.getComponent('btnSave');
    var textarea = Ext.widget('textarea', {
        disabled: true
    });
    var page = Ext.create("Ext.form.Panel", {
        title: i18n.getKey('compile') + i18n.getKey('viewConfig'),
        height: 400,
        width: 500,
        region: 'center',
        frame: false,
        tbar: tbar,
        layout: {
            type: 'fit'
        }
    });
    page.add(textarea);
    new Ext.container.Viewport({
        layout: 'border',
        renderTo: 'jie',
        items: [ page ]
    });
    var websiteId = JSGetQueryString('websiteId');
    var viewConfig = '';
    Ext.Ajax.request({
        url: adminPath + 'api/websites/' + websiteId + '/viewConfig',
        method: 'GET',
        async: false,
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        success: function (response) {
            viewConfig = Ext.JSON.decode(response.responseText).data;
        }
    });
    if (Ext.isEmpty(viewConfig)) {
        Ext.Msg.confirm(i18n.getKey('prompt'), '当前的viewConfig为空，是否新建该配置？', function (select) {
            if (select == 'yes') {
                //新建一个没啥数据的配置
                Ext.Ajax.request({
                    url: adminPath + 'api/websites/' + websiteId + '/viewConfig',
                    method: 'POST',
                    async: false,
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    jsonData: {
                        "websiteId": websiteId,
                        "clazz": "com.qpp.cgp.domain.product.config.view.ViewConfig"
                    },
                    success: function (response) {
                        viewConfig = Ext.JSON.decode(response.responseText).data;
                        textarea.setValue(JSON.stringify(viewConfig, null, "\t"));
                        btnSave.setDisabled(false);
                        textarea.setDisabled(false);
                    }
                })
            } else {
                return;
            }
        })
    } else {
        textarea.setValue(JSON.stringify(viewConfig, null, "\t"));
        btnSave.setDisabled(false);
        textarea.setDisabled(false);
    }
});











