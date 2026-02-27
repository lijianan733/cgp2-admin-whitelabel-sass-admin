Ext.define('CGP.pcspreprocesscommonsource.controller.Controller', {
    checkJsonData: function (data, tab) {
        var controller = this;
        var title = i18n.getKey('pcspreprocesscommonsource');
        var winConfig = {
            height: 620,
            showValue: true,
            editable: true,
            readOnly: false,
            isHiddenRawDateForm: true,
            bbar: [
                '->',
                {
                    text: i18n.getKey('ok'),
                    itemId: 'okBtn',
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var newData = win.getValue();
                        var recordData = controller.saveRecord(newData, tab);
                        //保存json数据后刷新
                        if (recordData) {
                            win.close();
                            if (location.search.includes('id')) {//编辑

                            } else {
                                location.href = location.href + '?id=' + recordData._id;
                            }
                        }
                    }
                }, {
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.close();
                    }
                }
            ]
        };
        JSShowJsonDataV2(data, title, null, winConfig);
    },
    saveRecord: function (data, tab) {
        var me = this;
        var recordData = null;
        var method = "POST";
        var url = adminPath + 'api/pcspreprocesscommonsource';
        if (!Ext.isEmpty(data._id)) {
            url += '/' + data._id;
            method = 'PUT';
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    recordData = resp.data;
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'));

                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            }
        });
        return recordData;
    },
    editSourceSkip: function (designId, type) {
        var me = this, url,title;
        if (designId) {
            url = path + 'partials/' + 'pcspreprocesscommonsource' + '/' + 'edit.html' + '?type=' + type + '&sourceId=' + designId;
            title = i18n.getKey(type)+'_'+i18n.getKey('edit');
        } else {
             url = path + 'partials/' + 'pcspreprocesscommonsource' + '/' + 'edit.html' + '?type=' + type;
            title = i18n.getKey(type)+'_'+i18n.getKey('add');
        }
        JSOpen({
            // id: id,
            url: url,
            title: title,
            refresh: true
        });
    }
})
